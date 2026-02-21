from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.vision import detect_food
from app.nutrition import get_nutrition
from app.models import Base, FoodLog
from app.database import engine, SessionLocal
from datetime import datetime, date,  timedelta
from sqlalchemy import func
from fastapi import Form
import os
from pydantic import BaseModel
from openai import OpenAI

from typing import Optional, Dict # for chatbot


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Calorie AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_food(
    file: UploadFile = File(...), 
    portion: str = Form("medium")  # Add this to handle the extra data
):
    result = await detect_food(file)

    main_food = result.get("main", "unknown")
    components = result.get("components", [])
    portions = result.get("portions", {})

    nutrition = get_nutrition(main_food, components, portions)

    # ---- SAVE TO DATABASE ----
    if main_food != "unknown":
        db = SessionLocal()

        entry = FoodLog(
            food=main_food,
            calories=nutrition["total"]["calories"],
            protein=nutrition["total"]["protein"],
            fat=nutrition["total"]["fat"],
            carbs=nutrition["total"]["carbs"],
            timestamp=datetime.utcnow()
        )

        db.add(entry)
        db.commit()
        db.close()

    return {
        "food": main_food,
        "components": components,
        "portions": portions,
        "nutrition": nutrition
    }
@app.get("/summary/daily")
def daily_summary():
    db = SessionLocal()
    today = date.today()

    result = db.query(
        func.sum(FoodLog.calories).label("calories"),
        func.sum(FoodLog.protein).label("protein"),
        func.sum(FoodLog.fat).label("fat"),
        func.sum(FoodLog.carbs).label("carbs")
    ).filter(
        func.date(FoodLog.timestamp) == today
    ).first()

    db.close()

    return {
        "date": str(today),
        "totals": {
            "calories": round(result.calories or 0, 2),
            "protein": round(result.protein or 0, 2),
            "fat": round(result.fat or 0, 2),
            "carbs": round(result.carbs or 0, 2),
        }
    }

@app.get("/summary/weekly")
def weekly_summary():
    db = SessionLocal()
    today = date.today()
    week_start = today - timedelta(days=7)

    result = db.query(
        func.sum(FoodLog.calories).label("calories"),
        func.sum(FoodLog.protein).label("protein"),
        func.sum(FoodLog.fat).label("fat"),
        func.sum(FoodLog.carbs).label("carbs")
    ).filter(
        FoodLog.timestamp >= week_start
    ).first()

    db.close()

    return {
        "week_start": str(week_start),
        "week_end": str(today),
        "totals": {
            "calories": round(result.calories or 0, 2),
            "protein": round(result.protein or 0, 2),
            "fat": round(result.fat or 0, 2),
            "carbs": round(result.carbs or 0, 2),
        }
    }

class ManualFoodEntry(BaseModel):
    food: str
    portion: str = "medium"

@app.post("/analyze-manual")
def analyze_manual(entry: ManualFoodEntry):
    prompt = f"""
    Provide nutrition info for '{entry.food}' with portion '{entry.portion}'.
    Also, return the name of the food GPT thinks is correct as 'food'.
    Respond as JSON ONLY with keys: food, calories, protein, fat, carbs.
    All numeric values should be numbers.
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    # === DEBUG PRINT ===
    print("RAW GPT RESPONSE:", response)
    print("RAW CONTENT:", response.choices[0].message.content)

    import json
    try:
        nutrition = json.loads(response.choices[0].message.content)
        food_name = nutrition.get("food", entry.food)  # GPT corrected name
        calories = float(nutrition.get("calories", 0))
        protein  = float(nutrition.get("protein", 0))
        fat      = float(nutrition.get("fat", 0))
        carbs    = float(nutrition.get("carbs", 0))
    except Exception:
        # fallback if GPT response is invalid
        food_name = entry.food
        calories = protein = fat = carbs = 0

    db = SessionLocal()
    log = FoodLog(
        food=food_name,   # store GPT-corrected name
        calories=calories,
        protein=protein,
        fat=fat,
        carbs=carbs,
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    db.close()

    return {
        "food": food_name,       # return GPT-corrected name
        "portion": entry.portion,
        "nutrition": {
            "calories": calories,
            "protein": protein,
            "fat": fat,
            "carbs": carbs
        }
    }

# Request body model
class ChatRequest(BaseModel):
    message: str
    summary: Optional[Dict[str, float]] = None # calories, protein, carbs, fat


class ChatResponse(BaseModel):
    reply: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_message = request.message
    summary = request.summary or {}

    system_prompt = "You are a helpful nutrition assistant."
    if summary:
        summary_text = ", ".join(f"{k}: {v}" for k, v in summary.items())
        system_prompt += f" The user has eaten today: {summary_text}."

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=150
        )

        reply = response.choices[0].message.content.strip()
        return {"reply": reply}

    except Exception as e:
        return {"reply": f"Sorry, something went wrong: {str(e)}"}

# @app.post("/api/chat", response_model=ChatResponse)
# async def chat_endpoint(request: ChatRequest):
#     user_message = request.message

#     try:
#         response = client.chat.completions.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": "You are a helpful nutrition assistant."},
#                 {"role": "user", "content": user_message}
#             ],
#             temperature=0.7,
#             max_tokens=150
#         )

#         # Access content using dot notation
#         reply = response.choices[0].message.content.strip()

#         return {"reply": reply}

#     except Exception as e:
#         return {"reply": f"Sorry, something went wrong: {str(e)}"}

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.vision import detect_food
from app.nutrition import get_nutrition
from app.models import Base, FoodLog, ManualFoodEntry, UserGoal
from app.database import engine, SessionLocal
from datetime import datetime, date,  timedelta
from sqlalchemy import func
from fastapi import Form, Body
import os
from openai import OpenAI



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
            timestamp=datetime.now()
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

@app.get("/summary/weekly-breakdown")
def weekly_breakdown():
    db = SessionLocal()
    today = date.today()
    week_start = today - timedelta(days=6)

    # This query gets totals for each day individually
    results = db.query(
        func.date(FoodLog.timestamp).label("day"),
        func.sum(FoodLog.calories).label("calories")
    ).filter(
        FoodLog.timestamp >= week_start
    ).group_by(
        func.date(FoodLog.timestamp)
    ).all()

    db.close()
    return [{"day": str(r.day), "calories": r.calories} for r in results]



# 1. SEARCH ONLY (Does not save to DB)
@app.post("/analyze-manual")
def analyze_manual(entry: ManualFoodEntry):
    prompt = f"Provide nutrition info for '{entry.food}' with portion '{entry.portion}'. JSON ONLY: {{'food': 'name', 'calories': 0, 'protein': 0, 'fat': 0, 'carbs': 0}}"

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    
    import json
    nutrition = json.loads(response.choices[0].message.content)
    
    # Return to frontend for review, DON'T save to FoodLog yet
    return {
        "food": nutrition.get("food", entry.food),
        "nutrition": nutrition
    }

# 2. LOG TO DATABASE (Triggered by 'Confirm' button)
@app.post("/log-manual")
def log_manual(data: dict): # Expecting food name and nutrition values
    db = SessionLocal()
    log = FoodLog(
        food=data["food"],
        calories=data["calories"],
        protein=data["protein"],
        fat=data["fat"],
        carbs=data["carbs"],
        timestamp=datetime.now()
    )
    db.add(log)
    db.commit()
    db.close()
    return {"status": "success", "message": "Meal logged!"}

@app.get("/summary/daily-log")
def daily_log():
    db = SessionLocal()
    today = date.today()
    
    # Fetch all logs for today, ordered by newest first
    logs = db.query(FoodLog).filter(
        func.date(FoodLog.timestamp) == today
    ).order_by(FoodLog.timestamp.desc()).all()
    
    db.close()
    
    return [
        {
            "id": log.id,
            "food": log.food,
            "calories": log.calories,
            "protein": log.protein,
            "fat": log.fat,
            "carbs": log.carbs,
            "time": log.timestamp.strftime("%H:%M") # Format time as HH:MM
        } for log in logs
    ]

@app.get("/goals/daily")
def get_daily_goals():
    db = SessionLocal()
    goal = db.query(UserGoal).first()  # single user scenario
    db.close()
    if goal:
        return {
            "calories": goal.calories,
            "protein": goal.protein,
            "carbs": goal.carbs,
            "fat": goal.fat,
        }
    return {"calories": 2000, "protein": 100, "carbs": 200, "fat": 70}  # default

@app.post("/goals/daily")
def set_daily_goals(data: dict = Body(...)):
    db = SessionLocal()
    goal = db.query(UserGoal).first()
    if not goal:
        goal = UserGoal()
        db.add(goal)
    goal.calories = data.get("calories", goal.calories)
    goal.protein = data.get("protein", goal.protein)
    goal.carbs = data.get("carbs", goal.carbs)
    goal.fat = data.get("fat", goal.fat)
    db.commit()
    db.close()
    return {"status": "success", "goal": data}



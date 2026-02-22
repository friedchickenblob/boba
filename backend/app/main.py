from dotenv import load_dotenv
load_dotenv()

from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from app.vision import detect_food
from app.nutrition import get_nutrition
from app.models import Base, FoodLog, User, ManualFoodEntry, UserGoal
from app.database import engine, SessionLocal
from datetime import datetime, date,  timedelta
from sqlalchemy import func
from fastapi import Form, Body
import os
from openai import OpenAI

from typing import Optional, Dict # for chatbot
from app.auth.discord import router as discord_router
from fastapi.responses import RedirectResponse


from starlette.middleware.sessions import SessionMiddleware

from fastapi import HTTPException, Request


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Calorie AI Backend")

app.add_middleware(SessionMiddleware, secret_key=os.environ["SESSION_SECRET"], same_site="lax")

origins = [
    "https://boba-liard.vercel.app",  # your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # <- frontend domains allowed
    allow_credentials=True,
    allow_methods=["*"],    # allow GET, POST, etc.
    allow_headers=["*"],    # allow all headers
)

app.include_router(discord_router)

# @app.get("/")
# async def root():
#     return RedirectResponse(url="/docs")
@app.get("/")
async def root():
    return {"greeting": "Hello, World!", "message": "Welcome to FastAPI!"}

@app.get("/auth/me")
def get_current_user(request: Request):
    user_id = request.session.get("user_id")
    print("in auth me", user_id)

    if not user_id:
        return {"user": None}

    db = SessionLocal()
    user = db.query(User).filter(User.discord_id == user_id).first()
    db.close()

    if not user:
        return {"user": None}

    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "avatar": user.avatar,
        }
    }

@app.post("/auth/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "logged out"}

@app.get("/debug/users")
def list_users(db):
    return db.query(User).all()

@app.post("/analyze")
async def analyze_food(
    file: UploadFile = File(...), 
    portion: str = Form("medium"),  # Add this to handle the extra data
    request: Request = None
):
    result = await detect_food(file)

    main_food = result.get("main", "unknown")
    components = result.get("components", [])
    portions = result.get("portions", {})

    nutrition = get_nutrition(main_food, components, portions)

    # ---- SAVE TO DATABASE ----
    if main_food != "unknown":
        db = SessionLocal()
        # user = db.query(User).filter(User.discord_id == "435939911455997952").first()
        user_id = request.session.get("user_id")
        print("user id:", repr(user_id))
        if user_id == None: return None
        user = db.query(User).filter(User.discord_id == str(user_id)).first()
        print("user", user)
        if user == None: return None


        entry = FoodLog(
            food=main_food,
            calories=nutrition["total"]["calories"],
            protein=nutrition["total"]["protein"],
            fat=nutrition["total"]["fat"],
            carbs=nutrition["total"]["carbs"],
            timestamp=datetime.utcnow(),
            # timestamp=datetime.now(),
            user_id=user.discord_id   # associate with user
        )

        db.add(entry)
        db.commit()
        db.close()
    print("gonna return", {
        "food": main_food,
        "components": components,
        "portions": portions,
        "nutrition": nutrition
    }
)

    return {
        "food": main_food,
        "components": components,
        "portions": portions,
        "nutrition": nutrition
    }
@app.get("/summary/daily")
def daily_summary(request: Request):

    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    db = SessionLocal()
    today = datetime.utcnow().date()
    start = datetime.combine(today, datetime.min.time())
    end = start + timedelta(days=1)
    print("what is sesion user id", str(request.session.get("user_id")))

    result = db.query(
        func.sum(FoodLog.calories).label("calories"),
        func.sum(FoodLog.protein).label("protein"),
        func.sum(FoodLog.fat).label("fat"),
        func.sum(FoodLog.carbs).label("carbs")
    ).filter(
        # func.date(FoodLog.timestamp) == today,
        # func.date(FoodLog.timestamp) == '2026-02-21'
        # FoodLog.user_id == str(request.session.get("user_id"))
        FoodLog.timestamp >= start,
        FoodLog.timestamp < end,
        FoodLog.user_id == str(user_id)
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
def weekly_summary(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    db = SessionLocal()

    today = datetime.utcnow().date()
    week_start = today - timedelta(days=6)

    start = datetime.combine(week_start, datetime.min.time())
    end = datetime.combine(today + timedelta(days=1), datetime.min.time())

    result = db.query(
        func.sum(FoodLog.calories).label("calories"),
        func.sum(FoodLog.protein).label("protein"),
        func.sum(FoodLog.fat).label("fat"),
        func.sum(FoodLog.carbs).label("carbs")
    ).filter(
        FoodLog.timestamp >= start,
        FoodLog.timestamp < end,
        FoodLog.user_id == str(user_id)
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

@app.get("/summary/daily-log")
def daily_log(request: Request): # Add request here
    user_id = request.session.get("user_id")
    if not user_id:
        return [] # Return empty if not logged in

    db = SessionLocal()
    today = date.today()
    
    # Filter by user_id so users only see their own food
    logs = db.query(FoodLog).filter(
        func.date(FoodLog.timestamp) == today,
        FoodLog.user_id == str(user_id) 
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
            "time": log.timestamp.strftime("%H:%M")
        } for log in logs
    ]

@app.post("/log-manual")
def log_manual(data: dict, request: Request): # Add request here
    user_id = request.session.get("user_id")
    if not user_id:
        return {"error": "Not authenticated"}, 401

    db = SessionLocal()
    log = FoodLog(
        food=data["food"],
        calories=data["calories"],
        protein=data["protein"],
        fat=data["fat"],
        carbs=data["carbs"],
        timestamp=datetime.utcnow(), # Use UTC for consistency
        user_id=str(user_id) # Assign the user here!
    )

    try:
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Error logging: {e}")
        return {"error": "Database error"}
    finally:
        db.close()

    return {"status": "success", "food": data["food"]}

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

@app.get("/summary/daily-log")
def daily_log(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    db = SessionLocal()
    today = date.today()
    
    logs = db.query(FoodLog).filter(
        func.date(FoodLog.timestamp) == today,
        FoodLog.user_id == str(user_id)  # <-- only fetch current user's logs
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
            "time": log.timestamp.strftime("%H:%M")
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




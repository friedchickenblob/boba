from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from app.vision import detect_food
from app.nutrition import get_nutrition
from app.models import Base, FoodLog, User, ManualFoodEntry
from app.database import engine, SessionLocal
from datetime import datetime, date,  timedelta
from sqlalchemy import func
from fastapi import Form
import os
from openai import OpenAI
from app.auth.discord import router as discord_router
from fastapi.responses import RedirectResponse


from starlette.middleware.sessions import SessionMiddleware


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Calorie AI Backend")

app.add_middleware(SessionMiddleware, secret_key=os.environ["SESSION_SECRET"], same_site="lax")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(discord_router)

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

@app.get("/auth/me")
def get_current_user(request: Request):
    user_id = request.session.get("user_id")

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

    try:
        db.add(log)
        db.commit()
    finally:
        db.close()

    return {"status": "success", "message": "Meal logged!"}

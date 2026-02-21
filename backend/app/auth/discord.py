import os
import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from app.db import SessionLocal
from app.models import User
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth/discord")

CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI")


@router.get("/login")
async def discord_login():
    url = (
        "https://discord.com/api/oauth2/authorize"
        f"?client_id={CLIENT_ID}"
        "&response_type=code"
        "&scope=identify email"
        f"&redirect_uri={REDIRECT_URI}"
    )
    return RedirectResponse(url)






@router.get("/callback")
async def discord_callback(code: str):
    async with httpx.AsyncClient() as client:
        # exchange code for token
        token_res = await client.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        token_json = token_res.json()
        access_token = token_json.get("access_token")

        if not access_token:
            raise HTTPException(400, "Failed to get token")

        # fetch user info
        user_res = await client.get(
            "https://discord.com/api/users/@me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        discord_user = user_res.json()

    # --- save to database ---
    db: Session = SessionLocal()
    user = db.query(User).filter(User.discord_id == discord_user["id"]).first()

    if not user:
        user = User(
            discord_id=discord_user["id"],
            username=discord_user["username"],
            email=discord_user.get("email"),
            verified=discord_user.get("verified", False),
            avatar=discord_user.get("avatar"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    db.close()
    return {"message": "User saved", "user": {"id": user.id, "username": user.username}}

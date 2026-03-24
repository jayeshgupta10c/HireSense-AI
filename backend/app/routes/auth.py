from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.db import mongodb
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.models.user import UserCreate, UserInDB
import os

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

@router.post("/signup")
async def signup(user: UserCreate):
    existing = await mongodb.db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed
    del user_dict["password"]
    user_dict["created_at"] = datetime.utcnow()
    
    result = await mongodb.db.users.insert_one(user_dict)
    return {"id": str(result.inserted_id), "email": user.email}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await mongodb.db.users.find_one({"email": form_data.username})
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token_data = {"sub": user["email"], "role": user["role"]}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "email": user["email"],
        "full_name": user.get("full_name"),
        "role": user["role"]
    }

import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.db import mongodb

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid auth token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid auth token")
        
    user = await mongodb.db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user

async def get_admin_user(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admins only.")
    return user

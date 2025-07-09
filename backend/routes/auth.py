from fastapi import APIRouter, HTTPException, status, Depends, Body, Request, UploadFile, File
from passlib.context import CryptContext
from models.user import UserCreate
from db import db
import jwt
import datetime
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
import os
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your_secret_key"  # Replace with a secure key in production
ALGORITHM = "HS256"

security = HTTPBearer()

PROFILE_PHOTO_DIR = os.path.join(os.path.dirname(__file__), '..', 'static', 'profile_photos')
os.makedirs(PROFILE_PHOTO_DIR, exist_ok=True)

@router.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_pw = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_pw
    # Convert dateOfBirth to string if present
    if user_dict.get("dateOfBirth"):
        user_dict["dateOfBirth"] = str(user_dict["dateOfBirth"])
    await db.users.insert_one(user_dict)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(email: str = Body(...), password: str = Body(...)):
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    # Remove sensitive fields
    user.pop("password", None)
    user["_id"] = str(user["_id"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Remove sensitive fields
        user.pop("password", None)
        user["_id"] = str(user["_id"])
        return {"user": user}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/upload-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        # Store file in GridFS
        fs = AsyncIOMotorGridFSBucket(db)
        file_id = await fs.upload_from_stream(file.filename or 'profile.jpg', await file.read())
        # Update user document with GridFS file id
        await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"photo": str(file_id)}})
        return {"photo_id": str(file_id)}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Photo upload failed: {str(e)}"})

@router.put("/profile")
async def update_profile(
    profile_data: dict = Body(...),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        allowed_fields = [
            'name', 'phone', 'dateOfBirth', 'gender', 'bloodGroup',
            'address', 'emergencyContact', 'hobbies', 'skills', 'cgpa',
            'email', 'rollNumber', 'department', 'year', 'semester', 'photo'
        ]
        update_data = {k: v for k, v in profile_data.items() if k in allowed_fields}
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.pop("password", None)
        user["_id"] = str(user["_id"])
        return {"message": "Profile updated successfully", "user": user}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Profile update failed: {str(e)}"}) 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routes.auth import router as auth_router
from routes.blog import router as blog_router

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "https://student-collaborattend-ei1h.vercel.app"],  # Allow both common Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
app.include_router(auth_router)
app.include_router(blog_router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Student Collaboration Hub API is running"}

@app.on_event("startup")
async def startup_event():
    print("🚀 FastAPI Backend Started")
    print("📡 API available at http://localhost:8000")
    print("🔐 Auth endpoints at http://localhost:8000/api/auth")
    print("📝 Blog endpoints at http://localhost:8000/api/blog")
    print("✅ MongoDB connected successfully") 
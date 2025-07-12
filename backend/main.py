from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routes import auth, blog, papers
from fastapi.staticfiles import StaticFiles
from db import db

# Optional: Cloudinary support (remove if not needed)
try:
    import cloudinary
    import cloudinary.api
    import cloudinary.uploader
except ImportError:
    cloudinary = None

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

if cloudinary is not None:
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://studentcolla.netlify.app",
        "https://projectshiv.netlify.app",
        "https://graceful-lolly-c287c1.netlify.app",
        "https://sch-yudhin.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(blog.router)
app.include_router(papers.router)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
async def root():
    return {"message": "FastAPI backend running!"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Student Collaboration Hub API is running"}

@app.get("/papers")
async def get_papers():
    papers = await db.papers.find().to_list(100)
    return papers

@app.get("/ebooks")
async def get_ebooks():
    ebooks = await db.ebooks.find().to_list(100)
    return ebooks

@app.get("/student-info")
async def get_student_info():
    info = await db.student_info.find_one()
    return info or {} 
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = "mongodb+srv://theonlyudhin:yudhin0608@cluster0.mongodb.net/student_collaboration_hub"
client = AsyncIOMotorClient(MONGO_URI)
db = client["student_collaboration_hub"] 
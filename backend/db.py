from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db_name = os.getenv("MONGO_DB")
if not db_name:
    raise ValueError("MONGO_DB environment variable is not set")
db = client[db_name]
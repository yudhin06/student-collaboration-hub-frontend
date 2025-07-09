import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "student_collaboration_hub"
COLLECTION_NAME = "blog_posts"

async def clear_blog_posts():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    result = await db[COLLECTION_NAME].delete_many({})
    print(f"Deleted {result.deleted_count} blog posts.")
    client.close()

if __name__ == "__main__":
    asyncio.run(clear_blog_posts()) 
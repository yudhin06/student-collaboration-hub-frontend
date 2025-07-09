import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["student_hub"]

# Category to image mapping
CATEGORY_IMAGES = {
    "AI-ML": "/static/blog_images/ai-ml.jpg",
    "Programming": "/static/blog_images/programming.jpg",
    "Telecommunications": "/static/blog_images/telecom.jpg",
    "Study Tips": "/static/blog_images/study-tips.jpg",
    "Career": "/static/blog_images/career.jpg",
}

async def update_blog_images():
    posts = await db.blog_posts.find().to_list(1000)
    for post in posts:
        category = post.get("category")
        image_url = CATEGORY_IMAGES.get(category)
        if image_url:
            await db.blog_posts.update_one(
                {"_id": post["_id"]},
                {"$set": {"imageUrl": image_url}}
            )
    print("All blog posts updated with topic-related images.")

if __name__ == "__main__":
    asyncio.run(update_blog_images()) 
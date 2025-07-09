from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List
from datetime import datetime
from bson import ObjectId
from models.blog import BlogPostCreate, BlogPostResponse, BlogPostUpdate, LikeInfo, Comment
from db import db
import os
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
try:
    import cloudinary  # type: ignore
    import cloudinary.uploader  # type: ignore
except ImportError:
    cloudinary = None
from dotenv import load_dotenv

router = APIRouter(prefix="/api/blog", tags=["blog"])

# Mount static directory for serving images
STATIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'static')
BLOG_IMG_DIR = os.path.join(STATIC_DIR, 'blog_images')
os.makedirs(BLOG_IMG_DIR, exist_ok=True)

# In main.py or app.py, add:
# app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')

# Sample blog posts data for initialization
SAMPLE_IMAGE_URLS = [
    # AI & ML
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    # Programming
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    # Programming (alternate)
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    # Telecommunications
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    # Study Tips
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
    # Career
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    # Other
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
]
SAMPLE_POSTS = [
    # Note post
    {
        "type": "note",
        "title": "Discrete Mathematics Notes - Graph Theory",
        "excerpt": "Download comprehensive notes on Graph Theory for quick revision.",
        "author": "Ananya Sharma",
        "category": "Notes",
        "read_time": "2 min read",
        "tags": ["Mathematics", "Graph Theory", "CS201"],
        "document_url": "https://res.cloudinary.com/demo/raw/upload/v1710000000/graph_theory_notes.pdf",
        "content": "These notes cover all important concepts in Graph Theory for CS201.",
        "likes": [],
        "date": datetime.utcnow()
    },
    # Job post
    {
        "type": "job",
        "title": "Software Engineer Internship at Google",
        "excerpt": "Exciting internship opportunity for 3rd year students. Apply now!",
        "author": "Placement Cell",
        "category": "Jobs",
        "read_time": "1 min read",
        "job_link": "https://careers.google.com/jobs/results/123456-software-engineer-intern/",
        "referral_info": "Contact alumni Priya S. for referral.",
        "content": "Google is hiring interns for Summer 2024. See link for details.",
        "likes": [],
        "date": datetime.utcnow()
    },
    # Thread post
    {
        "type": "thread",
        "title": "How to prepare for GATE CS?",
        "excerpt": "Share your tips and resources for GATE Computer Science preparation.",
        "author": "Rahul Verma",
        "category": "Threads",
        "read_time": "3 min read",
        "content": "Let's discuss the best strategies and materials for GATE CS.",
        "likes": [],
        "comments": [
            {
                "user_id": "user_sneha",
                "user_name": "Sneha",
                "text": "Start with previous year papers!",
                "created_at": datetime.utcnow(),
                "replies": [
                    {
                        "user_id": "user_rahul",
                        "user_name": "Rahul Verma",
                        "text": "Thanks! Any book recommendations?",
                        "created_at": datetime.utcnow()
                    }
                ]
            },
            {
                "user_id": "user_amit",
                "user_name": "Amit",
                "text": "Use NPTEL lectures for tough topics.",
                "created_at": datetime.utcnow(),
                "replies": []
            }
        ],
        "date": datetime.utcnow()
    },
    # Add more posts of each type as needed...
]

load_dotenv()

if cloudinary is not None:
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )

@router.get("/posts", response_model=List[BlogPostResponse])
async def get_all_posts():
    """Get all blog posts, alternating 1 job, 1 non-job post in order."""
    try:
        all_posts = await db.blog_posts.find().sort("date", -1).to_list(length=200)
        job_posts = [post for post in all_posts if post.get("type") == "job"]
        other_posts = [post for post in all_posts if post.get("type") != "job"]
        alternated = []
        i = j = 0
        # Alternate 1 job, 1 non-job
        while i < len(job_posts) or j < len(other_posts):
            if i < len(job_posts):
                alternated.append(job_posts[i])
                i += 1
            if j < len(other_posts):
                alternated.append(other_posts[j])
                j += 1
        return [
            {
                "id": str(post["_id"]),
                "type": post.get("type"),
                "title": post["title"],
                "excerpt": post["excerpt"],
                "author": post["author"],
                "date": post["date"],
                "category": post["category"],
                "read_time": post["read_time"],
                "image": post.get("image"),
                "tags": post.get("tags", []),
                "likes": post.get("likes", []),
                "like_count": len(post.get("likes", [])),
                "content": post.get("content"),
                "comments": post.get("comments", []),
                "document_url": post.get("document_url"),
                "job_link": post.get("job_link"),
                "referral_info": post.get("referral_info"),
            }
            for post in alternated
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

@router.get("/posts/{post_id}", response_model=BlogPostResponse)
async def get_post(post_id: str):
    """Get a specific blog post by ID"""
    try:
        post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return {
            "id": str(post["_id"]),
            "type": post.get("type"),
            "title": post["title"],
            "excerpt": post["excerpt"],
            "author": post["author"],
            "date": post["date"],
            "category": post["category"],
            "read_time": post["read_time"],
            "image": post.get("image"),
            "tags": post.get("tags", []),
            "likes": post.get("likes", []),
            "like_count": len(post.get("likes", [])),
            "content": post.get("content"),
            "comments": post.get("comments", []),
            "document_url": post.get("document_url"),
            "job_link": post.get("job_link"),
            "referral_info": post.get("referral_info"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching post: {str(e)}")

@router.post("/posts", response_model=BlogPostResponse)
async def create_post(post: BlogPostCreate):
    """Create a new blog post"""
    try:
        post_data = post.dict()
        post_data["date"] = datetime.utcnow()
        post_data["likes"] = []
        if "comments" not in post_data:
            post_data["comments"] = []
        result = await db.blog_posts.insert_one(post_data)
        created_post = await db.blog_posts.find_one({"_id": result.inserted_id})
        if not created_post:
            raise HTTPException(status_code=500, detail="Error retrieving created post")
        return {
            "id": str(created_post["_id"]),
            "title": created_post["title"],
            "excerpt": created_post["excerpt"],
            "author": created_post["author"],
            "date": created_post["date"],
            "category": created_post["category"],
            "read_time": created_post["read_time"],
            "image": created_post["image"],
            "tags": created_post["tags"],
            "likes": created_post.get("likes", []),
            "like_count": len(created_post.get("likes", [])),
            "content": created_post.get("content"),
            "comments": created_post.get("comments", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")

@router.post("/posts/{post_id}/like")
async def like_post(post_id: str, user_info: dict):
    """Like a blog post"""
    try:
        # Check if post exists
        post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Check if user already liked
        existing_like = next(
            (like for like in post.get("likes", []) if like["user_id"] == user_info["user_id"]), 
            None
        )
        
        if existing_like:
            # Unlike the post
            await db.blog_posts.update_one(
                {"_id": ObjectId(post_id)},
                {"$pull": {"likes": {"user_id": user_info["user_id"]}}}
            )
            return {"message": "Post unliked successfully", "liked": False}
        else:
            # Like the post
            like_data = {
                "user_id": user_info["user_id"],
                "user_name": user_info["user_name"],
                "liked_at": datetime.utcnow()
            }
            await db.blog_posts.update_one(
                {"_id": ObjectId(post_id)},
                {"$push": {"likes": like_data}}
            )
            return {"message": "Post liked successfully", "liked": True}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error liking post: {str(e)}")

@router.get("/posts/category/{category}")
async def get_posts_by_category(category: str):
    """Get posts by category"""
    try:
        posts = await db.blog_posts.find({"category": category}).to_list(length=100)
        return [
            {
                "id": str(post["_id"]),
                "type": post.get("type"),
                "title": post["title"],
                "excerpt": post["excerpt"],
                "author": post["author"],
                "date": post["date"],
                "category": post["category"],
                "read_time": post["read_time"],
                "image": post.get("image"),
                "tags": post.get("tags", []),
                "likes": post.get("likes", []),
                "like_count": len(post.get("likes", [])),
                "content": post.get("content"),
                "comments": post.get("comments", []),
                "document_url": post.get("document_url"),
                "job_link": post.get("job_link"),
                "referral_info": post.get("referral_info"),
            }
            for post in posts
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

@router.post("/initialize")
async def initialize_blog_posts():
    """Initialize blog posts with sample data"""
    try:
        # Check if posts already exist
        existing_count = await db.blog_posts.count_documents({})
        if existing_count > 0:
            return {"message": "Blog posts already initialized", "count": existing_count}
        
        # Insert sample posts
        for post in SAMPLE_POSTS:
            await db.blog_posts.insert_one(post)
        
        return {"message": "Blog posts initialized successfully", "count": len(SAMPLE_POSTS)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing posts: {str(e)}")

@router.post("/posts/{post_id}/comments")
async def add_comment(post_id: str, comment: Comment):
    """Add a comment to a blog post"""
    try:
        post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        comment_dict = comment.dict()
        await db.blog_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$push": {"comments": comment_dict}}
        )
        return {"message": "Comment added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding comment: {str(e)}")

@router.get("/posts/{post_id}/comments")
async def get_comments(post_id: str):
    """Get all comments for a blog post"""
    try:
        post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post.get("comments", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comments: {str(e)}")

@router.post('/upload-image')
async def upload_post_image(file: UploadFile = File(...)):
    """Upload an image or document for a post to Cloudinary and return its URL"""
    try:
        contents = await file.read()
        if cloudinary is not None:
            upload_result = cloudinary.uploader.upload(
                contents,
                resource_type="auto",
                folder="student_hub/posts/"
            )
            url = upload_result.get('secure_url')
            if not url:
                raise Exception('Cloudinary upload failed')
            return {"url": url}
        else:
            raise Exception('Cloudinary is not configured')
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Image upload failed: {str(e)}"})

@router.post('/seed-more-posts')
async def seed_more_posts():
    """Seed the database with more posts, at least half as job posts."""
    authors = [
        {'name': 'Rinaaz', 'id': 'rinaaz1'},
        {'name': 'Mohit', 'id': 'mohit2'},
        {'name': 'Akhilesh', 'id': 'akhilesh3'},
        {'name': 'Tanukj', 'id': 'tanukj4'},
        {'name': 'Bahrath M', 'id': 'bahrathm5'},
        {'name': 'Deekshith', 'id': 'deekshith6'},
    ]
    categories = ['AI-ML', 'Programming', 'Programming', 'Telecommunications', 'Study Tips', 'Career', 'Other']
    job_posts = [
        {
            'type': 'job',
            'title': 'Backend Developer Intern at Microsoft',
            'excerpt': 'Join Microsoft as a backend intern. Apply now!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.microsoft.com/us/en/job/12345/Backend-Developer-Intern',
            'referral_info': 'Contact alumni Ravi K. for referral.',
            'content': 'Microsoft is hiring backend interns for Summer 2024. See link for details.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Data Analyst - Amazon',
            'excerpt': 'Amazon is looking for Data Analysts. Freshers welcome!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://www.amazon.jobs/en/jobs/67890/Data-Analyst',
            'referral_info': 'Reach out to alumni Sneha S. for referral.',
            'content': 'Apply for Data Analyst roles at Amazon. Great for freshers.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Frontend Engineer - Swiggy',
            'excerpt': 'Swiggy is hiring frontend engineers. Apply today!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.swiggy.com/job/54321/Frontend-Engineer',
            'referral_info': 'Contact Mohit for referral.',
            'content': 'Swiggy is looking for frontend engineers for their web team.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Machine Learning Intern - TCS',
            'excerpt': 'TCS is offering ML internships for students.',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://www.tcs.com/careers/ml-intern',
            'referral_info': 'Contact Deekshith for referral.',
            'content': 'Work on real ML projects at TCS. Apply now!',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Software Engineer - Infosys',
            'excerpt': 'Infosys is hiring software engineers. Don’t miss out!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.infosys.com/job/98765/Software-Engineer',
            'referral_info': 'Contact Akhilesh for referral.',
            'content': 'Infosys is looking for software engineers for multiple teams.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'UI/UX Designer - Zoho',
            'excerpt': 'Zoho is hiring UI/UX Designers. Creative minds wanted!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.zohocorp.com/jobs/24680/UI-UX-Designer',
            'referral_info': 'Contact Tanukj for referral.',
            'content': 'Zoho is looking for creative UI/UX designers.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Cloud Engineer - IBM',
            'excerpt': 'IBM is hiring Cloud Engineers. Apply for exciting cloud projects!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.ibm.com/job/13579/Cloud-Engineer',
            'referral_info': 'Contact Rinaaz for referral.',
            'content': 'IBM is looking for Cloud Engineers to work on next-gen cloud solutions.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'DevOps Engineer - Flipkart',
            'excerpt': 'Flipkart is hiring DevOps Engineers. Join the e-commerce revolution!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.flipkart.com/job/24680/DevOps-Engineer',
            'referral_info': 'Contact Mohit for referral.',
            'content': 'Flipkart is looking for DevOps Engineers for their cloud team.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Cybersecurity Analyst - Deloitte',
            'excerpt': 'Deloitte is hiring Cybersecurity Analysts. Secure the digital world!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.deloitte.com/job/35791/Cybersecurity-Analyst',
            'referral_info': 'Contact Akhilesh for referral.',
            'content': 'Deloitte is looking for Cybersecurity Analysts for their security team.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Product Manager - Byju’s',
            'excerpt': 'Byju’s is hiring Product Managers. Lead the next wave in EdTech!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.byjus.com/job/46802/Product-Manager',
            'referral_info': 'Contact Tanukj for referral.',
            'content': 'Byju’s is looking for Product Managers to drive innovation.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'Android Developer - Ola',
            'excerpt': 'Ola is hiring Android Developers. Build the future of mobility!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.ola.com/job/57913/Android-Developer',
            'referral_info': 'Contact Deekshith for referral.',
            'content': 'Ola is looking for Android Developers for their mobile team.',
            'likes': [],
            'date': datetime.utcnow()
        },
        {
            'type': 'job',
            'title': 'QA Engineer - Paytm',
            'excerpt': 'Paytm is hiring QA Engineers. Ensure quality at scale!',
            'author': 'Placement Cell',
            'category': 'Jobs',
            'read_time': '1 min read',
            'job_link': 'https://careers.paytm.com/job/68024/QA-Engineer',
            'referral_info': 'Contact Bahrath M for referral.',
            'content': 'Paytm is looking for QA Engineers to test and improve their products.',
            'likes': [],
            'date': datetime.utcnow()
        }
    ]
    # Add some non-job posts for variety
    note_and_thread_posts = []
    for i in range(6):
        author = authors[i % len(authors)]
        cat = categories[i % len(categories)]
        post_type = 'note' if i % 2 == 0 else 'thread'
        post = {
            'type': post_type,
            'title': f'Sample {post_type.title()} Post {i+1}',
            'excerpt': f'This is a sample excerpt for {post_type} post {i+1}.',
            'author': author['name'],
            'authorId': author['id'],
            'category': cat,
            'read_time': f'{3 + (i % 7)} min read',
            'tags': [cat, 'Sample'],
            'content': f'This is the full content of sample {post_type} post {i+1}.',
            'likes': [],
            'date': datetime.utcnow(),
            'comments': []
        }
        note_and_thread_posts.append(post)
    # Interleave job_posts and note_and_thread_posts for 1:1 ratio
    posts = []
    max_len = max(len(job_posts), len(note_and_thread_posts))
    for i in range(max_len):
        if i < len(job_posts):
            posts.append(job_posts[i])
        if i < len(note_and_thread_posts):
            posts.append(note_and_thread_posts[i])
    await db.blog_posts.insert_many(posts)
    return {'message': 'Seeded more posts (alternating jobs and others)', 'count': len(posts)} 
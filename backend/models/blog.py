from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class LikeInfo(BaseModel):
    user_id: str
    user_name: str
    liked_at: datetime = Field(default_factory=datetime.utcnow)

class Comment(BaseModel):
    user_id: str
    user_name: str
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPostCreate(BaseModel):
    type: Optional[str] = None
    title: str
    excerpt: str
    author: str
    category: str
    read_time: str
    image: Optional[str] = None
    tags: Optional[List[str]] = []
    content: Optional[str] = None
    comments: Optional[List[Comment]] = []
    document_url: Optional[str] = None
    job_link: Optional[str] = None
    referral_info: Optional[str] = None

class BlogPostResponse(BaseModel):
    id: str
    type: Optional[str] = None
    title: str
    excerpt: str
    author: str
    date: datetime
    category: str
    read_time: str
    image: Optional[str] = None
    tags: Optional[List[str]] = []
    likes: List[LikeInfo]
    like_count: int
    content: Optional[str] = None
    comments: Optional[List[Comment]] = []
    document_url: Optional[str] = None
    job_link: Optional[str] = None
    referral_info: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None 
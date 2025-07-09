from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    dateOfBirth: Optional[date] = None
    rollNumber: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    semester: Optional[str] = None
    cgpa: Optional[float] = 0
    gender: Optional[str] = None
    bloodGroup: Optional[str] = None
    address: Optional[str] = None
    emergencyContact: Optional[str] = None
    hobbies: Optional[str] = None
    skills: Optional[str] = None
    profilePicture: Optional[str] = None 
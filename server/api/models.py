from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    client_id: str
    name: str
    # Additional user fields

class Lecture(BaseModel):
    lecture_id: str
    course_id: str
    title: str
    notes: Optional[str] = None
    pdfs: Optional[List[str]] = None  # List of file paths or URLs
    recordings: Optional[List[str]] = None
    date_created: datetime

class Course(BaseModel):
    course_id: str
    client_id: str
    title: str
    lectures: Optional[List[Lecture]] = None
    date_created: datetime

class ChatMessage(BaseModel):
    sender: str  # 'user' or 'system'
    message: str
    timestamp: datetime

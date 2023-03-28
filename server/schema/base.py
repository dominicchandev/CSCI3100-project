from typing import Literal
from datetime import datetime

from pydantic import BaseModel

class CourseBase(BaseModel):
    id: str
    name: str
    start_time: datetime
    end_time: datetime
    place: str
    department: str
    instructor: str
    capacity: int
    outline: str

class UserBase(BaseModel):
    name: str
    email: str
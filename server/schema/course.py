from typing import List
from datetime import datetime

from pydantic import BaseModel

from server.schema.base import UserBase, CourseBase

class CourseCreate(CourseBase):
    pass


class CourseSchema(CourseBase):
    users: List[UserBase] = []

    class Config:
        orm_mode = True
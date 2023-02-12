from typing import Literal, List

from server.schema.base import CourseBase, UserBase


class UserCreate(UserBase):
    password: str

class UserSchema(UserBase):
    courses: List[CourseBase] = []
    class Config:
        orm_mode = True


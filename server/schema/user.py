from typing import Literal, List

from server.schema.base import CourseBase, UserBase

class UserUpdate(UserBase):
    id: int

class UserChangePassword(UserBase):
    password: str

class UserCreate(UserBase):
    id: int
    role: Literal["student", "admin"]
    password: str

class UserSchema(UserBase):
    id: int
    
    courses: List[CourseBase] = []
    class Config:
        orm_mode = True


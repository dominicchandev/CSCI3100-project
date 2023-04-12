from typing import Literal

from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str

class UserUpdate(UserBase):
    id: int

class UserEmail(BaseModel):
    email: str

class UserVerifyEmail(UserEmail):
    otp: str
class UserChangePassword(UserVerifyEmail):
    new_password: str

class UserCreate(UserBase):
    password: str

class UserSchema(UserBase):
    id: int
    role: Literal["student", "admin"]
    courses: list
    
    class Config:
        orm_mode = True


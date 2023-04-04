from datetime import date

from pydantic import BaseModel

class CourseCreate(BaseModel):
    id: str
    name: str
    start_time: date
    end_time: date
    place: str
    department: str
    instructor: str
    capacity: int

class CourseOutlineUpload(BaseModel):
    id: str
    outline: str

class CourseSchema(CourseCreate):
    users: list
    outline: str

    class Config:
        orm_mode = True
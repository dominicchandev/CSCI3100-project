from typing import Dict, List
from datetime import date, datetime

from pydantic import BaseModel, validator
from server.schema.user import UserBase
class CourseCreate(BaseModel):
    id: str
    name: str
    start_date: date
    end_date: date
    schedule: Dict[str, List[List[str]]]
    place: str
    department: str
    instructor: str
    capacity: int
    available_seats: int

    @validator('schedule')
    def valid_schedule_format(cls, v):
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        for key, value_list in v.items():
            if key not in weekdays:
                raise ValueError(f"{key} is not a valid weekday name. Valid weekday names are {weekdays}")
            for interval in value_list:
                if len(interval) != 2:
                    raise ValueError("Duration of courses should contain a start and end time only")
                
                start_time = datetime.strptime(interval[0], "%H:%M")
                end_time = datetime.strptime(interval[1], "%H:%M")
                if start_time >= end_time:
                    raise ValueError("End time must be later than the start time")
        return v
    
    @validator('available_seats')
    def leq_to_capacity(cls, v, values):
        if v > values['capacity']:
            raise ValueError("available seats must be less than or equal to capacity")
        return v
    
class CourseOutlineUpload(BaseModel):
    id: str
    outline: str

class CourseSchema(CourseCreate):
    users: List[UserBase]
    users: list
    outline: str

    class Config:
        orm_mode = True
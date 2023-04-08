from sqlalchemy.orm import Session, noload

from server.models import CoursesModel
from server.schema.course import CourseCreate
from server.utils.setting import Setting
from server.crud.base import CRUDBase

setting = Setting()

class CourseCRUD(CRUDBase):
    def __init__(self):
        super().__init__(model=CoursesModel)
    
    def read(self, db: Session, course_id: str):
        db_course = db.query(CoursesModel).options(noload(CoursesModel.users)).get(course_id)
        if not db_course:
            return None
        return db_course

    def create(self, db: Session, course: CourseCreate):
        db_course = self.model(
            id = course.id,
            name = course.name,
            start_date = course.start_date,
            end_date = course.end_date,
            schedule = course.schedule,
            place = course.place,
            department = course.department,
            instructor = course.instructor,
            capacity = course.capacity,
            available_seats = course.available_seats,
            outline = "Not available yet"
        )
        db.add(db_course)
        db.commit()
        db.refresh(db_course)
        return db_course
    
    def update(self, db: Session, id: str, outline_link: str):
        db_course = db.query(self.model).filter(self.model.id == id).first()
        if not db_course:
            return None
        db_course.outline = outline_link
        db.commit()
        db.refresh(db_course)
        return db_course    
from sqlalchemy.orm import Session

from server.models import CourseModel
from server.schema.course import CourseCreate, CourseOutlineUpload
from server.utils.setting import Setting
from server.crud.base import CRUDBase

setting = Setting()

class CourseCRUD(CRUDBase):
    def __init__(self):
        super().__init__(model=CourseModel)

    def create(self, db: Session, course: CourseCreate):
        db_course = self.model(
            id = course.id,
            name = course.name,
            start_time = course.start_time,
            end_time = course.end_time,
            place = course.place,
            department = course.department,
            instructor = course.instructor,
            capacity = course.capacity,
            outline = "No valid pdf"
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
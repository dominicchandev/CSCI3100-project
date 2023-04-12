from sqlalchemy.orm import Session, noload

from server.models import CoursesModel
from server.schema.course import CourseCreate
from server.utils.setting import Setting
from server.crud.base import CRUDBase

setting = Setting()

class CourseCRUD(CRUDBase):
    def __init__(self):
        super().__init__(model=CoursesModel)
    
    def read(self, db: Session, id: str):
        db_course = db.query(self.model).options(noload(self.model.users)).filter(self.model.id == id).first()
        if not db_course:
            return None
        return db_course
    
    def read_by_name(self, db: Session, course_name: str):
        db_course = db.query(self.model).options(noload(self.model.users)).filter(self.model.name == course_name).first()
        if not db_course:
            return None
        return db_course
    
    def read_by_department(self, db: Session, department: str):
        db_courses = db.query(self.model).options(noload(self.model.users)).filter(self.model.department == department).all()
        return db_courses
    
    def read_by_class_time(self, db: Session, day: str, start_time: str, end_time: str):
        course_ids = set()
        id_schedule_entities: list = db.query(self.model).with_entities(self.model.id, self.model.schedule).all()
        for id_schedule_entity in id_schedule_entities:
            course_id = id_schedule_entity[0]
            schedule = id_schedule_entity[1]
            TIME_MATCH = False
            for course_day in schedule:
                if day == course_day:
                    for place in schedule[course_day]:
                        course_start_time = schedule[course_day][place][0]
                        course_end_time = schedule[course_day][place][1]
                        if course_start_time == start_time and course_end_time == end_time:
                            course_ids.add(course_id)
                            TIME_MATCH = True
                            break
                    if TIME_MATCH:
                        break
        
        db_courses = []
        for course_id in course_ids:
            db_courses.append(self.read(db=db, id=course_id))
        return db_courses
    
    def read_all(self, db: Session):
        all_courses = db.query(self.model).options(noload(self.model.users)).all()
        return all_courses

    def create(self, db: Session, course: CourseCreate):
        db_course = self.model(
            id = course.id,
            name = course.name,
            start_date = course.start_date,
            end_date = course.end_date,
            schedule = course.schedule,
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
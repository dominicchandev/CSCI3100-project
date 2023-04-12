from typing import List
from datetime import datetime

from sqlalchemy.orm import Session

from server.models import UsersCourses, CoursesModel
from server.utils.logger import get_logger

class UserCourseCRUD:
    def __init__(self):
        self.model = UsersCourses
        self.logger = get_logger("UserCourse")

    def read_registered_courses(self, db: Session, user_id: int):
        course_ids = db.query(self.model).with_entities(self.model.course_id).filter(self.model.user_id == user_id).all()
        course_ids: List[str] = [course_id[0] for course_id in course_ids]
        return course_ids
    
    def read_registered_users(self, db: Session, course_id: str):
        user_ids = db.query(self.model).with_entities(self.model.user_id).filter(self.model.course_id == course_id).all()
        user_ids: List[int] = [user_id[0] for user_id in user_ids]
        return user_ids
    
    def register_one(self, db: Session, user_id: int, course_id: str):
        basic_check = check_basic_availability(db=db, course_id=course_id)
        if next(iter(basic_check)) != "passed":
            return basic_check
        
        registered_courses = self.read_registered_courses(db=db, user_id=user_id)
        for registered_course in registered_courses:
            if course_id == registered_course:
                return {"failed": {"already registered": {course_id}}}
        if registered_courses:
            clash_course_id, _ = check_time_clash(db=db, course_ids=set(registered_courses + [course_id]))
            if clash_course_id:
                return {"failed": {"time clash": {course_id}}}
        user_course = self.model(user_id=user_id, course_id=course_id)
        db.add(user_course)
        db.commit()
        db.refresh(user_course)

        self.update_available_seats(db=db, course_id=course_id)
        return {"successful": {course_id}}
    
    def register_many(self, db: Session, user_id: int, course_ids: List[str]):
        if len(course_ids) == 1:
            return self.register_one(db=db, user_id=user_id, course_id=course_ids[0])
        
        response = {"successful": set(), "failed": {"time clash": set(), "already registered": set(), "No such course": set(), "No available seat": set()}}
        
        course_ids_copy = course_ids.copy()
        for course_id in course_ids_copy: 
            basic_check = check_basic_availability(db=db, course_id=course_id)
            if next(iter(basic_check)) != "passed":
                failed_reason = next(iter(basic_check["failed"]))
                response["failed"][failed_reason].add(course_id)
                course_ids.remove(course_id)

        clash_course_ids, no_clash_course_ids = check_time_clash(db=db, course_ids=set(course_ids))

        for clash_course_id in clash_course_ids:
            response["failed"]["time clash"].add(clash_course_id)
        for no_clash_course_id in no_clash_course_ids:
            register_result = self.register_one(db=db, user_id=user_id, course_id=no_clash_course_id)
            if "successful" in register_result.keys():
                response["successful"].add(no_clash_course_id)
            else:
                failed_reason = next(iter(response["failed"]))
                response["failed"][failed_reason].add(no_clash_course_id)
        return response
    
    def update_available_seats(self, db: Session, course_id: str):
        user_ids = self.read_registered_users(db=db, course_id=course_id)
        db_course = db.query(CoursesModel).filter(CoursesModel.id == course_id).first()
        db_course.available_seats = db_course.capacity - len(user_ids)
        db.commit()
        db.refresh(db_course)
        return

    def drop_course(self, db: Session, user_id: int, course_id: str):
        db_user_course = db.query(self.model).filter(self.model.user_id == user_id, self.model.course_id == course_id).first()
        db.delete(db_user_course)
        self.update_available_seats(db=db, course_id=course_id)
        return db_user_course
    
def check_basic_availability(db: Session, course_id: str):
    db_course = db.query(CoursesModel).get(course_id)
    if not db_course:
        return {"failed": {"No such course": {course_id}}}
    
    if not has_available_seats(db=db, course_id=course_id):
        return {"failed": {"No available seat": {course_id}}}
    return {"passed": {course_id}}

def has_available_seats(db: Session, course_id: str) -> bool:
    db_course = db.query(CoursesModel).filter(CoursesModel.id == course_id).first()
    if db_course.available_seats > 0:
        return True
    return False

def check_time_clash(db: Session, course_ids: set):
    clash_course_ids = set()
    courses_schedule = {}
    for course_id in course_ids:
        courses_schedule[course_id] = db.query(CoursesModel).with_entities(CoursesModel.schedule).filter(CoursesModel.id == course_id).first()[0]

    other_courses_schedule = courses_schedule.copy()
    for course_id, schedule in courses_schedule.items():
        del other_courses_schedule[course_id]
        for other_course_id, other_schedule in other_courses_schedule.items():
            skip_to_other_course = False
            for weekday in schedule:
                class_time_dict = schedule[weekday]
                if weekday in other_schedule:
                    other_class_time_dict = other_schedule[weekday]
                    for class_time in class_time_dict.values():
                        start_time = datetime.strptime(class_time[0], "%H:%M")
                        end_time = datetime.strptime(class_time[1], "%H:%M")
                        for other_class_time in other_class_time_dict.values():
                            other_start_time = datetime.strptime(other_class_time[0], "%H:%M")
                            other_end_time = datetime.strptime(other_class_time[1], "%H:%M")
                            if not(end_time <= other_start_time or other_end_time <= start_time):
                                clash_course_ids.add(course_id)
                                clash_course_ids.add(other_course_id)
                                skip_to_other_course = True
                                break
                        if skip_to_other_course:
                            break
                if skip_to_other_course:
                    break

    no_clash_course_ids = course_ids - clash_course_ids
    return clash_course_ids, no_clash_course_ids

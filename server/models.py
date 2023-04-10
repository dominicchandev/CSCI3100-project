from sqlalchemy import Column, ForeignKey, Date, String, Integer, LargeBinary, JSON
from sqlalchemy.schema import Sequence
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship,deferred

Base = declarative_base()

# establishing many-to-many relationship between user and course
class UsersCourses(Base):
    __tablename__ = 'users_courses'
    user_id = Column(ForeignKey('system_users.id'), primary_key=True)
    course_id = Column(ForeignKey('courses.id'), primary_key=True)

class UsersModel(Base):
    __tablename__ = 'system_users'
    id = Column(Integer, Sequence('user_id_seq', start=1155000000, increment=1), primary_key=True)
    name = Column(String)
    role = deferred(Column(String))
    email = Column(String, unique=True)
    hash = deferred(Column(LargeBinary))

    courses = relationship("CoursesModel", secondary="users_courses", back_populates="users")

class CoursesModel(Base):
    __tablename__ = 'courses'
    id = Column(String, primary_key=True)
    name = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    schedule = Column(JSON)
    department = Column(String)
    instructor = Column(String)
    capacity = Column(Integer)
    available_seats = Column(Integer)
    outline = Column(String)

    users = relationship("UsersModel", secondary="users_courses", back_populates="courses")
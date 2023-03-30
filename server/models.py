from typing import Set

from sqlalchemy import Table, Column, ForeignKey, DateTime, String, Integer, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase

Base = declarative_base()

# establishing many-to-many relationship between user and course
user_course_association_table = Table(
    "user_course_association_table",
    Base.metadata,
    Column("user_id", ForeignKey("system_user.id"), primary_key=True),
    Column("course_id", ForeignKey("course.id"), primary_key=True),
)

class UserModel(Base):
    __tablename__ = 'system_user'
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    email = Column(String, unique=True)
    hash = Column(LargeBinary)

    courses: Mapped[Set["CourseModel"]] = relationship(secondary=user_course_association_table, back_populates="users")


class CourseModel(Base):
    __tablename__ = 'course'
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    name = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    place = Column(String)
    department = Column(String)
    instructor = Column(String)
    capacity = Column(Integer)
    outline = Column(String)

    users: Mapped[Set["UserModel"]] = relationship(secondary=user_course_association_table, back_populates="courses")

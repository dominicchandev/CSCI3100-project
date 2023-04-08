import os

from fastapi import APIRouter, Depends, UploadFile, HTTPException
from sqlalchemy.orm import Session

from server.database import get_db
from server.schema.course import CourseCreate, CourseSchema
from server.schema.token import TokenData
from server.security.auth import get_token_data
from server.crud.course import CourseCRUD
from server.utils.drive import upload_pdf_and_get_link

router = APIRouter()
courseCRUD = CourseCRUD()

@router.post("/", response_model=CourseSchema)
async def create_course(course: CourseCreate, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin":
        raise HTTPException(status_code=401, detail="Unauthorized user")
    db_course = courseCRUD.create(db=db, course=course)
    return db_course

@router.post("/outline", response_model=CourseSchema)
async def upload_course_outline(course_outline: UploadFile, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin":
        raise HTTPException(status_code=401, detail="Unauthorized user")
    
    course_id = course_outline.filename.split(".")[0]
    db_course = courseCRUD.read(db=db, id=course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")
    
    try:
        with open('temp/' + course_outline.filename, "wb+") as file:
            file.write(course_outline.file.read())
            link = upload_pdf_and_get_link('temp/' + course_outline.filename)
            db_course = courseCRUD.update(db=db, id=course_id, outline_link=link)
    except TypeError:
        raise HTTPException(status_code=422, detail="File type is not pdf")
    finally:
        os.remove('temp/' + course_outline.filename)
    return db_course

@router.get("/{course_id}", response_model=CourseSchema)
async def read_course(course_id: str, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    db_course = courseCRUD.read(db=db, course_id=course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")
    return db_course

@router.delete("/{course_id}", response_model=CourseSchema)
async def delete_course(course_id: str, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin":
            raise HTTPException(status_code=401, detail="Unauthorized user")
    return courseCRUD.delete(db=db, id=course_id)

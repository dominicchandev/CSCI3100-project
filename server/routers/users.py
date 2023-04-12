from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from server.database import get_db
from server.crud.user import UserCRUD
from server.schema.token import TokenData
from server.crud.user_course import UserCourseCRUD
from server.schema.user import UserSchema, UserCreate, UserEmail, UserVerifyEmail, UserChangePassword
from server.security.auth import get_token_data

userCRUD = UserCRUD()
usercourseCRUD = UserCourseCRUD()

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def user_create(user: UserCreate, db: Session = Depends(get_db)):
    if userCRUD.read_by_email(db=db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    create_user = userCRUD.create(db=db, user=user)
    return create_user

@router.post("/email")
async def send_otp(user: UserEmail, db: Session = Depends(get_db)):
    sent = userCRUD.sendVerificationEmail(db=db, email=user.email)
    if not sent:
        raise HTTPException(status_code=503, detail=f"Failed to send verification code to {user.email}")
    return {"email sent" : sent}

@router.post("/email/verification")
def verify_otp(user: UserVerifyEmail):
    verified = userCRUD.verifyCode(email=user.email, code=user.otp)
    if not verified:
        raise HTTPException(status_code=403, detail="Email verification failed")
    return {"verified" : verified}

@router.put("/password")
async def reset_password(user: UserChangePassword, db: Session = Depends(get_db)):
    verified = userCRUD.verifyCode(email=user.email, code=user.otp)
    if not verified:
        raise HTTPException(status_code=403, detail="Email verification failed")
    
    userCRUD.update_password(db=db, email=user.email, password=user.new_password)
    return {"message" : "Successfully reset password"}
        
@router.get("/all")
def get_all_users(db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin":
        raise HTTPException(status_code=401, detail="Unauthorized user")
    all_users = userCRUD.read_all(db=db)
    return all_users

@router.get("/me", response_model=UserSchema)
def read_myself(db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    current_user = userCRUD.read(db=db, id=token_data.id)
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin" and token_data.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized user")
    
    db_user = userCRUD.read(db=db, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return db_user


@router.delete("/{user_id}", response_model=UserSchema)
async def delete_user(user_id: int, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin":
        raise HTTPException(status_code=401, detail="Unaithorized user")
    user = userCRUD.read(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    registered_course_ids = usercourseCRUD.read_registered_courses(db=db, user_id=user_id)
    for course_id in registered_course_ids:
        usercourseCRUD.drop_course(db=db, user_id=user_id, course_id=course_id)
        usercourseCRUD.update_available_seats(db=db, course_id=course_id)
    user.role
    userCRUD.delete(db=db, id=user_id)
    return user

@router.put("/registerCourse")
async def register_courses(course_ids: list, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    response = usercourseCRUD.register_many(db=db, user_id=token_data.id, course_ids=course_ids)
    return response

@router.put("/dropCourse")
async def drop_one_course(course_id: str, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    return usercourseCRUD.drop_course(db=db, user_id=token_data.id, course_id=course_id)

@router.get("/{user_id}/courses")
async def read_registered_courses(user_id: int, db: Session = Depends(get_db), token_data: TokenData = Depends(get_token_data)):
    if token_data.role != "admin" and user_id != token_data.id:
        raise HTTPException(status_code=401, detail="Unauthorized user")
    return usercourseCRUD.read_registered_courses(db=db, user_id=user_id)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database import get_db
from server.schema.token import TokenData
from server.schema.user import UserSchema, UserCreate
from server.crud.user import UserCRUD

userCRUD = UserCRUD()

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def user_create(user: UserCreate, db: Session = Depends(get_db)):
    if userCRUD.read_by_email(db=db, email=user.email) or userCRUD.read(db=db, id=user.id):
        raise HTTPException(status_code=400, detail="Email already registered")
    create_user = userCRUD.create(db=db, user=user)
    return create_user

@router.post("/email")
async def send_otp(email: str, db: Session = Depends(get_db)):
    sent = userCRUD.sendVerificationEmail(db=db, email=email)
    return {"email sent" : sent}

@router.post("/email/verification")
def verify_otp(email: str, otp: str):
    verified = userCRUD.verifyCode(email=email, code=otp)
    return {"verified" : verified}

@router.put("/password")
async def reset_password(email: str, otp:str, new_password: str, db: Session = Depends(get_db)):
    if userCRUD.verifyCode(email=email, code=otp):
        userCRUD.update_password(db=db, email=email, password=new_password)
        return {"message" : "Successfully reset password"}
    else:
        return {"message" : "Error"}
    
@router.get("/me", response_model=UserSchema)
def read_myself(db: Session = Depends(get_db), token_data: TokenData = Depends(userCRUD.read_current_user)):
    current_user = userCRUD.read(db=db, id=token_data.id)
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, db: Session = Depends(get_db), current_user: TokenData = Depends(userCRUD.read_current_user)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized user")
    
    db_user = userCRUD.read(db=db, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

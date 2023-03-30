from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database import get_db
from server.schema.user import UserSchema, UserCreate
from server.crud.user import UserCRUD
from server.security.auth import oauth2_scheme

userCRUD = UserCRUD()

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def user_create(user: UserCreate, db: Session = Depends(get_db)):
    if userCRUD.read_by_email(db=db, email=user.email) or userCRUD.read(db=db, id=user.id):
        raise HTTPException(status_code=400, detail="Email already registered")
    create_user = userCRUD.create(user=user)
    return create_user

@router.get("/me", response_model=UserSchema)
def read_myself(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = userCRUD.read_myself(db=db, token=token)
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    userCRUD = UserCRUD(db=db)
    current_user = userCRUD.read_myself(db=db, token=token)
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized user")
    
    db_user = userCRUD.read(db=db, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
    

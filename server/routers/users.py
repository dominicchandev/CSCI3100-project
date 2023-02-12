from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database import get_db
from server.schema.user import UserSchema, UserCreate
from server.crud.user import create_user, get_user_by_email, get_user, get_current_user
from server.security.auth import oauth2_scheme

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def user_create(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db=db, email=user.email) or get_user(db=db, user_id=user.id):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return create_user(db=db, user=user)

@router.get("/me", response_model=UserSchema)
def read_myself(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def read_user(user_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    current_user = get_current_user(db=db, token=token)
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized user")
    
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
    

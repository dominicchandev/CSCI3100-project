import os
from sqlalchemy.orm import Session

from fastapi import HTTPException, status
from jose import jwt, JWTError

from server.models import UserModel
from server.schema.user import UserCreate
from server.schema.token import TokenData
from server.security.auth import salt_and_hash

from server.utils.setting import Setting

setting = Setting()

def create_user(db: Session, user: UserCreate):
    db_user = UserModel(
        id = user.id,
        name = user.name,
        role = user.role,
        email = user.email,
        hash = salt_and_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        return None
    return user

def get_user_by_email(db: Session, email: str):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        return None
    return user

def get_current_user(db: Session, token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, setting.SECRET_KEY, algorithms=[setting.HASH_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db=db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
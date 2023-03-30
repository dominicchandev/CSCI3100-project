import os

from sqlalchemy.orm import Session

from fastapi import HTTPException, status
from jose import jwt, JWTError

from server.models import UserModel
from server.schema.user import UserCreate, UserUpdate
from server.schema.token import TokenData
from server.security.auth import salt_and_hash
from server.utils.setting import Setting
from server.crud.base import CRUDBase

setting = Setting()

class UserCRUD(CRUDBase):
    def __init__(self):
        super().__init__(model=UserModel)

    def create(self, db: Session, user: UserCreate):
        db_user = self.model(
            id = user.id,
            name = user.name,
            role = user.role,
            email = user.email,
            hash = salt_and_hash(user.password)
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def update(self, db: Session, user: UserUpdate):
        db_user = self.db.query(self.model).get(user.id)
        db_user.name = user.name
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def read_by_email(self, db: Session, email: str):
        user = self.db.query(self.model).filter(self.model.email == email).first()
        if not user:
            return None
        return user
    
    def read_myself(self, db: Session, token: str):
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
        user = self.read_by_email(email=token_data.email)
        if user is None:
            raise credentials_exception
        return user
    
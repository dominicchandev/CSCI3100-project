from sqlalchemy.orm import Session

from fastapi import Depends

from server.models import UserModel
from server.crud.base import CRUDBase
from server.utils.setting import Setting
from server.schema.user import UserCreate, UserUpdate
from server.security.auth import salt_and_hash, get_token_data, oauth2_scheme

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
            hash = salt_and_hash(user.password),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def update_username(self, db: Session, user: UserUpdate):
        db_user = db.query(self.model).filter(self.model.id == user.id).first()
        db_user.name = user.name
        db.commit()
        db.refresh(db_user)
        return db_user

    def read_by_email(self, db: Session, email: str):
        user = db.query(self.model).filter(self.model.email == email).first()
        if not user:
            return None
        return user
    
    def read_current_user(self, token: str = Depends(oauth2_scheme)):
        token_data = get_token_data(token)
        return token_data
    
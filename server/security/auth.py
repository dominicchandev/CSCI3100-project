import os

import bcrypt
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from server.models import UserModel

load_dotenv()
salt = bytes(os.environ.get('SALT'), "utf-8")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def authenticate_user(db: Session, email: str, password: str) -> bool:
    user: UserModel = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.salted_hashed_password):
        return False
    return user

def verify_password(plain_password:str, salted_hashed_password:str) -> bool:
    if salt_and_hash(plain_password) == salted_hashed_password:
        return True
    return False

def salt_and_hash(plain_password: str) -> str:
    return bcrypt.hashpw(bytes(plain_password, "utf-8"), salt).decode("utf-8")

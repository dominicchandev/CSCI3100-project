import os

import bcrypt
# from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from server.models import UserModel

# load_dotenv()
# salt = bytes(os.environ.get('SALT'), "utf-8")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def authenticate_user(db: Session, email: str, password: str) -> bool:
    user: UserModel = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hash):
        return False
    return user

def verify_password(plain_password:str, hashpw: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashpw)

def salt_and_hash(plain_password: str) -> bytes:
    salt: bytes = bcrypt.gensalt()
    hashpw: bytes = bcrypt.hashpw(bytes(plain_password, "utf-8"), salt)
    return hashpw
import bcrypt
from jose import jwt

from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from server.models import UserModel
from server.schema.token import TokenData
from server.utils.setting import Setting

setting = Setting()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def authenticate_user(db: Session, email: str, password: str) -> UserModel:
    user: UserModel = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hash):
        return None
    return user

def verify_password(plain_password:str, hashpw: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashpw)

def salt_and_hash(plain_password: str) -> bytes:
    salt: bytes = bcrypt.gensalt()
    hashpw: bytes = bcrypt.hashpw(bytes(plain_password, "utf-8"), salt)
    return hashpw

def get_token_data(token) -> TokenData:
    payload = jwt.decode(token, setting.SECRET_KEY, algorithms=[setting.HASH_ALGORITHM])
    token_data = TokenData(
        id = payload.get("id"),
        name = payload.get("name"),
        email = payload.get("email"),
        role = payload.get("role"),
    )
    return token_data



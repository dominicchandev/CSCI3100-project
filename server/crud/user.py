import os
import smtplib, ssl

from sqlalchemy.orm import Session
from email.message import EmailMessage
from hashlib import sha256
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
    
    def genVerificationCode(self, email: str):
        code = sha256(email.encode('utf-8')).hexdigest()
        return code

    def verifyCode(self, email: str, code: str):
        return code == self.genVerificationCode(email)

    def sendVerificationEmail(self, email: str):
        port = 465  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = setting.GMAIL_ADDRESS
        password = setting.GMAIL_APP_PASSWORD
        msg = EmailMessage()
        code = self.genVerificationCode(email)
        msg.set_content("Your verification code is {}".format(code))
        msg['Subject'] = "[CourseMan] Password Reset Verification Code"
        msg['From'] = sender_email
        msg['To'] = email

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            server.login(sender_email, password)
            server.send_message(msg, from_addr=sender_email, to_addrs=email)


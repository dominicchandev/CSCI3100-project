import smtplib, ssl

from sqlalchemy.orm import Session
from email.message import EmailMessage
from hashlib import sha256
from fastapi import Depends

from server.models import UsersModel
from server.crud.base import CRUDBase
from server.utils.setting import Setting
from server.schema.user import UserCreate, UserUpdate
from server.security.auth import salt_and_hash, get_token_data

setting = Setting()

class UserCRUD(CRUDBase):
    def __init__(self):
        super().__init__(model=UsersModel)

    def create(self, db: Session, user: UserCreate):
        db_user = self.model(
            name = user.name,
            role = "student",
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
    
    def read_current_user(self, db: Session, token_data = Depends(get_token_data)):
        current_user = self.read(db=db, id=token_data.id)
        return current_user        

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


import smtplib, ssl

from sqlalchemy.orm import Session
from email.message import EmailMessage
from hashlib import sha256
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

    def update_password(self, db: Session, email: str, password: str):
        db_user = db.query(self.model).filter(self.model.email == email).first()
        db_user.hash = salt_and_hash(password)
        db.commit()
        db.refresh(db_user)

    def read_by_email(self, db: Session, email: str):
        user = db.query(self.model).filter(self.model.email == email).first()
        if not user:
            return None
        return user
    
    def read_current_user(self, token: str = Depends(oauth2_scheme)):
        token_data = get_token_data(token)
        return token_data

    def genVerificationCode(self, email: str):
        code = sha256(email.encode('utf-8')).hexdigest()
        return code

    def verifyCode(self, email: str, code: str):
        return code == self.genVerificationCode(email)

    def sendVerificationEmail(self, db: Session, email: str):
        if self.read_by_email(db, email) == None:
            return False
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
        return True
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server import models

load_dotenv()

user = os.environ.get('POSTGRES_USER')
pw = os.environ.get('POSTGRES_PASSWORD')
hostname = os.environ.get('POSTGRES_HOSTNAME')

port = os.environ.get('DATABASE_PORT')
db_name = os.environ.get('POSTGRES_DB')

SQLALCHEMY_DATABASE_URL = f"postgresql://{user}:{pw}@{hostname}:{port}/{db_name}"

engine = create_engine(url=SQLALCHEMY_DATABASE_URL)

models.Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

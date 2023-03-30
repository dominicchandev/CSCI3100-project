from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server import models
from server.utils.setting import Setting

setting = Setting()

engine = create_engine(url=setting.AWS_POSTGRES_URL)

models.Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

import os
from dotenv import load_dotenv

load_dotenv()

class Setting:
    def __init__(self) -> None:
        self.SECRET_KEY = os.environ.get('SECRET_KEY')
        self.HASH_ALGORITHM = os.environ.get('ALGORITHM')
        self.AWS_POSTGRES_URL = os.environ.get('AWS_POSTGRES_URL')
        self.ACCESS_TOKEN_EXPIRE_MINUTES = os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES')
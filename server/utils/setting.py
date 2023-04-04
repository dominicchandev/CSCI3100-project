import os
from dotenv import load_dotenv

load_dotenv()

class Setting:
    def __init__(self) -> None:
        self.SECRET_KEY: str = os.environ.get('SECRET_KEY')
        self.HASH_ALGORITHM: str = os.environ.get('ALGORITHM')
        self.AWS_POSTGRES_URL: str = os.environ.get('AWS_POSTGRES_URL')
        self.ACCESS_TOKEN_EXPIRE_MINUTES: float = float(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES'))
        self.DRIVE_FOLDER_ID: str = os.environ.get('DRIVE_FOLDER_ID')
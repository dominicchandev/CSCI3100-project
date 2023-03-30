import os
from typing import Union
from datetime import datetime, timedelta

from jose import jwt

from server.utils.setting import Setting

setting = Setting()

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=setting.ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, setting.SECRET_KEY, algorithm=setting.HASH_ALGORITHM)
    return encoded_jwt
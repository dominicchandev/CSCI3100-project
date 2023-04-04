from typing import Literal
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int
    name: str
    email: str
    role: Literal["student", "admin"]
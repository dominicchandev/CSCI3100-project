from typing import Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from server.schema.token import Token
from server.crud.token import create_access_token
from server.models import UserModel
from server.security.auth import authenticate_user
from server.database import get_db

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user: UserModel = authenticate_user(db=db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name,
    })
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
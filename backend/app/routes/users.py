from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from .. import crud, schemas, database,models
from ..utils.jwt import verify_access_token
import os
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
router = APIRouter(prefix="/users", tags=["users"])

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

@router.get("/me", response_model=schemas.UserRead)
def read_me(db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    db_user = crud.get_user(db, current_user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/me", response_model=schemas.UserRead)
def update_me(update: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    db_user = crud.update_user(db, current_user, update)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/me/upload_cv")
def upload_cv(cv: UploadFile = File(...), db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    upload_dir = "uploads/cv"
    os.makedirs(upload_dir, exist_ok=True)
    file_location = os.path.join(upload_dir, f"{current_user}_cv_{cv.filename}")
    with open(file_location, "wb") as f:
        f.write(cv.file.read())
    db_user = crud.get_user(db, current_user)
    db_user.cv_url = file_location.replace("\\", "/")
    db.commit()
    db.refresh(db_user)
    return {"cv_url": db_user.cv_url}

@router.get("/{user_id}", response_model=schemas.UserRead)
def get_user(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return schemas.UserRead.from_orm(user)
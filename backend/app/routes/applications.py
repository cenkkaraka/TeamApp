from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from .. import crud, schemas, database
from ..utils.jwt import verify_access_token

router = APIRouter(prefix="/applications", tags=["applications"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

@router.post("/", response_model=schemas.Application)
def apply_to_project(application: schemas.ApplicationCreate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    # Unique başvuru kontrolü burada yapılabilir
    db_app = crud.create_application(db, application, user_id=current_user)
    return db_app

@router.get("/project/{project_id}", response_model=list[schemas.Application])
def get_applications_for_project(project_id: int, db: Session = Depends(database.get_db)):
    return crud.get_applications_for_project(db, project_id)

@router.get("/me", response_model=list[schemas.Application])
def get_my_applications(db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    return crud.get_applications_for_user(db, user_id=current_user)

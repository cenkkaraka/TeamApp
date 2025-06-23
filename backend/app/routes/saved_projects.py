from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from .. import crud, schemas, database,models
from ..utils.jwt import verify_access_token
from typing import List

router = APIRouter(prefix="/saved-projects", tags=["saved-projects"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

@router.post("/", response_model=schemas.SavedProject)
def save_project(saved: schemas.SavedProjectCreate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    db_saved = crud.save_project(db, project_id=saved.project_id, user_id=current_user)
    return db_saved

def split_skills(skills):
    if isinstance(skills, str):
        return [s.strip() for s in skills.split(",") if s.strip()]
    return skills

@router.get("/", response_model=List[schemas.SavedProjectWithProject])
def get_saved_projects(db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    saved_projects = db.query(models.SavedProject).filter_by(user_id=current_user).all()
    result = []
    for sp in saved_projects:
        project = sp.project
        # Her roldeki skills'i listeye çevir
        roles = [
            {
                "id": role.id,
                "name": role.name,
                "skills": split_skills(role.skills)
            }
            for role in project.roles
        ]
        result.append({
            "id": sp.id,
            "user_id": sp.user_id,
            "project_id": sp.project_id,
            "project": {
                "id": project.id,
                "owner_id": project.owner_id,
                "title": project.title,
                "category": project.category,
                "stage": project.stage,
                "description": project.description,
                "roles": roles
            }
        })
    return result
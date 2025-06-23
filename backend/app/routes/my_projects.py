from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordBearer
from .. import crud, schemas, database,models
from ..utils.jwt import verify_access_token

router = APIRouter(
    prefix="/my-projects",
    tags=["my-projects"]
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

def split_skills(skills):
    if isinstance(skills, str):
        return [s.strip() for s in skills.split(",") if s.strip()]
    return skills

@router.get("/", response_model=list[schemas.MyProject])
def get_my_projects(db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    # Owner olduğun projeler
    owner_projects = db.query(models.Project).filter(models.Project.owner_id == current_user).all()
    owner_list = [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "relation": "owner"
        } for p in owner_projects
    ]
    # Takım üyesi olduğun projeler (başvurusu "matched")
    application_projects = db.query(models.Application).filter(
        models.Application.user_id == current_user,
        models.Application.status == "matched"
    ).all()
    team_proj_ids = set()
    team_list = []
    for a in application_projects:
        if a.project_id not in team_proj_ids and a.project.owner_id != current_user:
            team_proj_ids.add(a.project_id)
            team_list.append({
                "id": a.project.id,
                "title": a.project.title,
                "description": a.project.description,
                "relation": "team"
            })
    return owner_list + team_list
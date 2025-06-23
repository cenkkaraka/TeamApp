from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas
from ..utils.jwt import verify_access_token

from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/projects", tags=["chat-menu"])

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

@router.get("/{project_id}/team-chat", response_model=list[schemas.UserRead])
def get_team_chat_list(
    project_id: int,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Takım üyeleri (başvurusu kabul edilenler), projeye başvuran ve status="matched" olanlar
    applications = db.query(models.Application).filter(
        models.Application.project_id == project_id,
        models.Application.status == "matched"
    ).all()
    user_ids = set([a.user_id for a in applications])
    user_ids.add(project.owner_id)  # Proje sahibi de takımda
    if current_user in user_ids:
        user_ids.remove(current_user)  # Kendini çıkar
    
    users = db.query(models.User).filter(models.User.id.in_(user_ids)).all()
    return users
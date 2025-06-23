from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from fastapi.security import OAuth2PasswordBearer
from typing import List
from .. import crud, schemas, database,models
from ..utils.jwt import verify_access_token

router = APIRouter(prefix="/projects", tags=["projects"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def split_skills(skills):
    if isinstance(skills, str):
        return [s.strip() for s in skills.split(",") if s.strip()]
    return skills

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    db_project = crud.create_project(db, project, owner_id=current_user)
    return {"id": db_project.id,
        "title": db_project.title,
        "description": db_project.description,
        "category": db_project.category,
        "stage": db_project.stage.lower(),
        "owner_id": db_project.owner_id,# küçük harfli string
        "roles": [
            {
                "id": role.id,
                "name": role.name,
                "skills": split_skills(role.skills)
            }
            for role in db_project.roles
        ],
    }
@router.post("/{project_id}/ignore", status_code=201)
def ignore_project(
    project_id: int,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user)
):
    already_ignored = db.query(models.IgnoredProject).filter_by(
        user_id=current_user, project_id=project_id
    ).first()
    if already_ignored:
        raise HTTPException(status_code=409, detail="Zaten ilgilenilmiyor olarak işaretlenmiş.")
    ignore = models.IgnoredProject(user_id=current_user, project_id=project_id)
    db.add(ignore)
    db.commit()
    return {"message": "Proje ilgilenilmiyor olarak işaretlendi."}

@router.get("/", response_model=list[schemas.Project])
def list_projects(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db),current_user: int = Depends(get_current_user)):
    
    user_id = current_user 
    db_projects =crud.get_projects(db,user_id, skip=skip, limit=limit)
    result = []
    for db_project in db_projects:
        result.append({
            "id": db_project.id,
            "title": db_project.title,
            "description": db_project.description,
            "category": db_project.category,
            "stage": db_project.stage,
            "owner_id": db_project.owner_id,
            "roles": [
                {
                    "id": role.id,
                    "name": role.name,
                    "skills": split_skills(role.skills)
                }
                for role in db_project.roles
            ],
            # diğer alanlar...
        })
    return result
@router.get("/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(database.get_db)):
    db_project = crud.get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": db_project.id,
        "title": db_project.title,
        "description": db_project.description,
        "category": db_project.category,
        "stage": db_project.stage,
        "owner_id": db_project.owner_id,
        "roles": [
            {
                "id": role.id,
                "name": role.name,
                "skills": split_skills(role.skills)
            }
            for role in db_project.roles
        ],
        # diğer alanlar...
    }
    

@router.get("/{project_id}/team")
def get_project_team(project_id: int, db: Session = Depends(database.get_db)):
    # Matched başvuruları ve ilgili user ve role ile döndür
    applications = db.query(models.Application).filter_by(project_id=project_id, status="matched").all()
    team = []
    for app in applications:
        team.append({
            "user": {
                "id": app.user.id,
                "name": app.user.name,
                "skills": app.user.skills,
                "school": app.user.school,
                "bio": app.user.bio,
            },
            "role": {
                "id": app.role.id,
                "name": app.role.name,
                "skills": app.role.skills,
            }
        })
    return team

@router.post("/{project_id}/applications/{application_id}/match", status_code=200)
def match_application(
    project_id: int,
    application_id: int,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user)
):
    # Sadece proje sahibi kendi projesindeki başvuruyu eşleştirebilir
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project or project.owner_id != current_user:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok.")
    application = db.query(models.Application).filter(
        models.Application.id == application_id,
        models.Application.project_id == project_id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı.")
    application.status = "matched"
    db.commit()
    return {"message": "Başvuru eşleşti!"}
def calculate_match_score(application: models.Application) -> int:
    app_skills = set(application.user.skills.split(",")) if application.user.skills else set()
    required_skills = set(application.role.skills.split(",")) if application.role.skills else set()
    if not required_skills:
        return 0
    matched = len(app_skills & required_skills)
    total = len(required_skills)
    return int(100 * matched / total) if total > 0 else 0

@router.get("/{project_id}/applications", response_model=List[schemas.ApplicationDetail])
def get_applications_for_project(
    project_id: int,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project or project.owner_id != current_user:
        raise HTTPException(status_code=404, detail="Proje bulunamadı veya izin yok")
    applications = db.query(models.Application).filter(models.Application.project_id == project_id).all()
    applications_out = []
    for app in applications:
        user_dict = schemas.UserRead.from_orm(app.user).model_dump()
        role_dict = {
            "id": app.role.id,
            "name": app.role.name,
            "skills": split_skills(app.role.skills)
        }
        app_dict = {
            "id": app.id,
            "user": user_dict,
            "role": role_dict,
            "status": app.status,
            "match_score": calculate_match_score(app)
        }
        applications_out.append(app_dict)
    applications_out.sort(key=lambda x: x["match_score"], reverse=True)
    return applications_out
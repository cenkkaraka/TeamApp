from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from fastapi import Depends
from app.utils.deps import get_current_user
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None
    return db_user

def update_user_cv(db: Session, user_id: int, cv_url: str):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db_user.cv_url = cv_url
    db.commit()
    db.refresh(db_user)
    return db_user



def create_project(db: Session,project: schemas.ProjectCreate, owner_id: int):
    db_project = models.Project(
        title=project.title,
        description=project.description,
        stage=project.stage,
        category=project.category,
        owner_id=owner_id,
    )
    db.add(db_project)
    db.flush()
    for role in project.roles:
        skills = role.skills
        if isinstance(skills, list):
            skills = ",".join(skills)
        db_role = models.ProjectRole(
            name=role.name,
            project_id=db_project.id,
            skills=skills
        )
        db.add(db_role)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def get_projects(db: Session, user_id: int, skip=0, limit=20):
    ignored = db.query(models.IgnoredProject.project_id).filter_by(user_id=user_id).subquery()
    projects = db.query(models.Project).filter(~models.Project.id.in_(ignored)).all()
    return projects

# Application
def create_application(db: Session, application: schemas.ApplicationCreate, user_id: int):
    db_app = models.Application(
        user_id=user_id,
        project_id=application.project_id,
        role_id=application.role_id,
        status="pending"
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

def get_applications_for_project(db: Session, project_id: int):
    return db.query(models.Application).filter(models.Application.project_id == project_id).all()

def get_applications_for_user(db: Session, user_id: int):
    return db.query(models.Application).filter(models.Application.user_id == user_id).all()

# Message
def create_message(db: Session, message: schemas.MessageCreate, sender_id: int):
    db_msg = models.Message(
        sender_id=sender_id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

def get_conversation(db: Session, user1_id: int, user2_id: int):
    return db.query(models.Message).filter(
        ((models.Message.sender_id == user1_id) & (models.Message.receiver_id == user2_id)) |
        ((models.Message.sender_id == user2_id) & (models.Message.receiver_id == user1_id))
    ).order_by(models.Message.sent_at).all()

def get_inbox(db: Session, user_id: int):
    return db.query(models.Message).filter(models.Message.receiver_id == user_id).order_by(models.Message.sent_at.desc()).all()
def save_project(db: Session, project_id: int, user_id: int):
    db_saved = models.SavedProject(project_id=project_id, user_id=user_id)
    db.add(db_saved)
    db.commit()
    db.refresh(db_saved)
    return db_saved

def get_saved_projects(db: Session, user_id: int):
    return db.query(models.SavedProject).filter(models.SavedProject.user_id == user_id).all()
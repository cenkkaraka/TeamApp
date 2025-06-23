from typing import List, Optional
from pydantic import BaseModel , EmailStr
from datetime import datetime
import enum

class ProjectStageEnum(str, enum.Enum):
    idea = "idea"
    prototype = "prototype"
    launched = "launched"

class ProjectCategoryEnum(str, enum.Enum):
    ecommerce = "ecommerce"
    health = "health"
    education = "education"
    other = "other"

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    school: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None
    cv_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    name: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    school: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None
    cv_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class UserRead(UserBase):
    id: int
    model_config = dict(from_attributes=True)
# Project Schemas
class ProjectRoleBase(BaseModel):
    name: str
    skills: Optional[List[str]] = None

class ProjectRoleCreate(ProjectRoleBase):
    pass

class ProjectRole(ProjectRoleBase):
    id: int
    model_config = dict(from_attributes=True)

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    stage: ProjectStageEnum
    category: ProjectCategoryEnum
    roles: List[ProjectRoleCreate] 
class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    roles: List[ProjectRole] = []
    model_config = dict(from_attributes=True)

# Application schemas
class ApplicationBase(BaseModel):
    role_id: int

class ApplicationCreate(ApplicationBase):
    project_id: int

class Application(ApplicationBase):
    id: int
    user_id: int
    project_id: int
    status: str
    model_config = dict(from_attributes=True)
class ApplicationDetail(BaseModel):
    id: int
    user: UserRead
    role: ProjectRole
    status: str
    match_score: int = 0  # <-- yeni alan
    model_config = dict(from_attributes=True)

class MyProject(BaseModel):
    id: int
    title: str
    description: str
    relation: str  # "owner" veya "team"
        
# Message schemas
class MessageBase(BaseModel):
    receiver_id: int
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sender_id: int
    sent_at: datetime
    project_id: Optional[int] = None  # Proje ile ilişkilendirilmişse
    is_read: bool
    is_mine: bool = False  # Kullanıcıya ait mesajlar için True
    model_config = dict(orm_mode=True)

# Saved project schemas
class SavedProjectBase(BaseModel):
    project_id: int

class SavedProjectCreate(SavedProjectBase):
    pass

class SavedProject(SavedProjectBase):
    id: int
    user_id: int
    model_config = dict(orm_mode=True)
class SavedProjectWithProject(SavedProject):
    project: Project

    model_config = dict(from_attributes=True)
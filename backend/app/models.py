from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

class ProjectStage(str, enum.Enum):
    idea = "idea"
    prototype = "prototype"
    launched = "launched"

class ProjectCategory(str, enum.Enum):
    ecommerce = "E-Commerce"
    health = "health"
    education = "Education"
    other = "Other"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=True)
    school = Column(String, nullable=True)
    skills = Column(String, nullable=True)  # "python,react"
    bio = Column(Text, nullable=True)
    cv_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    projects = relationship("Project", back_populates="owner")
    applications = relationship("Application", back_populates="user")
    messages_sent = relationship("Message", foreign_keys='Message.sender_id', back_populates="sender")
    messages_received = relationship("Message", foreign_keys='Message.receiver_id', back_populates="receiver")
    saved_projects = relationship("SavedProject", back_populates="user")
    ignored_projects = relationship("IgnoredProject", back_populates="user", cascade="all, delete-orphan")
    
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    stage = Column(Enum(ProjectStage), nullable=False)
    category = Column(Enum(ProjectCategory), nullable=False)
    date_posted = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="projects")
    roles = relationship("ProjectRole", back_populates="project", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="project")
    saved_by = relationship("SavedProject", back_populates="project")
    ignored_by_users = relationship("IgnoredProject", back_populates="project", cascade="all, delete-orphan")

class ProjectRole(Base):
    __tablename__ = "project_roles"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String(50), nullable=False)
    skills = Column(String(250), nullable=True)  # "python,react"
    project = relationship("Project", back_populates="roles")
    applications = relationship("Application", back_populates="role")
class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    role_id = Column(Integer, ForeignKey("project_roles.id"))
    status = Column(String, default="pending")  # pending, matched, rejected

    user = relationship("User", back_populates="applications")
    project = relationship("Project", back_populates="applications")
    role = relationship("ProjectRole")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    sender = relationship("User", foreign_keys=[sender_id], back_populates="messages_sent")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="messages_received")

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    user1_id = Column(Integer, ForeignKey("users.id"))
    user2_id = Column(Integer, ForeignKey("users.id"))
    user1 = relationship("User", foreign_keys=[user1_id])
    user2 = relationship("User", foreign_keys=[user2_id])

class SavedProject(Base):
    __tablename__ = "saved_projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))

    user = relationship("User", back_populates="saved_projects")
    project = relationship("Project", back_populates="saved_by")
 
class IgnoredProject(Base):
    __tablename__ = "ignored_projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint('user_id', 'project_id', name='_user_project_uc'),)

    user = relationship("User", back_populates="ignored_projects")
    project = relationship("Project", back_populates="ignored_by_users")
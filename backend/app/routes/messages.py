from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from .. import crud, schemas, database,models
from ..utils.jwt import verify_access_token

router = APIRouter(prefix="/messages", tags=["messages"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def are_matched(db: Session, user1_id: int, user2_id: int) -> bool:
    """
    İki kullanıcı arasında match olup olmadığını kontrol eder.
    Match tablosunda iki taraflı bakar.
    """
    return db.query(models.Match).filter(
        ((models.Match.user1_id == user1_id) & (models.Match.user2_id == user2_id)) |
        ((models.Match.user1_id == user2_id) & (models.Match.user2_id == user1_id))
    ).first() is not None

def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_access_token(token)

@router.get("/matches", response_model=list[schemas.UserRead])
def get_matches(db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    """
    Giriş yapan kullanıcının match olduğu kullanıcıları döndürür.
    """
    matches = db.query(models.Match).filter(
        (models.Match.user1_id == current_user) | (models.Match.user2_id == current_user)
    ).all()
    user_ids = set()
    for m in matches:
        user_ids.add(m.user1_id if m.user2_id == current_user else m.user2_id)
    users = db.query(models.User).filter(models.User.id.in_(user_ids)).all()
    return users

@router.get("/{user_id}", response_model=list[schemas.Message])
def get_messages_with_user(user_id: int, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    """
    Sadece match olunan kullanıcıyla olan mesajları getirir.
    """
    if not are_matched(db, current_user, user_id):
        raise HTTPException(status_code=403, detail="Bu kullanıcı ile mesajlaşamazsınız.")
    messages = db.query(models.Message).filter(
        ((models.Message.sender_id == current_user) & (models.Message.receiver_id == user_id)) |
        ((models.Message.sender_id == user_id) & (models.Message.receiver_id == current_user))
    ).order_by(models.Message.sent_at.asc()).all()
    # is_mine: mesajı gönderen ben miyim?
    for m in messages:
        m.is_mine = (m.sender_id == current_user)
    return messages

@router.post("/", response_model=schemas.Message)
def send_message(message: schemas.MessageCreate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    db_msg = crud.create_message(db, message, sender_id=current_user)
    return db_msg

@router.get("/with/{user_id}", response_model=list[schemas.Message])
def get_conversation(user_id: int, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    return crud.get_conversation(db, user1_id=current_user, user2_id=user_id)

@router.get("/inbox", response_model=list[schemas.Message])
def get_inbox(db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    return crud.get_inbox(db, user_id=current_user)

@router.post("/send", response_model=schemas.Message)
def send_message(message: schemas.MessageCreate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    """
    Sadece match olunan kullanıcıya mesaj gönderebilir.
    """
    if not are_matched(db, current_user, message.receiver_id):
        raise HTTPException(status_code=403, detail="Bu kullanıcı ile mesajlaşamazsınız.")
    msg = models.Message(
        sender_id=current_user,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    msg.is_mine = True
    return msg

def is_in_project_team(db: Session, project_id: int, user_id: int) -> bool:
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project: return False
    if user_id == project.owner_id:
        return True
    return db.query(models.Application).filter(
        models.Application.project_id == project_id,
        models.Application.user_id == user_id,
        models.Application.status == "matched"
    ).first() is not None

@router.get("/{project_id}/messages/{user_id}", response_model=list[schemas.Message])
def get_project_messages(
    project_id: int,
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user)
):
    # only allow if both current_user and user_id are in the same project team
    if not (is_in_project_team(db, project_id, current_user) and is_in_project_team(db, project_id, user_id)):
        raise HTTPException(status_code=403, detail="Bu kişiyle bu projede mesajlaşamazsınız.")
    messages = db.query(models.Message).filter(
        ((models.Message.sender_id == current_user) & (models.Message.receiver_id == user_id)) |
        ((models.Message.sender_id == user_id) & (models.Message.receiver_id == current_user)),
        models.Message.project_id == project_id
    ).order_by(models.Message.sent_at.asc()).all()
    for m in messages:
        m.is_mine = (m.sender_id == current_user)
    return messages

@router.post("/{project_id}/messages/send", response_model=schemas.Message)
def send_project_message(
    project_id: int,
    message: schemas.MessageCreate,
    db: Session = Depends(database.get_db),
    current_user: int = Depends(get_current_user)
):
    # only allow if both are in the team
    if not (is_in_project_team(db, project_id, current_user) and is_in_project_team(db, project_id, message.receiver_id)):
        raise HTTPException(status_code=403, detail="Bu kullanıcıya bu projede mesaj gönderemezsiniz.")
    new_msg = models.Message(
        sender_id=current_user,
        receiver_id=message.receiver_id,
        content=message.content,
        project_id=project_id
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    new_msg.is_mine = True
    return new_msg
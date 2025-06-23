from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..utils.jwt import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user_id = verify_access_token(token)
        return user_id
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
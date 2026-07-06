from fastapi.security import OAuth2PasswordBearer


from fastapi import Depends, HTTPException,APIRouter
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth import verify_access_token
from app.schemas import UserResponse              #added this this also was causing error
print("dependencies.py entered")
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)
def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):
    print("reached current user in dependencies")
    payload = verify_access_token(token)
    user_id = int(payload["sub"])
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    return user
@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user
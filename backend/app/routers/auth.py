from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User,Page
from app.dependencies import get_current_user
from app.schemas import UserCreate, UserResponse,UserLogin, Token,PageData,PageResponse
from app.auth import hash_password,verify_password, create_access_token
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.email.split('@')[0],        #from here the error was occuring
        email=user.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login",response_model=Token)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):

    user=(db.query(User).filter(User.email==login_data.email).first())

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="invalid email or password"
        )
    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    access_token = create_access_token(
        data={
            "sub": str(user.user_id)
        }
    )
    return {
    "access_token": access_token,
    "token_type": "bearer"
}
@router.post("/page_data_title",response_model=PageResponse)
# def page_data_title(user: PageData,db: Session = Depends(get_db)):
def page_data_title(page: PageData,current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    new_data=Page(
        user_id=current_user.user_id,
        page_id=page.page_id,
        title=page.title,
        page_type=page.page_type,
        page_data=page.page_data,
        parent_page_id=page.parent_page_id

    )
    db.add(new_data)
    db.commit()
    db.refresh(new_data)
    return new_data
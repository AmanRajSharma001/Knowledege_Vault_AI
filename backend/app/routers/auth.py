from fastapi import APIRouter, Depends, HTTPException
from fastapi import APIRouter, UploadFile, File
# from app.pipeline import process_pdf
from app.RAG.pipeline import process_RAG_pdf
from sqlalchemy.orm import Session
from app.RAG.retriever import ask_question
from app.RAG.vector_store import search_faiss
from app.RAG.llm import generate_answer, FALLBACK_UNAVAILABLE
from app.schemas import QueryRequest,AskRequest

from app.database import get_db
from app.models import User,Page
from app.dependencies import get_current_user
from app.schemas import UserCreate, UserResponse,UserLogin, Token,PageData,PageResponse
from app.auth import hash_password,verify_password, create_access_token

from app.RAG.vector_store import search_faiss
from app.RAG.llm import generate_answer, FALLBACK_UNAVAILABLE

from app.schemas import AskRequest,QueryRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup", response_model=UserResponse)
def signup(
    user: UserCreate, 
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User).filter(User.email == user.email).first()
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


@router.post("/login", response_model=Token)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):

    user=(db.query(User).filter(User.email==login_data.email).first())

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
        
    if not verify_password(login_data.password, user.password_hash):
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



@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # 1. Read file into memory bytes
    pdf_bytes = await file.read()
    result=process_pdf(
        pdf_bytes,
        file.filename
    )
    return result

@router.post("/RAG_start_work")
async def UPLOAD_RAG_PDF(file: UploadFile = File(...)):
    # 1. Read file into memory bytes
    pdf_bytes = await file.read()
    result=process_RAG_pdf(
        pdf_bytes,
        file.filename
    )
    return result

@router.post("/RAG_Query")
async def ask_question(request: AskRequest):
    """Primary chat endpoint called by the frontend."""
    try:
        if request.mode == "ai":
            answer = generate_answer(request.question, chunks=[], mode="ai")
            return {"answer": answer}

        retrieved_chunks = search_faiss(request.question)
        retrieved_chunks = [c.strip() for c in retrieved_chunks if c and c.strip()]

        if not retrieved_chunks:
            return {"answer": "I could not find that information in the uploaded document."}

        answer = generate_answer(request.question, retrieved_chunks, mode="rag")
        return {"answer": answer}

    except Exception:
        return {"answer": FALLBACK_UNAVAILABLE}

    


from fastapi import APIRouter, UploadFile, File
from app.RAG.pipeline import process_RAG_pdf

# Create a router instance for handling upload-related features
router = APIRouter()

@router.post("/upload")
async def UPLOAD_RAG_PDF(file: UploadFile = File(...)):
    # 1. Read file into memory bytes
    pdf_bytes = await file.read()
    result=process_RAG_pdf(
        pdf_bytes,
        file.filename
    )
    return result
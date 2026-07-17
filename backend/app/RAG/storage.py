from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

BUCKET_NAME = "notionstorage"

def upload_pdf_to_supabase(pdf_bytes, filename):

    response = supabase.storage.from_(BUCKET_NAME).upload(
        path=filename,
        file=pdf_bytes,
        file_options={
            "content-type": "application/pdf",
            "upsert": "true"
        }
    )

    return response
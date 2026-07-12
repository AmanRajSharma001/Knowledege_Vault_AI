from app.storage import upload_pdf_to_supabase
def process_pdf(pdf_bytes, filename):

    # Store original PDF
    upload_pdf_to_supabase(
        pdf_bytes,
        filename
    )
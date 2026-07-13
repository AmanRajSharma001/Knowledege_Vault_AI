from app.storage import upload_pdf_to_supabase
def process_pdf(pdf_bytes, filename):

    # Store original PDF
    response=upload_pdf_to_supabase(pdf_bytes,filename)
    return {"message": "PDF uploaded successfully","storage": response}
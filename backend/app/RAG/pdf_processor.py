import fitz
import re
def extract_text_from_bytes(pdf_bytes):

    doc = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text
def splitting_the_text(text):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return sentences

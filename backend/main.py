from fastapi import FastAPI
from app.test import printshello
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/upload")
def upload():
    text=printshello()
    print("end point hit")
    return{"message":text}


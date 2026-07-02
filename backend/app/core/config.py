from dotenv import load_dotenv
import os

load_dotenv()
USERNAME=os.getenv("USERNAME")
PASSWORD= os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")
DB_NAME=os.getenv("DB_NAME")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
)
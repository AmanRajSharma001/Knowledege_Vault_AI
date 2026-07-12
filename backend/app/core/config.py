# python-dotenv is a library that reads key-value pairs from a .env file and sets them as environment variables.
# It helps keep secrets (database credentials, API keys) out of the source code, adhering to the Twelve-Factor App methodology.
from dotenv import load_dotenv
import os

# load_dotenv() searches for a .env file in the current working directory (or parent directories) and loads its variables.
# By loading it here, we ensure that os.getenv() can access these local configurations before any other module starts.
load_dotenv()
USERNAME=os.getenv("POSTGRES_USERNAME")
PASSWORD= os.getenv("PASSWORD")
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")
DB_NAME=os.getenv("DB_NAME")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
)
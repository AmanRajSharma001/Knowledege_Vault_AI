# python-dotenv is a library that reads key-value pairs from a .env file and sets them as environment variables.
# It helps keep secrets (database credentials, API keys) out of the source code, adhering to the Twelve-Factor App methodology.
from dotenv import load_dotenv
import os

# load_dotenv() searches for a .env file in the current working directory (or parent directories) and loads its variables.
# By loading it here, we ensure that os.getenv() can access these local configurations before any other module starts.
load_dotenv()

# We retrieve database connection variables using os.getenv().
# To prevent the application from crashing if a variable is missing, we provide default fallback values.
# In a production environment, these environment variables will be populated by the hosting provider (Docker, AWS, etc.).
USERNAME = os.getenv("USERNAME", "postgres")
PASSWORD = os.getenv("PASSWORD", "1234")
HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "finaldb")

# SECRET_KEY is the secret cryptographic key used to sign the JWT access tokens. 
# It must be kept private. If leaked, anyone can forge tokens and gain full access to the system.
SECRET_KEY = os.getenv("SECRET_KEY", "THIS_IS_A_LONG_RANDOM_SECRET_KEY_CHANGE_ME")

# ALGORITHM defines the signing algorithm for JWT. HS256 stands for HMAC using SHA-256 (symmetric encryption).
# It uses the same secret key to sign (create) and verify the token.
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# ACCESS_TOKEN_EXPIRE_MINUTES defines how long a JWT remains valid. Shorter durations (e.g., 30 mins) reduce risk if a token is stolen.
# Since os.getenv() returns a string, we cast it to an integer (int()) so it can be used in timedelta operations.
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
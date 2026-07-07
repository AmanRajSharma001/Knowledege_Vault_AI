from passlib.context import CryptContext  #it is a bycrpt machine hashes the password
from fastapi import HTTPException
from jose import jwt
from jose import JWTError, jwt
from datetime import datetime, timedelta

from app.core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
def hash_password(password: str):
    print("password is hashed")
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str):
    print("password is verified")
    return pwd_context.verify(plain_password,hashed_password)

def create_access_token(data: dict):
    print("token is created")
    to_encode = data.copy()
    
    # We compute the expiration timestamp. We use UTC to ensure consistent timing.
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # We append the 'exp' (expiration) claim to the JWT payload.
    # JWT standard claims are 3-letter abbreviations: 'sub' (subject), 'exp' (expiration time), etc.
    to_encode.update({"exp": expire})
    
    # jwt.encode cryptographically signs the payload with our SECRET_KEY using the specified ALGORITHM (HS256).
    # The output is a string composed of three base64url-encoded parts separated by dots: HEADER.PAYLOAD.SIGNATURE.
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return encoded_jwt

def verify_access_token(token: str) -> dict:
    """
    Decodes, validates, and verifies the signature of an incoming JWT.
    """
    try:
        print("token is verified")
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        # If verification fails (expired, invalid signature, malformed token), we raise an HTTPException.
        # FastAPI's exception handler catches this and returns a 401 Unauthorized response to the client.
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
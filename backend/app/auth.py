# passlib.context.CryptContext is a helper class to handle password hashing.
# It manages hashing algorithms, salting, and verify steps.
from passlib.context import CryptContext

# jose (JavaScript Object Signing and Encryption) is the library used to manage JWT (JSON Web Tokens).
# - jwt.encode: Used to sign and package user claims into a JWT string.
# - jwt.decode: Used to verify the signature of a token and unpack its claims.
# - JWTError: Base exception raised for parsing or signature errors.
from jose import jwt, JWTError

# datetime and timedelta allow us to manage time offsets and calculate token expirations.
# timezone from datetime ensures we generate UTC timestamps, protecting against system time offsets.
from datetime import datetime, timedelta, timezone

# HTTPException is FastAPI's standard framework exception.
# By raising this, FastAPI automatically catches it and returns the HTTP status code and details to the client.
# FIX: Added missing import to resolve NameError.
from fastapi import HTTPException

# We import JWT signing configuration.
# 'app.core.config' absolute packages assume execution from the 'backend' folder.
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# We initialize our CryptContext to manage security.
# - schemes=["bcrypt"]: Sets bcrypt as our hashing algorithm. Bcrypt automatically generates a unique salt per password
#   and performs multiple hashing rounds, protecting passwords against rainbow tables and brute-force attacks.
# - deprecated="auto": Instructs passlib to mark older hashing schemes as deprecated if we upgrade them in the future.
# CRITICAL FIX: Spelled 'bcrypt' correctly (was 'bycrpt', which crashed at runtime).
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using the configured bcrypt scheme.
    Bcrypt is a slow hashing algorithm by design. This CPU delay makes brute-force attacks unfeasible.
    """
    # pwd_context.hash() takes care of generating a secure random salt, hashing the password,
    # and packing the algorithm version, salt, and hash into a single standard string.
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a stored bcrypt hash.
    """
    # pwd_context.verify() extracts the salt from the hashed_password string, hashes the plain_password
    # with that salt, and compares the hashes in constant time to prevent timing attacks.
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """
    Generates a cryptographically signed JSON Web Token (JWT).
    """
    # We copy the payload dictionary to avoid mutating the original reference.
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
        # jwt.decode verifies that the signature matches the header and payload.
        # If the token has been altered, or if it is expired, it raises a JWTError.
        # It also automatically verifies that the current time is before the 'exp' claim.
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
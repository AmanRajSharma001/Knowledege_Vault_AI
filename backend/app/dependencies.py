# OAuth2PasswordBearer is a class in FastAPI that establishes the bearer token flow.
# When instantiated, it tells FastAPI that clients must provide an 'Authorization: Bearer <token>' header.
# - tokenUrl="/auth/login": Tells OpenAPI/Swagger UI where to fetch the token when testing via the interactive docs.
from fastapi.security import OAuth2PasswordBearer

# Depends: FastAPI's tool for dependency injection. It allows sharing database sessions, current users, etc.
# HTTPException: FastAPI framework exception used to abort requests with specific HTTP codes and details.
# APIRouter: Used to define a sub-router for route modularity.
from fastapi import Depends, HTTPException, APIRouter

# Session is the SQLAlchemy transaction handle used to run queries.
from sqlalchemy.orm import Session

# We import the relative database session generator, the User model, and the JWT token verification helper.
from app.database import get_db
from app.models import User
from app.auth import verify_access_token
# FIX: Imported missing UserResponse schema to resolve NameError in the '/me' route configuration.
from app.schemas import UserResponse

# We initialize a router instance for auth-related endpoints.
# - prefix="/auth": Prepends '/auth' to all endpoints defined on this router (e.g. '/auth/me').
# - tags: Categorizes these endpoints in OpenAPI/Swagger documentation.
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# oauth2_scheme is a dependency. When we use Depends(oauth2_scheme), FastAPI automatically:
# 1. Looks for the 'Authorization' header in the incoming HTTP request.
# 2. Checks if the value starts with 'Bearer '.
# 3. Extracts the token string itself and passes it to the function parameter.
# 4. If the header is missing, it automatically returns a HTTP 401 Unauthorized response to the client.
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

# get_current_user acts as a reusable gatekeeper dependency for protecting endpoints.
# It extracts the token, verifies it, fetches the corresponding user from the database, and returns the User object.
# If anything fails, it aborts the request by raising an HTTPException.
def get_current_user(
    # Depends(oauth2_scheme) extracts the token string from the request headers
    token: str = Depends(oauth2_scheme),
    # Depends(get_db) provides a clean database transaction session for this request
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency injection handler to authenticate requests. Decodes the JWT token,
    validates the subject claim, and confirms the user exists in the database.
    """
    # verify_access_token checks the token signature and returns the payload dict, or raises 401.
    payload = verify_access_token(token)
    
    # We extract the 'sub' (subject) claim which holds the user's primary key (user_id).
    # SECURITY FIX: We use payload.get() instead of direct dictionary indexing payload["sub"] to avoid KeyError crashes.
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=401,
            detail="Token payload is missing user identification claim (sub)"
        )
    
    # SECURITY FIX: We wrap the string-to-int conversion in a try/except block.
    # If a malicious token contains a non-integer 'sub' claim, the code previously threw a ValueError,
    # causing a HTTP 500 server crash. We now handle it gracefully and raise a 401.
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid user identification format in token"
        )
        
    # We query the database to find the user matching the user_id.
    # SQLAlchemy converts this query into a SELECT statement: SELECT * FROM users WHERE user_id = :user_id LIMIT 1.
    user = db.query(User).filter(User.user_id == user_id).first()
    
    # If the user is not found (e.g., their account was deleted, but their token is still valid),
    # we raise an HTTPException to deny access.
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials - user does not exist"
        )
        
    # We return the SQLAlchemy user object. FastAPI makes this object available to any route handler
    # that has Depends(get_current_user) in its parameter list.
    return user


# Protected endpoint to fetch the logged-in user's profile details.
# - response_model=UserResponse: Instructs FastAPI to serialize the returned SQLAlchemy User object
#   using the UserResponse schema, filtering out internal properties like 'password_hash'.
@router.get("/me", response_model=UserResponse)
def get_me(
    # Depends(get_current_user) triggers our gatekeeper dependency. 
    # The route handler is only executed if get_current_user returns a valid User object.
    current_user: User = Depends(get_current_user)
):
    """
    Returns the authenticated user's profile metadata.
    This route is protected; access requires a valid JWT Bearer token.
    """
    # The current_user object is returned. Pydantic automatically serializes it matching UserResponse.
    return current_user
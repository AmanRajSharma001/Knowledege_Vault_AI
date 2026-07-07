# FastAPI is the core web framework class used to build our API.
# Depends: The dependency injection helper.
from fastapi import FastAPI, Depends

# CORSMiddleware is a security middleware that manages Cross-Origin Resource Sharing (CORS).
# Since our React frontend runs on 'http://localhost:5173' and our FastAPI backend runs on 'http://localhost:8000',
# browsers block requests unless CORS is explicitly configured. We allow our React port to make requests.
from fastapi.middleware.cors import CORSMiddleware

# Session handles SQLAlchemy database queries and transactions.
from sqlalchemy.orm import Session
from typing import List

# We import our database configurations and engine setup.
# - Base: The declarative base containing metadata for tables.
# - engine: The database engine connection manager.
# - get_db: Dependency providing connection sessions per request.
# - create_database_if_not_exists: Safe DB creation function.
from app.database import engine, get_db, create_database_if_not_exists, Base

# We import the User model and its response schemas.
from app.models import User
from app.schemas import UserResponse

# We import the route blueprints (APIRouters) for authentication and token validation.
from app.routers.auth import router as auth_router
from app.dependencies import router as me_router

# Initialize the core FastAPI app instance.
app = FastAPI(
    title="Knowledge Vault AI Backend",
    description="Secure FastAPI Backend with PostgreSQL, SQLAlchemy, and JWT Authentication.",
    version="1.0.0"
)

# Configure CORS so our React frontend can interact with the backend API.
# - allow_origins: Specifies the list of allowed origins.
# - allow_credentials: Allow browser cookies to be shared (important for stateful login).
# - allow_methods/headers: Allow all HTTP verbs (GET, POST, etc.) and standard headers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run database checks at startup.
# This function automatically creates the target PostgreSQL database if it does not exist.
create_database_if_not_exists()

# Base.metadata.create_all automatically generates database tables in PostgreSQL.
# It reads all SQLAlchemy models (User, Page, Agent) that inherit from 'Base' and creates
# their tables if they are missing in the schema.
Base.metadata.create_all(bind=engine)

# Include the routers (endpoints) in the main FastAPI application.
# This registers all path operations from routers/auth.py and dependencies.py.
app.include_router(auth_router)
app.include_router(me_router)

# Basic diagnostic routes to verify database connection and integration.

@app.get("/")
def read_root():
    """
    Root endpoint for service health diagnostics.
    """
    return {"message": "Knowledge Vault AI Backend is running successfully!"}


@app.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """
    Admin diagnostic route that returns all users in the system.
    Demonstrates how SQLAlchemy reads multiple records from the database.
    """
    # db.query(User).all() translates to 'SELECT * FROM users' and returns a list of User objects.
    return db.query(User).all()

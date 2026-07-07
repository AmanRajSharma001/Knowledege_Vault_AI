# Pydantic is a data validation and settings management library.
# It enforces type hints at runtime, validates incoming payloads, and formats outgoing responses.
# - BaseModel: The base class for defining structures and data contracts.
# - EmailStr: A specialized type that automatically validates if a string is a RFC 5322 compliant email address.
# - Field: Used to add metadata and validation rules (like min_length, max_length, pattern matching) to schema fields.
# - ConfigDict: A typing container used to configure Pydantic model behaviors.
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# UserCreate defines the schema for incoming user registration requests.
# It enforces strict validation rules before our application processes the payload.
class UserCreate(BaseModel):
    # user_name is required for signup. We enforce a length constraint between 3 and 50 characters.
    user_name: str = Field(min_length=3, max_length=50, description="The display name of the user")
    
    # EmailStr automatically rejects malformed email strings, throwing a HTTP 422 Unprocessable Entity error.
    email: EmailStr = Field(description="The primary email address")
    
    # We enforce a secure password length (at least 8 characters) on input.
    password: str = Field(min_length=8, max_length=128, description="User password (min 8 characters)")


# UserLogin defines the schema for credential verification during authentication requests.
class UserLogin(BaseModel):
    email: EmailStr = Field(description="User registered email")
    password: str = Field(description="User plain password")


# UserResponse defines the outgoing schema returned to the client.
# Excluding sensitive details (like 'password_hash') is a critical security best practice.
class UserResponse(BaseModel):
    user_id: int
    user_name: str
    email_id: EmailStr
    
    # ConfigDict allows Pydantic to read ORM objects directly.
    # By setting 'from_attributes=True', Pydantic can receive a SQLAlchemy 'User' instance (e.g. user.user_id) 
    # instead of just a raw dictionary, and automatically extract the fields to serialize them into JSON.
    model_config = ConfigDict(from_attributes=True)


# Token defines the JSON response structure for successful login actions.
class Token(BaseModel):
    # The JWT access token string
    access_token: str
    # The authorization type. Standard for JWT authentication is 'bearer'.
    token_type: str
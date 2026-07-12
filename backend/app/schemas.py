<<<<<<< HEAD
# Pydantic is a data validation and settings management library.
# It enforces type hints at runtime, validates incoming payloads, and formats outgoing responses.
# - BaseModel: The base class for defining structures and data contracts.
# - EmailStr: A specialized type that automatically validates if a string is a RFC 5322 compliant email address.
# - Field: Used to add metadata and validation rules (like min_length, max_length, pattern matching) to schema fields.
# - ConfigDict: A typing container used to configure Pydantic model behaviors.
from pydantic import BaseModel, EmailStr, Field, ConfigDict
=======
from pydantic import BaseModel, EmailStr, Field,ConfigDict
from typing import Optional

>>>>>>> upstream/main

# UserCreate defines the schema for incoming user registration requests.
# It enforces strict validation rules before our application processes the payload.
class UserCreate(BaseModel):
    # username:str
    print("reached user create in schema")
    email: EmailStr
    password:str=Field(min_length=6)
    # min_length=6,max_length=128


# UserLogin defines the schema for credential verification during authentication requests.
class UserLogin(BaseModel):
    email: EmailStr = Field(description="User registered email")
    password: str = Field(description="User plain password")


# UserResponse defines the outgoing schema returned to the client.
# Excluding sensitive details (like 'password_hash') is a critical security best practice.
class UserResponse(BaseModel):
    user_id:int
    username:str
    email:EmailStr
    model_config = ConfigDict(from_attributes=True)   #from attribute is to allow pydantic to read to user.user_id

class Token(BaseModel):
    # The JWT access token string
    access_token: str
<<<<<<< HEAD
    # The authorization type. Standard for JWT authentication is 'bearer'.
    token_type: str
=======
    token_type: str

class PageData(BaseModel):
    # user_id:int
    page_id:int
    title:str
    page_type:str
    page_data:str
    parent_page_id: Optional[int] = None
# ana bhi yhi chaiye jana bhi yi chahiye
class PageResponse(BaseModel):
    user_id:int
    page_id:int
    title:str
    page_type:str
    page_data:str
    parent_page_id: Optional[int] = None
>>>>>>> upstream/main

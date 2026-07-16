from pydantic import BaseModel, EmailStr, Field,ConfigDict
from typing import Optional

class UserCreate(BaseModel):
    print("reached user create in schema")
    email: EmailStr
    password:str=Field(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr = Field(description="User registered email")
    password: str = Field(description="User plain password")

class UserResponse(BaseModel):
    user_id:int
    username:str
    email:EmailStr
    model_config = ConfigDict(from_attributes=True)   #from attribute is to allow pydantic to read to user.user_id

class Token(BaseModel):
    access_token: str
    token_type: str

class PageData(BaseModel):
    page_id:int
    title:str
    page_type:str
    page_data:str
    parent_page_id: Optional[int] = None

class PageResponse(BaseModel):
    user_id:int
    page_id:int
    title:str
    page_type:str
    page_data:str
    parent_page_id: Optional[int] = None

class QueryRequest(BaseModel):
    query: str

class AskRequest(BaseModel):
    question: str
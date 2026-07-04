from pydantic import BaseModel, EmailStr, Field,ConfigDict


class UserCreate(BaseModel):
    # username:str
    email: EmailStr=Field(min_length=3,max_length=30)
    password:str=Field(min_length=8,max_length=128)

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    user_id:int
    username:str
    email:EmailStr
    model_config = ConfigDict(from_attributes=True)   #from attribute is to allow pydantic to read to user.user_id

class Token(BaseModel):
    access_token: str
    token_type: str
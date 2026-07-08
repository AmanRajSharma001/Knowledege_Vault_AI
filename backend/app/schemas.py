from pydantic import BaseModel, EmailStr, Field,ConfigDict


class UserCreate(BaseModel):
    # username:str
    print("reached user create in schema")
    email: EmailStr
    password:str=Field(min_length=6)
    # min_length=6,max_length=128

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

class PageData(BaseModel):
    user_id:int
    page_id:int
    title:str
    page_type:str
    page_data:str
    parent_page_id:int
# ana bhi yhi chaiye jana bhi yi chahiye
class PageResponse(BaseModel):
    user_id:int
    page_id:int
    title:str
    page_type:str
    page_data:str
    parent_page_id:int
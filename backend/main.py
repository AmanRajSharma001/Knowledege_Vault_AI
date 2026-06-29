from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Users, get_db
from sqlalchemy.orm import Session 
from pydantic import BaseModel
from typing import List
from app.test import printshello

class UserCreate(BaseModel):
    name: str
    privates: List[str]
    agents: List[str]

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/upload")
def upload():
    text=printshello()
    print("end point hit")
    return{"message":text}

@app.post("/users")
def crate_user(user:UserCreate,
               db:Session=Depends(get_db)):
    data=Users(
        name=user.name,
        privates=user.privates,
        agents=user.agents
    )
    db.add(data)
    db.commit()
    db.refresh(data)
    return data




# class Base(DeclarativeBase):
#     pass


# class Hero(Base):
#     __tablename__ = "heroes"

#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(50))
#     age: Mapped[int] = mapped_column()


# Base.metadata.create_all(engine)

# with Session(engine) as session:
#     hero = Hero(name="Thor", age=1500)

#     session.add(hero)
#     session.commit()

# with Session(engine) as session:
#     heroes = session.query(Hero).all()

#     for hero in heroes:
#         print(hero.id, hero.name, hero.age)


# with Session(engine) as session:
#     hero=Hero(name="ironman",age=45)
#     session.add(hero)
#     session.commit()

# with Session(engine) as session:
#     heroes=session.query(Hero).all()
#     for hero in heroes:
#         print(hero.id,hero.name,hero.age)

# SessionLocal = sessionmaker(bind=engine)

# from app.database import engine,base
# from sqlalchemy import String
# from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,Session,sessionmaker




















# from fastapi import FastAPI
# from app.test import printshello
# from fastapi.middleware.cors import CORSMiddleware
# app=FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# @app.get("/upload")
# def upload():
#     text=printshello()
#     print("end point hit")
#     return{"message":text}

# from fastapi import FastAPI,Response,status
# from fastapi.params import Body
# from pydantic import BaseModel
# from typing import Optional
# from random import randrange
# app=FastAPI()
# @app.get("/")
# class Post(BaseModel):
#     title:str
#     content:str
#     published:bool= True
#     rating :Optional[int]=None
# my_posts=[{"title":"title of post 1","content":"content of post 2","id":1},
#           {"title":"faviourte food","content":"i Like pizza","id":2}]

# def find_id(id):
#     for p in my_posts:
#         if p["id"]==id:
#             return p
        
# def find_index_post(id):
#     for i ,p in enumerate(my_posts):
#         if p['id']==id:
#             return i
        
# def root():
#     return{"message":"hello world"}

# @app.get("/posts")
# def get_posts():
#     return{"data":my_posts}

# @app.post("/createposts")
# def create_post(payLoad:dict=Body(...)):
#     print(payLoad)

#     return{"newpost":f"title{payLoad['content']} content :{payLoad['title']}"}
# work as a list

# @app.post("/posts")
# def create_post(post:Post):
#     post_dict=post.dict()
#     post_dict['id']=randrange(0,100000)
#     my_posts.append(post_dict)
#     return {"data":post_dict}

# @app.get("/posts/latest")
# def get_latest_post():
#     post=my_posts[len(my_posts)-1]
#     return{"detail":post}

# @app.get("/posts/{id}")
# def get_post(id:int,response:Response):
#     post=find_id(id)
#     if not post:
#         response.status_code=status.HTTP_404_NOT_FOUND
#         return {'message':f"post with id was not found"}
#     return{"post_detailj":post}

# @app.get('/posts')
# def get_post(id:int,response:Response):
#     post=find_id(id)
#     if not post:
#         raise HTTPException(status=status.HTTP_404_NOT_FOUND,detail=f"post with id:{id}was not found")
#     return {"post detail":post}

# @app.delete('/posts/{id}')
# def delete_post(id):
    #deleting post
    #find the index in the array that has required id
    #
    # index=find_index_post(id)
    # return {'message':"post succesfully deleted"}

from sqlalchemy import create_engine,text,ARRAY,String
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,Session,sessionmaker
from sqlalchemy import ForeignKey, String, DateTime
from app.core.config import (
    USERNAME,
    PASSWORD,
    HOST,
    PORT,
    DB_NAME,
)
print(f"USERNAME = {USERNAME}")
print(f"PASSWORD = {PASSWORD}")
print(f"HOST = {HOST}")
print(f"PORT = {PORT}")
print(f"DB_NAME = {DB_NAME}")
temperory_engine=create_engine(f"postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/postgres")

with temperory_engine.connect() as conn:
    conn.execution_options(isolation_level="AUTOCOMMIT")
    result=conn.execute(
        text(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'")
    )
    exists=result.scalar()
    # or options
    # row=results.fetchone()

    if not exists:
        conn.execute(text(f"CREATE DATABASE {DB_NAME}"))
        print(f"database '{DB_NAME}' created")
    else:
        print(f" database'{DB_NAME}' ALREADY EXISTS")
    
engine=create_engine(
    f"postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"
)
with engine.connect() as conn:
    print("connected to your database successfully")
    print("databse has been worked")

# base as a blueprint

class base(DeclarativeBase):
    pass
# base.metadata.create_all(engine)

Sessionlocal=sessionmaker(bind=engine,autoflush=False,autocommit=False)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
        
# class Login(base):
#     __tablename__="LoginData"
#     user_id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
#     user_name:Mapped[str]=mapped_column(nullable=True)
#     passwd:Mapped[str]=mapped_column(nullable=True)
#     email_id:Mapped[str]=mapped_column(nullable=True)
# class Private(base):
#     __tablename__="PrivateData"
#     user_id:Mapped[int]=mapped_column(ForeignKey("LoginData.user_id"))
#     workspace_id:Mapped[int]=mapped_column(default=1)
#     private_id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
#     private_title:Mapped[str]=mapped_column(default="New Page")
#     parent_page_id:Mapped[int|None]=mapped_column(ForeignKey("PrivateData.private_id"),nullable=True)
#     date_time:Mapped[DateTime]=mapped_column(default=DateTime.utcnow)
# class Agent(base):
#     __tablename__="AgentData"
#     user_id:Mapped[int]=mapped_column(ForeignKey("LoginData.user_id"))
#     workspace_id:Mapped[int]=mapped_column(default=1)
#     agent_id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
#     agent_title:Mapped[str]=mapped_column(default="New Page")
#     parent_page_id:Mapped[int|None]=mapped_column(ForeignKey("PrivateData.private_id"),nullable=True)
#     date_time:Mapped[DateTime]=mapped_column(default=DateTime.utcnow)

# #this is the pruposed one solution by gpt that we should create 1 table and differentiate them by page type

# class Page(base):
#     __tablename__ = "PageData"
#     page_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("LoginData.user_id"),nullable=False)
#     workspace_id: Mapped[int] = mapped_column(default=1)
#     title: Mapped[str] = mapped_column(default="New Page")
#     # "private" or "agent"
#     page_type: Mapped[str] = mapped_column(nullable=False)
#     # NULL = top-level page
#     parent_page_id: Mapped[int | None] = mapped_column(ForeignKey("PageData.page_id"),nullable=True)
#     created_at: Mapped[DateTime] = mapped_column(DateTime,default=DateTime.utcnow)

# # this below table will be deleted and a fresh databasename will be created 
# class Users(base):
#     __tablename__="UserData"
#     name:Mapped[str]=mapped_column(primary_key=True)
#     privates:Mapped[list[str]]=mapped_column(ARRAY(String), nullable=True)
#     agents:Mapped[list[str]]=mapped_column(ARRAY(String), nullable=True)
# # table created with columns
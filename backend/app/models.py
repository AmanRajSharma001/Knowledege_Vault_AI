# datetime is Python's built-in module for working with date and time values.
from datetime import datetime
# We import the classes needed to define our schema relationships and column types.
# - Mapped: A generic type hint indicating that the attribute is managed by SQLAlchemy.
# - mapped_column: The SQLAlchemy 2.0 helper used to define database column constraints and types.
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, String
from app.database import base
from datetime import datetime
from sqlalchemy import DateTime


class User(base):
    print("reached user in models ")
    __tablename__="users"
    user_id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    username:Mapped[str]=mapped_column(String,nullable=False)
    password_hash:Mapped[str]=mapped_column(nullable=False)
    email:Mapped[str]=mapped_column(String,nullable=False,unique=True,index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active:Mapped[bool]=mapped_column(default=True)
class PrivatePage(base):
    __tablename__="PrivateData"
    user_id:Mapped[int]=mapped_column(ForeignKey("users.user_id"))
    workspace_id:Mapped[int]=mapped_column(default=1)
    private_id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    private_title:Mapped[str]=mapped_column(default="New Page")
    parent_page_id:Mapped[int|None]=mapped_column(ForeignKey("PrivateData.private_id"),nullable=True)
    date_time:Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)
class Agent(base):
    __tablename__="AgentData"
    user_id:Mapped[int]=mapped_column(ForeignKey("users.user_id"))
    workspace_id:Mapped[int]=mapped_column(default=1)
    agent_id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    agent_title:Mapped[str]=mapped_column(default="New Page")
    parent_page_id:Mapped[int|None]=mapped_column(ForeignKey("AgentData.agent_id"),nullable=True)
    date_time:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)

#this is the pruposed one solution by gpt that we should create 1 table and differentiate them by page type

class Page(base):
    __tablename__ = "PageData"
<<<<<<< HEAD

    page_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
=======
>>>>>>> upstream/main
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"),nullable=False)
    page_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(default="New Page")
    page_type: Mapped[str] = mapped_column(nullable=False)
    page_data:Mapped[str]=mapped_column()
    workspace_id: Mapped[int] = mapped_column(default=1)
    # NULL = top-level page
    parent_page_id: Mapped[int | None] = mapped_column(ForeignKey("PageData.page_id"),nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime,default=datetime.utcnow)
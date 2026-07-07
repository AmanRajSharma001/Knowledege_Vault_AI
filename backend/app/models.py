# datetime is Python's built-in module for working with date and time values.
from datetime import datetime
# We import the classes needed to define our schema relationships and column types.
# - Mapped: A generic type hint indicating that the attribute is managed by SQLAlchemy.
# - mapped_column: The SQLAlchemy 2.0 helper used to define database column constraints and types.
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, String

# We import the declarative Base from our database module to register these classes.
from app.database import Base

class User(Base):
    """
    SQLAlchemy model representing the 'users' table in the database.
    This holds the master account records of registered users.
    """
    __tablename__ = "users"

    # user_id is the primary key (surrogate key) for identifying a user uniquely.
    # autoincrement=True instructs PostgreSQL to auto-generate sequential integers (using SERIAL/IDENTITY sequence).
    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # user_name is the user's display name.
    # String specifies the SQL type VARCHAR. 
    # CRITICAL FIX: The positional argument (String) must be placed before keyword arguments (nullable=False) to avoid Python syntax errors.
    user_name: Mapped[str] = mapped_column(String, nullable=False)

    # password_hash stores the securely salted bcrypt representation of the user's password.
    # We NEVER store plain text passwords in the database to prevent compromises during data leaks.
    password_hash: Mapped[str] = mapped_column(String, nullable=False)

    # email_id is the user's primary contact.
    # - unique=True: Ensures two accounts cannot share the same email.
    # - index=True: Instructs PostgreSQL to build a B-Tree index on this column, speeding up queries like 'filter(User.email_id == email)' during login.
    email_id: Mapped[str] = mapped_column(String, nullable=False, unique=True, index=True)

    # created_at logs the exact timestamp when the user registered.
    # CRITICAL: We pass the function name (datetime.utcnow) WITHOUT parentheses as the default callable.
    # If we wrote 'default=datetime.utcnow()', the function would execute ONCE at application boot, 
    # causing every user created thereafter to share the exact same registration timestamp!
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # is_active allows administrators to temporarily disable accounts without deleting their data from the database.
    is_active: Mapped[bool] = mapped_column(default=True)


class Page(Base):
    """
    SQLAlchemy model representing the 'PageData' table in the database.
    Stores user-created documents, separating them by page types (private or agent).
    """
    __tablename__ = "PageData"

    page_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # user_id connects this page to the user who created it.
    # ForeignKey("users.user_id") establishes a referential integrity constraint. 
    # If the user is deleted, this helps enforce data cascading or restriction policies.
    # FIX: Pointed ForeignKey to the correct 'users.user_id' table and column (previously referred to non-existent 'LoginData.user_id').
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)

    workspace_id: Mapped[int] = mapped_column(default=1)

    title: Mapped[str] = mapped_column(String, default="New Page")

    # page_type differentiates between a private workspace page and an AI agent page (e.g. "private" or "agent").
    page_type: Mapped[str] = mapped_column(String, nullable=False)

    # parent_page_id allows nested page hierarchies (folders and sub-pages).
    # It references 'PageData.page_id' (its own table), which is a self-referencing relationship (recursive model).
    # - nullable=True: Top-level pages do not have a parent, so they store NULL.
    # FIX: Pointed ForeignKey to the correct 'PageData.page_id' column.
    parent_page_id: Mapped[int | None] = mapped_column(ForeignKey("PageData.page_id"), nullable=True)

    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class Agent(Base):
    """
    SQLAlchemy model representing the 'AgentData' table in the database.
    Represents custom AI agents created by users, linked to their workspaces.
    """
    __tablename__ = "AgentData"

    agent_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # FIX: Pointed ForeignKey to the correct 'users.user_id' table.
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)

    workspace_id: Mapped[int] = mapped_column(default=1)

    agent_title: Mapped[str] = mapped_column(String, default="New Page")

    # parent_page_id associates this agent with a document page in the parent hierarchy.
    # FIX: Pointed ForeignKey to the correct 'PageData.page_id' table.
    parent_page_id: Mapped[int | None] = mapped_column(ForeignKey("PageData.page_id"), nullable=True)

    date_time: Mapped[datetime] = mapped_column(default=datetime.utcnow)
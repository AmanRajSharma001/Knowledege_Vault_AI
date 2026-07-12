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

# sessionmaker binds the engine to a session class factory. 
# - autoflush=False: Prevents SQLAlchemy from auto-sending queries to the database before we explicitly commit or flush, saving network trips.
# - autocommit=False: Disables auto-commit mode to ensure we explicitly control database transactions via 'db.commit()'.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# This function acts as a database session lifecycle generator.
# We inject this function into our FastAPI route handlers using Depends(get_db).
# - It opens a clean database session (db = SessionLocal()) when a request arrives.
# - 'yield db' passes control back to the endpoint so the route can execute its query.
# - The 'finally:' block runs AFTER the request completes, guaranteeing the database connection is closed safely (db.close()),
#   preventing database connection leaks in production.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
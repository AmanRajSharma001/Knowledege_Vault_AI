# SQLAlchemy is the Object-Relational Mapper (ORM) library we use to translate Python classes into SQL tables and queries.
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# We import database parameters from our configuration module.
# The 'app.core.config' absolute package structure assumes uvicorn runs from the 'backend' folder.
from app.core.config import USERNAME, PASSWORD, HOST, PORT, DB_NAME

# PROBLEM: Executing database creation commands directly at the module root causes side-effects during import.
# SOLUTION: We wrap this logic in a function called by our FastAPI startup lifespan, ensuring import-safety.
def create_database_if_not_exists():
    """
    Connects to the default 'postgres' database administrative channel and checks if the targeted DB_NAME exists.
    If not, it executes 'CREATE DATABASE' to initialize it automatically.
    """
    # Create a temporary engine connected to the default administrative 'postgres' database
    # The 'psycopg2' library is the PostgreSQL database driver that handles low-level socket connections and protocol communication.
    temp_engine = create_engine(
        f"postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/postgres",
        # AUTOCOMMIT isolation level is required because PostgreSQL does not allow running 'CREATE DATABASE' statements inside an active transaction block.
        isolation_level="AUTOCOMMIT"
    )
    
    with temp_engine.connect() as conn:
        # text() converts a raw string query into a SQLAlchemy Executable object, preventing arbitrary string execution pitfalls.
        # We query the pg_database administrative catalog to check if the target database exists.
        result = conn.execute(
            text(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
        )
        exists = result.scalar() # returns the first column of the first row (1) if it exists, or None.

        if not exists:
            conn.execute(text(f"CREATE DATABASE {DB_NAME}"))
            print(f"Database '{DB_NAME}' created successfully.")
        else:
            print(f"Database '{DB_NAME}' already exists.")

# We create the primary SQLAlchemy engine instance. The engine represents the core database socket pool manager.
# It acts as the pipeline that sends SQL statements to the database and receives the results.
engine = create_engine(
    f"postgresql+psycopg2://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"
)

# DeclarativeBase is the foundations class for defining our SQLAlchemy ORM models.
# By inheriting from Base, our Python classes are registered with a schema mapping catalog, enabling table metadata generation.
class Base(DeclarativeBase):
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
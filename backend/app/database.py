from sqlalchemy import create_engine,text
from sqlalchemy import sessionmaker

USERNAME="postgres"
PASSWORD= "1234"
HOST="localhost"
PORT="5432"
DB_NAME="heros_db"
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

sessionlocal=sessionmaker(bind=engine,Auto)
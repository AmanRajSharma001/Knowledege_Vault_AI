from sqlalchemy import create_engine,text,ARRAY,String
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,Session,sessionmaker



USERNAME="postgres"
PASSWORD= "DeezBoi#ROK"
HOST="localhost"
PORT="5432"
DB_NAME="finaldb"
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

# base as a blueprint

class base(DeclarativeBase):
    pass

class Users(base):
    __tablename__="UserData"
    name:Mapped[str]=mapped_column(primary_key=True)
    privates:Mapped[list[str]]=mapped_column(ARRAY(String), nullable=True)
    agents:Mapped[list[str]]=mapped_column(ARRAY(String), nullable=True)
# table created with columns
base.metadata.create_all(engine)

Sessionlocal=sessionmaker(bind=engine,autoflush=False,autocommit=False)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
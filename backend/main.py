from fastapi import FastAPI
from app.database import engine
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,Session,sessionmaker


class base(DeclarativeBase):
    pass

class Hero(base):
    __tablename__="heroes"
    id:Mapped[int]=mapped_column(primary_key=True)
    name:Mapped[str]=mapped_column()
    age:Mapped[int]=mapped_column()

base.metadata.create_all(engine)

with Session(engine) as session:
    hero=Hero(name="ironman",age=45)
    session.add(hero)
    session.commit()

with Session(engine) as session:
    heroes=session.query(Hero).all()
    for hero in heroes:
        print(hero.id,hero.name,hero.age)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
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
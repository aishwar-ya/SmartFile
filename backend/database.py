from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# SQLite will automatically create a database file named smartfile.db inside your backend folder.
DATABASE_URL = "sqlite:///./smartfile.db"                                  


# Create the database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)


# Create database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Base class for database models
Base = declarative_base()
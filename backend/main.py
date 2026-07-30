from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

# Database
from app.database import engine, Base

# Import models so SQLAlchemy knows about them
from app import models

# Routers
from app.routers.youtube_router import router as youtube_router

app = FastAPI(
    title="PoliVerse AI",
    version="1.0.0"
)

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(youtube_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to PoliVerse AI Backend",
        "version": "1.0.0"
    }


@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT current_database();"))
            db_name = result.scalar()

        return {
            "status": "Connected Successfully",
            "database": db_name
        }

    except Exception as e:
        return {
            "status": "Connection Failed",
            "error": str(e)
        }
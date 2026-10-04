from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base
from app import models

from app.routers.youtube_router import router as youtube_router
from app.routers.sentiment_router import router as sentiment_router
from app.routers.dataset_router import router as dataset_router


# -----------------------------------------
# CREATE DATABASE TABLES
# -----------------------------------------

Base.metadata.create_all(bind=engine)


# -----------------------------------------
# FASTAPI APPLICATION
# -----------------------------------------

app = FastAPI(
    title="PoliVerse AI",
    version="1.0.0"
)


# -----------------------------------------
# CORS CONFIGURATION
# -----------------------------------------

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


# -----------------------------------------
# REGISTER ROUTERS
# -----------------------------------------

app.include_router(youtube_router)
app.include_router(sentiment_router)
app.include_router(dataset_router)


# -----------------------------------------
# HOME
# -----------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to PoliVerse AI Backend",
        "version": "1.0.0"
    }


# -----------------------------------------
# SYSTEM STATUS
# -----------------------------------------

@app.get("/status")
def status():
    return {
        "project": "PoliVerse AI",
        "status": "Running",
        "version": "1.0.0"
    }


# -----------------------------------------
# DATABASE TEST
# -----------------------------------------

@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT current_database();")
            )

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
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db, SessionLocal
from app.core.logger import logger
from app.services.ingestion_service import ingest_transcripts_from_file

from app.api import health, sessions, chat, skills, artifacts, ingest, providers

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Database...")
    init_db()

    # Seed transcripts if empty
    db = SessionLocal()
    try:
        transcript_file = os.path.join(os.path.dirname(__file__), "..", "data", "transcripts", "lenny_podcasts.json")
        count = ingest_transcripts_from_file(db, transcript_file)
        logger.info(f"Startup complete. Total indexed transcript chunks: {count}")
    except Exception as e:
        logger.error(f"Error during startup transcript seeding: {e}")
    finally:
        db.close()

    yield
    logger.info("Shutting down Lenny Growth Assistant backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack AI-powered conversational growth and product assistant grounded in Lenny's Podcast transcripts.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(sessions.router)
app.include_router(chat.router)
app.include_router(skills.router)
app.include_router(artifacts.router)
app.include_router(ingest.router)
app.include_router(providers.router)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on path {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please check backend logs or try again."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

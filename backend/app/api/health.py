from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schema import TranscriptChunk
from app.schemas.pydantic_models import HealthCheckResponse
from app.services.llm_service import llm_service

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
@router.get("/api/health", response_model=HealthCheckResponse)
async def get_health_status(db: Session = Depends(get_db)):
    # 1. DB Health
    db_status = "healthy"
    indexed_count = 0
    try:
        indexed_count = db.query(TranscriptChunk).count()
    except Exception:
        db_status = "unhealthy"

    # 2. Ollama Health
    ollama_status = await llm_service.check_ollama_status()
    anthropic_status = llm_service.check_anthropic_status()
    openai_status = llm_service.check_openai_status()

    overall = "healthy" if db_status == "healthy" else "degraded"

    return HealthCheckResponse(
        status=overall,
        fastapi="healthy",
        database=db_status,
        ollama=ollama_status,
        anthropic=anthropic_status,
        openai=openai_status,
        indexed_chunks=indexed_count
    )

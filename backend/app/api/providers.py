from fastapi import APIRouter
from typing import List
from app.schemas.pydantic_models import ProviderStatus
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/providers", tags=["Providers"])

@router.get("", response_model=List[ProviderStatus])
async def list_providers():
    ollama_status = await llm_service.check_ollama_status()
    anthropic_status = llm_service.check_anthropic_status()
    openai_status = llm_service.check_openai_status()
    return [ollama_status, anthropic_status, openai_status]

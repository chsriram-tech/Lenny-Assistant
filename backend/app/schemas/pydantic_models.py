from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

# Source Citation Schema
class SourceCitation(BaseModel):
    chunk_id: str
    episode_title: str
    guest: str
    source_url: Optional[str] = None
    excerpt: str
    relevance_score: float = 0.0

# Session Schemas
class SessionCreate(BaseModel):
    title: Optional[str] = "New Product Session"
    provider: Optional[str] = "ollama"
    model: Optional[str] = "llama3"

class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    provider: str
    model: str
    created_at: datetime
    updated_at: datetime

# Message Schemas
class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    conversation_id: str
    role: str
    content: str
    sources: Optional[List[SourceCitation]] = []
    artifact_id: Optional[str] = None
    created_at: datetime

class SessionDetailResponse(SessionResponse):
    messages: List[MessageResponse] = []

# Chat Request Schema
class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str = Field(..., min_length=1, description="User question or prompt")
    provider: Optional[str] = None
    model: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    message: MessageResponse

# Artifact Schemas
class ArtifactCreateRequest(BaseModel):
    conversation_id: str
    prompt: Optional[str] = None
    artifact_type: str = Field(..., description="'markdown' or 'html'")
    title: Optional[str] = "Generated Strategy Artifact"

class ArtifactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    conversation_id: str
    title: str
    artifact_type: str
    content: str
    description: Optional[str] = None
    created_at: datetime

# Ship 30 for 30 Skill Request Schema
class Ship30Request(BaseModel):
    conversation_id: str
    topic: Optional[str] = None

# Health & Provider Status Schemas
class ProviderStatus(BaseModel):
    name: str
    display_name: str
    available: bool
    current_model: str
    supported_models: List[str]
    error_message: Optional[str] = None

class HealthCheckResponse(BaseModel):
    status: str
    fastapi: str = "healthy"
    database: str = "healthy"
    ollama: ProviderStatus
    anthropic: ProviderStatus
    openai: ProviderStatus
    indexed_chunks: int = 0

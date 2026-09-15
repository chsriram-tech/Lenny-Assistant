from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schema import Conversation, Message, Artifact
from app.schemas.pydantic_models import Ship30Request, MessageResponse, SourceCitation
from app.services.rag_service import search_transcripts
from app.services.ship30_service import generate_ship30_essay
from app.core.logger import logger

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.post("/ship30", response_model=MessageResponse)
async def trigger_ship30_skill(request: Ship30Request, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == request.conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get last message to infer topic
    last_msg = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at.desc()).first()
    topic = request.topic or (last_msg.content if last_msg else "Product Growth & Retention Strategy")

    # Perform RAG retrieval for grounding
    context_chunks = search_transcripts(db, topic, top_k=4)

    # Generate Ship 30 essay
    essay_content = await generate_ship30_essay(
        topic=topic,
        context_chunks=context_chunks,
        provider=conv.provider,
        model=conv.model
    )

    # Save as Artifact
    artifact = Artifact(
        conversation_id=conv.id,
        title=f"Ship 30 Essay: {topic[:30]}...",
        artifact_type="markdown",
        content=essay_content,
        description="Ship 30 for 30 Grounded Product Essay (~1,250 words)"
    )
    db.add(artifact)
    db.commit()
    db.refresh(artifact)

    # Save as Assistant Message
    sources_citations = [
        SourceCitation(
            chunk_id=c["chunk_id"],
            episode_title=c["episode_title"],
            guest=c["guest"],
            source_url=c["source_url"],
            excerpt=c["excerpt"],
            relevance_score=c["relevance_score"]
        ) for c in context_chunks
    ]

    msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=f"🚀 **Generated Ship 30 for 30 Essay (~1,250 words)**\n\n{essay_content}",
        sources=[s.model_dump() for s in sources_citations],
        artifact_id=artifact.id
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return MessageResponse(
        id=msg.id,
        conversation_id=msg.conversation_id,
        role=msg.role,
        content=msg.content,
        sources=sources_citations,
        artifact_id=msg.artifact_id,
        created_at=msg.created_at
    )

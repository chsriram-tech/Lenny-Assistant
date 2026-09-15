from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schema import Conversation, Message, Artifact
from app.schemas.pydantic_models import ArtifactCreateRequest, ArtifactResponse
from app.services.rag_service import search_transcripts
from app.services.artifact_service import generate_artifact_content
from app.core.logger import logger

router = APIRouter(prefix="/api/artifacts", tags=["Artifacts"])

@router.post("", response_model=ArtifactResponse)
async def create_artifact(request: ArtifactCreateRequest, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == request.conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get recent messages to extract prompt context
    recent_msgs = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at.desc()).limit(3).all()
    context_text = "\n".join([f"{m.role}: {m.content}" for m in reversed(recent_msgs)])

    prompt = request.prompt or (recent_msgs[0].content if recent_msgs else "Product Strategy Matrix")

    # Retrieve context chunks
    chunks = search_transcripts(db, prompt, top_k=3)
    chunk_context = "\n".join([f"- Guest {c['guest']} ({c['episode_title']}): {c['excerpt']}" for c in chunks])

    full_context = f"Chat Context:\n{context_text}\n\nTranscript Grounding:\n{chunk_context}"

    artifact_data = await generate_artifact_content(
        prompt=prompt,
        artifact_type=request.artifact_type,
        context_str=full_context,
        provider=conv.provider,
        model=conv.model
    )

    artifact = Artifact(
        conversation_id=conv.id,
        title=request.title or artifact_data["title"],
        artifact_type=artifact_data["artifact_type"],
        content=artifact_data["content"],
        description=artifact_data["description"]
    )
    db.add(artifact)
    db.commit()
    db.refresh(artifact)

    # Attach artifact to a new assistant message in the conversation so UI displays artifact pill
    msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=f"📄 **Generated Artifact**: *{artifact.title}*\n\nYou can view and preview this artifact side-by-side in the Artifact Viewer.",
        artifact_id=artifact.id
    )
    db.add(msg)
    db.commit()

    return artifact

@router.get("/{artifact_id}", response_model=ArtifactResponse)
def get_artifact(artifact_id: str, db: Session = Depends(get_db)):
    art = db.query(Artifact).filter(Artifact.id == artifact_id).first()
    if not art:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return art

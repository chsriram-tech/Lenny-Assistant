from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.schema import Conversation, Message
from app.schemas.pydantic_models import SessionCreate, SessionResponse, SessionDetailResponse

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(session_data: SessionCreate, db: Session = Depends(get_db)):
    conv = Conversation(
        title=session_data.title or "New Product Session",
        provider=session_data.provider or "ollama",
        model=session_data.model or "llama3"
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.get("", response_model=List[SessionResponse])
def list_sessions(db: Session = Depends(get_db)):
    return db.query(Conversation).order_by(Conversation.updated_at.desc()).all()

@router.get("/{session_id}", response_model=SessionDetailResponse)
def get_session_detail(session_id: str, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == session_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Session not found")
    return conv

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: str, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == session_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(conv)
    db.commit()
    return None

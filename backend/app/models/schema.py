import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False, default="New Conversation")
    provider = Column(String, nullable=False, default="ollama")
    model = Column(String, nullable=False, default="llama3")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")
    artifacts = relationship("Artifact", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False)  # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    sources = Column(JSON, nullable=True)  # List of transcript chunk metadata dicts
    artifact_id = Column(String, ForeignKey("artifacts.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    artifact = relationship("Artifact", foreign_keys=[artifact_id])


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    artifact_type = Column(String, nullable=False)  # 'markdown' or 'html'
    content = Column(Text, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="artifacts")


class TranscriptChunk(Base):
    __tablename__ = "transcript_chunks"

    id = Column(String, primary_key=True, default=generate_uuid)
    episode_title = Column(String, nullable=False)
    guest = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    topic = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, default=0)
    embedding = Column(JSON, nullable=True)  # Array of floats stored as JSON for universal SQL compat
    created_at = Column(DateTime, default=datetime.utcnow)

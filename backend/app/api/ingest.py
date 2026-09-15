import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schema import TranscriptChunk
from app.services.ingestion_service import ingest_transcripts_from_file

router = APIRouter(prefix="/api/ingest", tags=["Ingest"])

TRANSCRIPT_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "transcripts", "lenny_podcasts.json")

@router.post("")
def trigger_ingestion(db: Session = Depends(get_db)):
    count = ingest_transcripts_from_file(db, TRANSCRIPT_FILE)
    return {"message": "Ingestion completed", "indexed_chunks": count}

@router.get("/status")
def get_ingestion_status(db: Session = Depends(get_db)):
    total = db.query(TranscriptChunk).count()
    return {"status": "ready" if total > 0 else "empty", "indexed_chunks": total}

import os
import json
from sqlalchemy.orm import Session
from app.models.schema import TranscriptChunk
from app.core.logger import logger

def ingest_transcripts_from_file(db: Session, file_path: str) -> int:
    if not os.path.exists(file_path):
        logger.warning(f"Transcript file not found at {file_path}")
        return 0

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            episodes = json.load(f)

        existing_count = db.query(TranscriptChunk).count()
        if existing_count > 0:
            logger.info(f"Database already contains {existing_count} transcript chunks. Skipping re-ingestion.")
            return existing_count

        total_inserted = 0
        for ep in episodes:
            episode_title = ep.get("episode_title", "Unknown Episode")
            guest = ep.get("guest", "Unknown Guest")
            topic = ep.get("topic", "Product & Growth")
            source_url = ep.get("source_url", "")

            for chunk_data in ep.get("chunks", []):
                chunk = TranscriptChunk(
                    episode_title=episode_title,
                    guest=guest,
                    topic=topic,
                    source_url=source_url,
                    chunk_index=chunk_data.get("chunk_index", 0),
                    content=chunk_data.get("content", "").strip()
                )
                db.add(chunk)
                total_inserted += 1

        db.commit()
        logger.info(f"Successfully ingested {total_inserted} transcript chunks into database.")
        return total_inserted
    except Exception as e:
        db.rollback()
        logger.error(f"Error during transcript ingestion: {e}")
        raise e

import re
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.schema import TranscriptChunk
from app.core.logger import logger

GUEST_MAPPINGS = {
    "cagan": "Marty Cagan",
    "marty": "Marty Cagan",
    "feature factory": "Marty Cagan",
    "empowered": "Marty Cagan",
    "chesky": "Brian Chesky",
    "brian": "Brian Chesky",
    "airbnb": "Brian Chesky",
    "verna": "Elena Verna",
    "elena": "Elena Verna",
    "plg": "Elena Verna",
    "biddle": "Gibson Biddle",
    "gibson": "Gibson Biddle",
    "dhm": "Gibson Biddle",
    "netflix": "Gibson Biddle",
    "doshi": "Shreyas Doshi",
    "shreyas": "Shreyas Doshi",
    "lno": "Shreyas Doshi",
    "vohra": "Rahul Vohra",
    "rahul": "Rahul Vohra",
    "superhuman": "Rahul Vohra",
    "pmf": "Rahul Vohra",
    "winters": "Casey Winters",
    "casey": "Casey Winters",
    "vo": "Claire Vo",
    "claire": "Claire Vo"
}

def search_transcripts(db: Session, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
    chunks = db.query(TranscriptChunk).all()
    if not chunks:
        logger.warning("No transcript chunks found in database.")
        return []

    q_lower = query.lower()

    # 1. Identify if query targets a specific guest or framework
    target_guest = None
    for kw, guest_name in GUEST_MAPPINGS.items():
        if kw in q_lower:
            target_guest = guest_name
            break

    # 2. Filter & score chunks
    scored_chunks = []
    query_terms = set(re.findall(r'\w+', q_lower))

    for chunk in chunks:
        # If target guest identified, prioritize or strictly require matching guest
        is_guest_match = target_guest and (target_guest.lower() in chunk.guest.lower())
        
        text_content = f"{chunk.episode_title} {chunk.guest} {chunk.topic} {chunk.content}".lower()

        score = 0.0
        matches = 0
        for term in query_terms:
            if len(term) <= 2:
                continue
            if term in text_content:
                matches += 1
                score += text_content.count(term)

        if is_guest_match:
            score += 50.0  # Huge boost for exact target guest

        if score > 0:
            relevance = round(min(1.0, 0.5 + (score / 60.0)), 2)
            scored_chunks.append({
                "chunk_id": chunk.id,
                "episode_title": chunk.episode_title,
                "guest": chunk.guest,
                "source_url": chunk.source_url or "https://www.lennysnewsletter.com/podcast",
                "topic": chunk.topic,
                "excerpt": chunk.content,
                "relevance_score": relevance,
                "is_guest_match": is_guest_match
            })

    # Sort by relevance score descending
    scored_chunks.sort(key=lambda x: x["relevance_score"], reverse=True)

    # 3. If target guest was requested, filter ONLY to chunks of that target guest if available
    if target_guest:
        guest_specific_chunks = [c for c in scored_chunks if c.get("is_guest_match")]
        if guest_specific_chunks:
            return guest_specific_chunks[:top_k]

    # Otherwise return top K unique guest chunks for general queries
    unique_chunks = []
    seen_guests = set()
    for c in scored_chunks:
        if c["guest"] not in seen_guests or len(unique_chunks) < 2:
            unique_chunks.append(c)
            seen_guests.add(c["guest"])

    if not unique_chunks and chunks:
        for chunk in chunks[:top_k]:
            unique_chunks.append({
                "chunk_id": chunk.id,
                "episode_title": chunk.episode_title,
                "guest": chunk.guest,
                "source_url": chunk.source_url or "https://www.lennysnewsletter.com/podcast",
                "topic": chunk.topic,
                "excerpt": chunk.content,
                "relevance_score": 0.5
            })

    return unique_chunks[:top_k]

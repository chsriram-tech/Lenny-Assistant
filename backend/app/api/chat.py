from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schema import Conversation, Message
from app.schemas.pydantic_models import ChatRequest, ChatResponse, MessageResponse, SourceCitation
from app.services.rag_service import search_transcripts
from app.services.llm_service import llm_service
from app.core.logger import logger

router = APIRouter(prefix="/api/chat", tags=["Chat"])

SYSTEM_PROMPT = """
You are "The Lenny Growth Assistant", a specialized AI assistant designed to answer product management and growth strategy questions for PMs, growth leaders, and founders.

Knowledge Source Constraints:
1. You MUST ground your answers in Lenny's Podcast / Newsletter transcript material provided in the context below.
2. Clearly reference guests and episode insights (e.g., Brian Chesky on design-led PMs, Marty Cagan on empowered product discovery, Elena Verna on PLG retention loops, Gibson Biddle on Netflix DHMs, Shreyas Doshi on the LNO framework, Rahul Vohra on the PMF engine).
3. Do NOT act as a generic chatbot. If the available transcript context does not contain enough information to answer a question reliably, explicitly state: "The current transcript knowledge base does not contain sufficient material to answer this specific query with full confidence."
4. Do NOT fabricate citations or fake source URLs.
5. Provide structured, crisp, highly readable markdown answers with bold headings, bullet points, and actionable takeaways.
"""

@router.post("", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest, db: Session = Depends(get_db)):
    logger.info(f"Received chat message: '{request.message}'")

    # 1. Get or Create Session
    session_id = request.conversation_id
    conv = None
    if session_id:
        conv = db.query(Conversation).filter(Conversation.id == session_id).first()
    
    if not conv:
        # Create session if not provided or missing
        conv = Conversation(
            title=request.message[:40] if request.message else "Product Session",
            provider=request.provider or "ollama",
            model=request.model or "llama3"
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # 2. Store User Message
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # 3. Retrieve Relevant Transcript Chunks (RAG)
    retrieved_chunks = search_transcripts(db, request.message, top_k=4)

    # Format transcript context
    context_text = ""
    sources_citations = []
    if retrieved_chunks:
        context_text = "\n\nRELEVANT TRANSCRIPT CONTEXT:\n"
        for idx, chunk in enumerate(retrieved_chunks, 1):
            context_text += (
                f"\n[TRANSCRIPT SOURCE {idx}]:\n"
                f"Guest: {chunk['guest']} | Episode: {chunk['episode_title']}\n"
                f"Excerpt: {chunk['excerpt']}\n"
            )
            sources_citations.append(SourceCitation(
                chunk_id=chunk["chunk_id"],
                episode_title=chunk["episode_title"],
                guest=chunk["guest"],
                source_url=chunk["source_url"],
                excerpt=chunk["excerpt"],
                relevance_score=chunk["relevance_score"]
            ))

    # 4. Gather Conversation History for Follow-up Context
    history_msgs = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at.asc()).all()
    history_payload = []
    for h in history_msgs[:-1]:  # exclude the user message just added
        history_payload.append({"role": h.role, "content": h.content})

    # 5. Build Final Prompt & Invoke LLM
    full_user_prompt = f"{request.message}\n{context_text}"
    
    provider_to_use = request.provider or conv.provider
    model_to_use = request.model or conv.model

    llm_answer = await llm_service.generate_completion(
        prompt=full_user_prompt,
        system_prompt=SYSTEM_PROMPT,
        provider=provider_to_use,
        model=model_to_use,
        conversation_history=history_payload
    )

    # 6. Store Assistant Response
    assistant_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=llm_answer,
        sources=[s.model_dump() for s in sources_citations]
    )
    db.add(assistant_msg)
    
    # Update conversation title if it was first message
    if len(history_msgs) <= 1:
        conv.title = request.message[:35].strip().title() + ("..." if len(request.message) > 35 else "")

    db.commit()
    db.refresh(assistant_msg)

    return ChatResponse(
        conversation_id=conv.id,
        message=MessageResponse(
            id=assistant_msg.id,
            conversation_id=assistant_msg.conversation_id,
            role=assistant_msg.role,
            content=assistant_msg.content,
            sources=sources_citations,
            artifact_id=assistant_msg.artifact_id,
            created_at=assistant_msg.created_at
        )
    )

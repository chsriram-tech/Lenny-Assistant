import pytest
import os
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import init_db, SessionLocal
from app.services.ingestion_service import ingest_transcripts_from_file

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()
    db = SessionLocal()
    try:
        transcript_file = os.path.join(os.path.dirname(__file__), "..", "data", "transcripts", "lenny_podcasts.json")
        ingest_transcripts_from_file(db, transcript_file)
    finally:
        db.close()

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "ollama" in data
    assert "anthropic" in data
    assert "openai" in data

def test_session_lifecycle():
    # 1. Create session
    res = client.post("/api/sessions", json={"title": "Test Product Session", "provider": "ollama"})
    assert res.status_code == 201
    session = res.json()
    session_id = session["id"]
    assert session["title"] == "Test Product Session"

    # 2. List sessions
    res_list = client.get("/api/sessions")
    assert res_list.status_code == 200
    assert any(s["id"] == session_id for s in res_list.json())

    # 3. Get detail
    res_detail = client.get(f"/api/sessions/{session_id}")
    assert res_detail.status_code == 200
    assert res_detail.json()["id"] == session_id

    # 4. Delete session
    res_del = client.delete(f"/api/sessions/{session_id}")
    assert res_del.status_code == 204

def test_chat_grounded_response():
    # Send product retention query
    res = client.post("/api/chat", json={
        "message": "How can I improve user retention and activation according to Lenny's podcast?",
        "provider": "ollama"
    })
    assert res.status_code == 200
    data = res.json()
    assert "conversation_id" in data
    msg = data["message"]
    assert msg["role"] == "assistant"
    assert len(msg["sources"]) > 0  # Grounded transcript sources present
    assert "guest" in msg["sources"][0]

def test_ship30_skill():
    # Create session first
    res_sess = client.post("/api/sessions", json={"title": "Ship 30 Test Session"})
    session_id = res_sess.json()["id"]

    res_skill = client.post("/api/skills/ship30", json={
        "conversation_id": session_id,
        "topic": "Building Empowered Product Discovery Teams"
    })
    assert res_skill.status_code == 200
    data = res_skill.json()
    assert "Ship 30" in data["content"]
    assert data["artifact_id"] is not None

def test_artifact_generation():
    # Create session
    res_sess = client.post("/api/sessions", json={"title": "Artifact Test Session"})
    session_id = res_sess.json()["id"]

    res_art = client.post("/api/artifacts", json={
        "conversation_id": session_id,
        "prompt": "Create a modern product strategy matrix for PLG activation",
        "artifact_type": "html",
        "title": "PLG Strategy Matrix"
    })
    assert res_art.status_code == 200
    art = res_art.json()
    assert art["artifact_type"] == "html"
    assert "<!DOCTYPE html>" in art["content"] or "<div" in art["content"]

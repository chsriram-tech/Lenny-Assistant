# 🚀 The Lenny Growth Assistant

**The Lenny Growth Assistant** is a full-stack, AI-powered conversational web application designed for Product Managers, Growth Leaders, and Founders. It provides grounded answers strictly backed by authenticated transcripts from prominent tech guests on *Lenny's Podcast* (e.g., Brian Chesky, Marty Cagan, Elena Verna, Gibson Biddle, Shreyas Doshi, and Claire Vo).

Built for the **Oogway Labs Forward Deployed Engineer Take-Home Assessment**.

---

## ✨ Features

- **🎯 Grounded Transcript RAG Engine**: Retrieves authentic transcript chunks with exact source citations (Guest Name, Episode Title, Excerpt, Match Score %, and Newsletter Link).
- **⚡ Dynamic Multi-Provider Orchestration**: Seamlessly switch between **Local Ollama (`llama3`)**, **Anthropic Claude (`claude-3-5-sonnet`)**, and **OpenAI GPT (`gpt-4o`)** in real-time.
- **✍️ Ship 30 for 30 Essay Skill**: Built-in skill that generates structured, 1,250-word product & growth strategy essays adhering to Ship 30 principles.
- **🎨 Claude-Style Artifact Viewer**: Side-by-side drawer for previewing AI-generated Markdown and sandboxed HTML/CSS UI cards with Desktop/Mobile toggles.
- **🍷 Red Wine & Champagne Gold Theme**: Premium luxury dark mode UI with glassmorphism panels, glowing neon highlights, and full-width centered chat layout.
- **📊 System Diagnostics**: Integrated health monitoring endpoint (`GET /api/health`) and diagnostics modal.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Python 3.10+ & FastAPI
- **Database / Persistence**: SQLAlchemy + SQLite / PostgreSQL vector storage
- **LLM Integration**: HTTP Client supporting Ollama, Anthropic API, and OpenAI API

### Frontend
- **Framework**: React + Vite
- **Styling**: TailwindCSS + Vanilla CSS glassmorphism system
- **Icons & Markdown**: Lucide React & Marked parser

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --reload --port 8000
```
*Backend runs at `http://localhost:8000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`*

---

## 🧪 Testing

Run backend API tests with Pytest:
```bash
$env:PYTHONPATH="backend"; python -m pytest backend/tests/test_api.py
```

---

## 📄 License
MIT License

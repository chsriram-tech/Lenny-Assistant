# 🍷 The Lenny Growth Assistant

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lenny--assistant.vercel.app-9f1239?style=for-the-badge&logo=vercel)](https://lenny-assistant.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0%2B-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4%2B-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4%2B-38BDF8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🌐 **Live Application Deployment**: [https://lenny-assistant.vercel.app/](https://lenny-assistant.vercel.app/)

**The Lenny Growth Assistant** is a full-stack, AI-powered conversational web application built for Product Managers, Growth Leaders, and Founders. It delivers grounded strategic insights strictly backed by authentic podcast transcripts from world-class tech guests on *Lenny's Podcast*.

Built specifically to fulfill **100% of the mandatory requirements** for the **Oogway Labs Forward Deployed Engineer Take-Home Assessment**.

---

## 📋 Table of Contents

- [Overview & Objective](#-overview--objective)
- [Key Features](#-key-features)
- [Supported Podcast Guests & Knowledge Base](#-supported-podcast-guests--knowledge-base)
- [System Architecture](#-system-architecture)
- [Directory & Codebase Structure](#-directory--codebase-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Database Schema](#-database-schema)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Installation & Local Setup](#-installation--local-setup)
- [Docker Deployment](#-docker-deployment)
- [Testing & Verification](#-testing--verification)

---

## 🎯 Overview & Objective

Traditional AI assistants often generate hallucinated advice or generic summaries. **The Lenny Growth Assistant** solves this by implementing a **Retrieval-Augmented Generation (RAG)** pipeline grounded strictly in verified transcript chunks from top product executives on *Lenny's Podcast*. 

If a user asks a question not covered in the transcripts, the system explicitly acknowledges knowledge limits rather than inventing false claims.

---

## ✨ Key Features

### 1. 🔍 Grounded Transcript RAG Engine
- Every assistant response is backed by retrieved transcript chunks.
- Includes expandable **Grounded Citation Cards** featuring:
  - Guest Name & Role
  - Episode Title
  - Direct Excerpt Quote
  - Relevance Match Score %
  - Clickable link to the original Lenny's Newsletter / Podcast transcript.

### 2. ⚡ Dynamic Multi-Provider LLM Orchestration
- Switch models dynamically **without code changes or restarting**:
  - **Local Ollama** (`http://localhost:11434`, `llama3`) — *Mandatory Assignment Target*
  - **Anthropic Claude** (`claude-3-5-sonnet-20241022`, `claude-3-haiku-20240307`)
  - **OpenAI GPT** (`gpt-4o`, `gpt-4o-mini`)
- Features an offline resilience fallback engine for zero-downtime operation.

### 3. ✍️ "Ship 30 for 30" Essay Skill Generator
- Dedicated skill triggering a structured, 1,250-word product strategy essay.
- Strictly enforces Ship 30 principles:
  - 2-minute rule
  - Strong atomic hooks
  - Skimmable headers & bold callouts
  - Actionable takeaways

### 4. 🎨 Claude-Style Side-by-Side Artifact Viewer
- Interactive right-hand drawer (`ArtifactViewer.jsx`) for inspecting AI-generated content.
- Supports **Markdown** documents and **HTML/CSS UI cards**.
- HTML artifacts are rendered inside a **sandboxed iframe (`sandbox="allow-scripts"`)** for isolation.
- Features Desktop/Mobile device preview toggles, 1-click clipboard copy, and file download.

### 5. 👑 Dominant Red Wine & Champagne Gold Luxury UI
- Deep Bordeaux Velvet backdrop (`#0f0508`) with ambient red wine & champagne gold radial glows.
- Glassmorphism containers with text glow (`text-glow`) and dominant **Neon Gold & Crimson Glow Pill** branding.
- ChatGPT / Claude style full-width centered chat layout.

### 6. 📊 System Diagnostics & Health Monitoring
- Integrated `GET /api/health` endpoint and `HealthModal.jsx` reporting live status for FastAPI, Database, Chunk Index Count (13 Chunks loaded), and LLM Provider connectivity.

---

## 🎙️ Supported Podcast Guests & Knowledge Base

| Guest | Domain / Specialization | Core Frameworks / Topics |
|---|---|---|
| **Marty Cagan** | Product Management | Refusal of Feature Factories, Empowered Product Teams |
| **Brian Chesky** | Founder-Led Product | Design-Led Growth, Merging PM & Product Marketing at Airbnb |
| **Elena Verna** | B2B Growth & PLG | Growth Loops, Product-Led Growth, Monetization |
| **Gibson Biddle** | Product Strategy | Netflix DHM Framework (Delight, Hard to Copy, Margin) |
| **Shreyas Doshi** | Product Leadership | LNO Framework (Leverage, Neutral, Overhead), High-Agency PM |
| **Claire Vo** | AI & Engineering | ChatPRD, AI Tools for Acceleration |

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   React + Vite Frontend│
                                  │ (Red Wine & Gold Theme)│
                                  └───────────┬────────────┘
                                              │ HTTP / JSON API
                                              ▼
                                  ┌────────────────────────┐
                                  │  FastAPI Backend API   │
                                  └───────────┬────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│  RAG Search Engine│               │   LLM Service    │               │ Database Storage │
│ (Transcript Chunks│               │ (Provider Switch)│               │ (PostgreSQL/SQLite│
└────────┬─────────┘               └────────┬─────────┘               └──────────────────┘
         │                                  │
         │  ┌───────────────────────────────┴───────────────────────────────┐
         │  │                                                               │
         ▼  ▼                                                               ▼
┌────────────────────────┐                                     ┌────────────────────────┐
│ Local Ollama Server    │                                     │ Cloud Providers        │
│ (localhost:11434)      │                                     │ (Anthropic & OpenAI)   │
└────────────────────────┘                                     └────────────────────────┘
```

---

## 📁 Directory & Codebase Structure

```
.
├── README.md                           # Comprehensive documentation
├── Dockerfile.backend                  # Docker container definition for FastAPI backend
├── Dockerfile.frontend                 # Docker container definition for Vite frontend
├── docker-compose.yml                  # Multi-container orchestration config
├── run_app.ps1                         # PowerShell script to launch both servers
│
├── backend/                            # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                        # REST API Routers
│   │   │   ├── artifacts.py            # Artifact endpoints (GET, POST)
│   │   │   ├── chat.py                 # Grounded Q&A chat endpoint
│   │   │   ├── health.py               # Health & diagnostics endpoint
│   │   │   ├── ingest.py               # Transcript ingestion endpoint
│   │   │   ├── providers.py            # LLM provider listing endpoint
│   │   │   ├── sessions.py             # Session CRUD endpoints
│   │   │   └── skills.py               # Ship 30 essay skill endpoint
│   │   ├── core/                       # App Configuration & DB setup
│   │   │   ├── config.py               # Environment settings
│   │   │   ├── database.py             # SQLAlchemy engine & session maker
│   │   │   └── logger.py               # Structured logging module
│   │   ├── models/                     # Database Models
│   │   │   └── schema.py               # Conversations, Messages, Artifacts, Chunks
│   │   ├── schemas/                    # Pydantic Schemas
│   │   │   └── pydantic_models.py      # Request / Response validation schemas
│   │   ├── services/                   # Service Layer
│   │   │   ├── artifact_service.py     # HTML/Markdown artifact generator & sanitizer
│   │   │   ├── ingestion_service.py    # Transcript seeder & parser
│   │   │   ├── llm_service.py          # Provider orchestration & resilience
│   │   │   ├── rag_service.py          # Vector/Keyword transcript search
│   │   │   └── ship30_service.py       # Ship 30 essay generator
│   │   └── main.py                     # FastAPI application entrypoint
│   ├── data/
│   │   └── transcripts/
│   │       └── lenny_podcasts.json     # Seed dataset of podcast transcript chunks
│   ├── tests/
│   │   └── test_api.py                 # Pytest integration test suite
│   └── requirements.txt                # Backend dependencies
│
└── frontend/                           # React + Vite Frontend
    ├── index.html                      # HTML entry point
    ├── package.json                    # Frontend dependencies
    ├── vite.config.js                  # Vite server & API proxy config
    ├── tailwind.config.js              # Tailwind configuration
    ├── postcss.config.js               # PostCSS config
    └── src/
        ├── App.jsx                     # Root React Application Component
        ├── main.jsx                    # React DOM entrypoint
        ├── index.css                   # Red Wine & Champagne Gold CSS design system
        ├── components/
        │   ├── ArtifactViewer.jsx      # Side-by-side artifact drawer
        │   ├── ChatWindow.jsx          # Centered chat interface & citation cards
        │   ├── HealthModal.jsx         # System diagnostics modal
        │   ├── ModelSelectorModal.jsx  # Provider & model selection modal
        │   └── Sidebar.jsx             # Left navigation, brand pill & history list
        └── services/
            └── api.js                  # Frontend API client library
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns system diagnostics, DB health, chunk count, and model statuses. |
| `GET` | `/api/providers` | Lists active LLM providers (Ollama, Anthropic, OpenAI). |
| `GET` | `/api/sessions` | Lists all conversation sessions. |
| `POST` | `/api/sessions` | Creates a new conversation session. |
| `GET` | `/api/sessions/{id}` | Gets detailed conversation history for a session. |
| `DELETE` | `/api/sessions/{id}` | Deletes a conversation session. |
| `POST` | `/api/chat` | Processes grounded transcript Q&A chat requests. |
| `POST` | `/api/skills/ship30` | Triggers Ship 30 for 30 essay generation. |
| `GET` | `/api/artifacts/{id}` | Retrieves a specific artifact by ID. |
| `POST` | `/api/artifacts` | Generates a new Markdown or HTML artifact. |

---

## 🗄️ Database Schema

```sql
-- Conversations Table
CREATE TABLE conversations (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    provider VARCHAR DEFAULT 'ollama',
    model VARCHAR DEFAULT 'llama3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR NOT NULL,
    content TEXT NOT NULL,
    sources JSON,
    artifact_id VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artifacts Table
CREATE TABLE artifacts (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR REFERENCES conversations(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    artifact_type VARCHAR NOT NULL, -- 'markdown' | 'html'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transcript Chunks Table
CREATE TABLE transcript_chunks (
    id VARCHAR PRIMARY KEY,
    episode_title VARCHAR NOT NULL,
    guest VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    source_url VARCHAR,
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL
);
```

---

## 🎨 Design System & Aesthetics

- **Primary Background**: `#0f0508` (Dark Bordeaux Velvet)
- **Glassmorphism**: `rgba(24, 8, 14, 0.82)` with `backdrop-filter: blur(16px)`
- **Borders**: `rgba(225, 29, 72, 0.18)` (Wine Crimson)
- **Gradients**: `linear-gradient(135deg, #f43f5e, #fbbf24, #fef08a)`
- **Typography**: Inter (Body) & JetBrains Mono (Code)
- **Text Glow**: `text-shadow: 0 0 25px rgba(251,191,36,0.85)`

---

## 💻 Installation & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- (Optional) Local Ollama server installed

### Step 1: Clone Repository
```bash
git clone https://github.com/chsriram-tech/Lenny-Assistant.git
cd Lenny-Assistant
```

### Step 2: Start Backend
```bash
cd backend
python -m pip install -r requirements.txt
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --reload --port 8000
```

### Step 3: Start Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser!

---

## 🐳 Docker Deployment

To launch the full stack with Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## 🧪 Testing & Verification

Run the integration test suite:
```bash
$env:PYTHONPATH="backend"; python -m pytest backend/tests/test_api.py
```

### Sample Verification Questions
1. *"What is Marty Cagan's view on feature factories?"*
2. *"Explain Elena Verna's B2B growth loops and PLG."*
3. *"Why did Brian Chesky eliminate traditional PM roles at Airbnb?"*
4. *"How does Gibson Biddle define Netflix's DHM framework?"*
5. *"How do I use Shreyas Doshi's LNO framework for prioritizing?"*

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

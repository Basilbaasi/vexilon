# Vexilon – AI Browser Assistant Ecosystem

Vexilon is an evolving AI assistant platform designed to integrate conversational intelligence directly into browser workflows through modular backend systems, local AI infrastructure, and scalable assistant architectures.

The project explores both:
- cloud-based AI inference workflows
- fully local offline AI execution

while progressively evolving toward a production-grade AI workspace platform.

---

# Project Vision

Vexilon is being engineered as:
- a browser-native AI assistant
- a local + cloud AI orchestration platform
- a scalable conversational workspace
- an extensible AI infrastructure project

The long-term objective is building a deployable AI ecosystem that combines:
- conversational intelligence
- browser integration
- workflow augmentation
- real-time AI communication
- modular inference routing
- production-ready backend engineering

---

# Repository Structure

```bash
vexilon/
│
├── screenshots/                  # Project screenshots and demo previews
│
├── v1.0/                         # Gemma API-based cloud assistant
│   ├── README.md
│   └── ...
│
├── v2/                           # Ollama-powered local AI assistant
│   ├── README.md
│   └── ...
│
└── README.md                     # Main repository documentation
```

---

# V1.0 – Gemma API-Based Assistant

V1 focuses on browser-native AI interaction using a cloud-hosted LLM workflow powered through the Gemma API.

## Core Features
- Chrome extension AI assistant
- Flask backend server
- Google Gemma API integration
- OpenAI-style API workflow
- Lightweight conversational UI
- Modular extension architecture

## Architecture

```text
Chrome Extension
       ↓
Flask Backend
       ↓
Gemma API
       ↓
AI Response Processing
```

## Technology Stack
- Python
- Flask
- JavaScript
- HTML/CSS
- Chrome Extension APIs
- REST APIs
- dotenv

## Purpose
This version establishes the initial conversational AI orchestration pipeline and browser assistant workflow.

---

# V2 – Ollama-Powered Local AI Assistant

V2 transitions Vexilon toward local AI infrastructure using Ollama and locally hosted language models.

This version enables:
- fully offline AI execution
- local inference workflows
- model flexibility
- streaming conversational interaction

without requiring cloud API dependency.

## Core Features
- Local AI execution with Ollama
- Offline conversational assistant
- Support for models like:
  - llama3
  - mistral
  - gemma
- Flask backend with OpenAI-compatible schema
- Chrome extension assistant UI
- Streaming response workflow
- Persistent conversational context

## Architecture

```text
Chrome Extension
       ↓
Flask Backend
       ↓
Ollama Local API
       ↓
Local LLM Models
       ↓
Streaming Responses
```

## Technology Stack
- Python
- Flask
- Ollama
- OpenAI Python SDK
- JavaScript
- Chrome Extension APIs
- HTML/CSS

## Purpose
This version focuses on local AI deployment, offline inference systems, and scalable assistant experimentation using self-hosted language models.

---

# Screenshots

Project screenshots and demo previews can be placed inside:

```bash
/screenshots
```

---

# Development Roadmap

## Upcoming Engineering Goals
- Dedicated React frontend
- FastAPI migration
- WebSocket streaming
- PostgreSQL persistence
- Redis caching
- Docker containerization
- Authentication system
- CI/CD automation
- File upload + RAG support
- Multi-model orchestration
- Voice interaction
- Real-time browser context awareness

---

# Long-Term Direction

Vexilon is evolving from:
> a lightweight Chrome assistant

toward:
> a production-grade AI workspace ecosystem

The platform is intended to explore:
- browser-native AI systems
- local inference infrastructure
- scalable backend engineering
- conversational workflow orchestration
- deployable AI tooling

---

# Why This Project Exists

The goal of Vexilon is not just creating another chatbot.

It is an engineering-focused exploration into:
- AI infrastructure
- deployment workflows
- local LLM systems
- browser-based AI interaction
- scalable assistant architectures

while building production-oriented software engineering skills around:
- backend systems
- deployment
- streaming communication
- modular architecture
- DevOps workflows
- AI application engineering

---

# Setup

## Clone Repository

```bash
git clone https://github.com/Basilbaasi/vexilon.git
cd vexilon
```

Refer to the version-specific README files inside:
- `v1.0/README.md`
- `v2/README.md`

for detailed setup instructions.

---

# License

Copyright © 2026 Basil CK

This repository is intended for educational, research, and portfolio purposes only.

Commercial usage, redistribution, modification, or deployment without explicit permission is prohibited.

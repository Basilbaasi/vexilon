# Vexilon – AI Browser Assistant Platform (v1)

Vexilon is an AI-powered browser assistant that integrates conversational AI directly into the browsing experience using a lightweight Chrome extension and a custom backend inference server.

Version `v1` establishes the foundational architecture for:
- browser-native AI interaction
- API-driven LLM orchestration
- conversational workflows
- scalable assistant infrastructure

The system connects a Chrome extension frontend with a Flask backend that communicates with Google's Gemma model through an OpenAI-compatible API structure.

---

# Features

## AI Browser Assistant
- Conversational AI inside Chrome
- Lightweight popup-based interaction
- Fast prompt-response workflow

## Gemma API Integration
- Google Gemma model support
- OpenAI-style API request formatting
- Modular backend inference handling

## Backend API Server
- Flask-powered API backend
- `/process` endpoint for prompt handling
- JSON-based communication pipeline

## Modular Architecture
- Decoupled frontend/backend structure
- Easily extensible for future upgrades
- Organized project workflow

## Chrome Extension Support
- Popup UI interaction
- Browser-integrated assistant workflow
- Simple and lightweight deployment

---

# System Architecture

```text
Chrome Extension UI
        ↓
popup.js / content.js
        ↓
Flask Backend Server
        ↓
Gemma API Endpoint
        ↓
LLM Response Processing
        ↓
Extension UI Rendering
```

---

# Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Chrome Extension APIs, JavaScript, HTML, CSS |
| Backend | Python, Flask |
| AI Layer | Google Gemma API |
| Environment | dotenv |
| Communication | REST API, JSON |

---

# Project Structure

```bash
v1/
├── PY/
│   ├── server.py          # Flask backend using Gemma API
│   └── test.py            # Backend/API testing script
│
├── content.js             # Extension content script
├── popup.html             # Popup interface
├── popup.js               # UI logic and API requests
├── styles.css             # Styling
├── manifest.json          # Chrome extension configuration
├── icon.png               # Extension icon
├── requirements.txt       # Python dependencies
└── README.md              # Documentation
```

---

# Setup Guide

## 1. Clone Repository

```bash
git clone https://github.com/Basilbaasi/vexilon.git
cd vexilon/v1
```

---

## 2. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the project directory:

```ini
GEMMA_API_URL=https://your-gemma-endpoint.com/v1/chat
GEMMA_API_KEY=your_api_key_here
```

---

## 4. Run Flask Backend

```bash
python PY/server.py
```

Default server:

```text
http://localhost:5000
```

---

## 5. Load Chrome Extension

1. Open:

```text
chrome://extensions/
```

2. Enable **Developer Mode**

3. Click:

```text
Load unpacked
```

4. Select the `v1/` folder

---

# Example Backend Endpoint

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMMA_API_URL = os.getenv("GEMMA_API_URL")
API_KEY = os.getenv("GEMMA_API_KEY")

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    user_input = data.get("message", "")

    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are Jarvis, a helpful assistant."
            },
            {
                "role": "user",
                "content": user_input
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        response = requests.post(
            GEMMA_API_URL,
            json=payload,
            headers=headers
        )

        gemma_reply = response.json()["choices"][0]["message"]["content"]

    except Exception as e:
        gemma_reply = f"Error talking to Gemma: {str(e)}"

    return jsonify({"response": gemma_reply})

if __name__ == "__main__":
    app.run(port=5000)
```

---

# Current Limitations (v1)

- No persistent database memory
- No authentication system
- Single-model architecture
- No WebSocket streaming
- Minimal UI system
- No containerization
- No deployment pipeline

---

# Planned Upgrades

## V2 Roadmap
- Dedicated React frontend
- FastAPI backend migration
- WebSocket streaming
- PostgreSQL integration
- Docker support
- Redis caching
- Authentication system
- Multi-model support
- File upload + RAG pipeline
- Voice interaction
- CI/CD automation

---

# Long-Term Vision

Vexilon is being developed toward a scalable AI workspace platform focused on:
- browser-native AI workflows
- real-time assistant systems
- modular LLM infrastructure
- productivity augmentation
- deployable AI tooling

The long-term objective is building a production-grade AI assistant ecosystem that combines:
- conversational intelligence
- browser interaction
- contextual workflows
- scalable backend services

---

# License

Copyright © 2026 Basil CK

This project is intended for educational, research, and portfolio purposes only.

Commercial usage, redistribution, or deployment without explicit permission is prohibited.

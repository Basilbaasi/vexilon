Vexilon – v1 (Gemma API-based Chrome Assistant)
This is version v1 of the Vexilon project. It connects a Chrome extension to a remote AI backend powered by Google's Gemma model, served through a custom Flask API compatible with OpenAI’s format.

🧠 Features
🌐 Uses Gemma model via API for LLM responses

🧩 Chrome extension for lightweight user interaction

🔁 Flask backend handles /process requests in OpenAI-style format


📁 Folder Structure
bash
Copy
Edit
v1/
├── PY/
│   └── server.py          # Flask backend using Gemma API
│   └── test.py            # Test script
├── content.js             # Extension content script
├── icon.png               # Icon for extension
├── manifest.json          # Chrome extension config
├── popup.html             # Popup chat UI
├── popup.js               # UI event and request logic
├── styles.css             # Basic styling
├── requirements.txt       # Python packages
└── README.md              # Project documentation
🚀 How to Use
🖥️ 1. Run Flask Backend
Install dependencies and start the server:

bash
Copy
Edit
pip install -r requirements.txt
python PY/server.py
Ensure your .env file is set up properly with your Gemma API URL and key/token, if required.

🌐 2. Load Chrome Extension
Go to chrome://extensions/

Enable Developer Mode

Click Load unpacked

Select the v1/ folder

🧪 Example: Flask API Server (server.py)
python
Copy
Edit
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

GEMMA_API_URL = os.getenv("GEMMA_API_URL")  # Example: "https://your-gemma-api-endpoint.com/v1/chat"
API_KEY = os.getenv("GEMMA_API_KEY")        # Optional if needed

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    user_input = data.get("message", "")

    # Construct request payload for Gemma
    payload = {
        "messages": [
            {"role": "system", "content": "You are Jarvis, a helpful assistant."},
            {"role": "user", "content": user_input}
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        response = requests.post(GEMMA_API_URL, json=payload, headers=headers)
        gemma_reply = response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        gemma_reply = f"Error talking to Gemma: {str(e)}"

    return jsonify({"response": gemma_reply})

if __name__ == "__main__":
    app.run(port=5000)
🔐 .env Setup (Required)
ini
Copy
Edit
GEMMA_API_URL=https://your-gemma-endpoint.com/v1/chat
GEMMA_API_KEY=your_api_key_here  # Optional depending on deployment
📄 License & Usage
txt
Copy
Edit
© 2025 Basil CK. All rights reserved.

This version is for learning and demonstration purposes only.
Do not reuse, redistribute, or deploy commercially without explicit permission.
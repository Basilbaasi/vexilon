
# Vexilon – v1 (API-based Chrome Assistant)

This is version **v1** of the Vexilon project. It connects a Chrome extension to a remote AI backend using a simple Flask API, mimicking OpenAI's chat completions format.

---

## 🧠 Features

- 🌐 Works with any API endpoint (e.g., OpenAI, custom proxy)
- 🧩 Chrome extension for user interaction
- 🔁 Flask backend to handle `/process` requests
- 🤖 Assistant named **Jarvis**

---

## 📁 Folder Structure

```
v1/
├── PY/
│   └── server.py          # Flask backend script
│   └── test.py            # Test script
├── content.js             # Extension content script
├── icon.png               # Icon for extension
├── manifest.json          # Chrome extension setup
├── popup.html             # Popup chat interface
├── popup.js               # JS logic for UI
├── styles.css             # Styling
├── requirements.txt       # Python dependencies
└── README.md              # This documentation file
```

---

## 🚀 How to Use

### 🖥️ 1. Run Flask Backend

Install dependencies and start server:

```bash
pip install -r requirements.txt
python PY/server.py
```

> You can customize `server.py` to connect to any AI API, including OpenAI or a mock service.

---

### 🌐 2. Load Chrome Extension

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `v1/` folder

---

## 🧪 Example: Flask API Server (server.py)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    message = data.get("message", "")
    reply = f"Echo from Jarvis: {message}"
    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(port=5000)
```

---

## 📄 License & Usage

```txt
© 2025 Basil CK. All rights reserved.

This version is provided for learning and demonstration purposes only.
Do not reuse, redistribute, or modify the code without explicit permission.
```

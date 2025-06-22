
# Vexilon – v2 (Ollama-powered Chrome Assistant)

This is version **v2** of the Vexilon project, using **Ollama + Flask** to power a Chrome extension that lets you talk to a local AI model. This version works entirely offline and supports models like `llama3`.

---

## 🧠 Features

- 💻 Local AI using [Ollama](https://ollama.com)
- 🧠 Supports models like `llama3`, `mistral`, `gemma`
- 🔌 Flask backend compatible with OpenAI's API format
- 🧩 Chrome extension frontend UI
- 🤖 AI assistant persona named **Jarvis**

---

## 📁 Folder Structure

```
v2/
├── PY/
│   └── app.py             # Flask backend using Ollama
├── content.js             # Chrome extension script
├── icon.png               # Extension icon
├── manifest.json          # Chrome extension metadata
├── popup.html             # Extension popup chat window
├── popup.js               # JS for popup interaction
├── styles.css             # Styling for popup
└── README.md              # This file
```

---

## 🚀 Setup Instructions

### ✅ Step 1: Run Ollama

Install Ollama and run a model:

```bash
ollama run llama3
```

---

### 🖥️ Step 2: Run Flask Backend

Go to the `PY/` folder and run:

```bash
pip install flask flask-cors openai
python app.py
```

Server starts at: `http://localhost:5000`

---

### 🌐 Step 3: Load the Extension

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Choose the `v2` folder

---

## 📡 API Endpoint

**POST** `/process`

**Request:**
```json
{ "message": "Your question here" }
```

**Response:**
```json
{ "response": "Vexilon: AI response here" }
```

---

## 💡 Backend Code (Flask + Ollama)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Dummy key for Ollama
)

app = Flask(__name__)
CORS(app)

messages = [
    {"role": "system", "content": "You are a helpful assistant named Jarvis."}
]

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    user_msg = data.get("message", "")

    messages.append({"role": "user", "content": user_msg})
    response_text = ""

    try:
        completion = client.chat.completions.create(
            model="llama3",
            messages=messages,
            temperature=0.5,
            top_p=1,
            max_tokens=1024,
            stream=True
        )

        for chunk in completion:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                response_text += delta.content

        messages.append({"role": "assistant", "content": response_text})
        response_text = response_text.replace("*", " ")
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"response": f"Server Error: {str(e)}"}), 500

    print("User:", user_msg)
    print("Jarvis:", response_text)
    return jsonify({"response": f"Vexilon: {response_text}"})

if __name__ == "__main__":
    app.run(port=5000)
```

---

## ⚠️ License & Usage

```txt
© 2025 Basil CK. All rights reserved.

This project is provided for **educational and reference purposes only**.
You may view the source code, but you may **not copy, modify, distribute, or reuse it**
in any form without explicit permission from the author.
```

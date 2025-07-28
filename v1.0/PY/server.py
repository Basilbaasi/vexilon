import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")

app = Flask(__name__)
CORS(app)

def call_model(question):
    invoke_url = f"{BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "text/event-stream"
    }

    payload = {
        "model": "google/gemma-3n-e4b-it",
        "messages": [{"role": "user", "content": question}],
        "max_tokens": 512,
        "temperature": 0.2,
        "top_p": 0.7,
        "stream": True
    }

    response = requests.post(invoke_url, headers=headers, json=payload, stream=True)
    response_text = ""

    try:
        for line in response.iter_lines():
            if line:
                decoded = line.decode("utf-8")
                if decoded.startswith("data: "):
                    content = decoded.removeprefix("data: ").strip()
                    if content != "[DONE]":
                        data = json.loads(content)
                        delta = data.get("choices", [{}])[0].get("delta", {})
                        if "content" in delta:
                            response_text += delta["content"]
    except Exception as e:
        print("Streaming error:", e)
        return "Sorry, error while generating response."

    return response_text.replace("*", " ")

@app.route("/process", methods=["POST"])
def process():
    print("✅ Flask received request to /process")
    data = request.get_json()
    message = data.get("message", "")
    print("Received:", message)
    response_text = call_model(message)
    return jsonify({"response": f"Vexilon: {response_text}"})

if __name__ == "__main__":
    app.run(port=5000)

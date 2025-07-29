from flask import Flask, request, Response, stream_with_context
import os
import requests
import json
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")

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

    try:
        response = requests.post(invoke_url, headers=headers, json=payload, stream=True)
        for line in response.iter_lines():
            if line:
                decoded = line.decode("utf-8")
                if decoded.startswith("data: "):
                    content = decoded.removeprefix("data: ").strip()
                    if content != "[DONE]":
                        data = json.loads(content)
                        delta = data.get("choices", [{}])[0].get("delta", {})
                        if "content" in delta:
                            for word in delta["content"].split():
                                yield word + " "
    except Exception as e:
        print("Streaming error:", e)
        yield "❌ Error while generating response."

@app.route("/process", methods=["POST"])
def process():
    print("✅ Flask received request to /process")
    data = request.get_json()
    message = data.get("message", "")
    print("Received:", message)

    def generate():
        yield "Vexilon: "
        yield from call_model(message)

    return Response(stream_with_context(generate()), mimetype="text/plain")

if __name__ == "__main__":
    app.run(port=5000)

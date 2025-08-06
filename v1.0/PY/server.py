from flask import Flask, request, Response, stream_with_context
import os
import requests
import json
from dotenv import load_dotenv
from flask_cors import CORS
import re

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
        buffer = ""
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
                            buffer += delta["content"]
                            
                            # Process complete lines first
                            while "\n" in buffer:
                                line_part, buffer = buffer.split("\n", 1)
                                yield line_part.strip() + "\n"
                            
                            # Process special patterns that shouldn't be split
                            patterns = [
                                (r'^\d+\.\s\*\*.+?\*\*:', 0),  # Numbered list items
                                (r'^-\s\*\*.+?\*\*:', 0),      # Bullet list items
                                (r'^\*\*.+?\*\*:', 0),         # Bold headers
                                (r'`[^`]+`', 0),               # Code blocks
                            ]
                            
                            for pattern, lookahead in patterns:
                                match = re.search(pattern, buffer)
                                if match:
                                    # Yield any text before the match
                                    if match.start() > 0:
                                        yield buffer[:match.start()]
                                    # Yield the complete pattern
                                    yield buffer[match.start():match.end()+lookahead]
                                    buffer = buffer[match.end()+lookahead:]
                                    break
                            
        # Flush remaining buffer
        if buffer.strip():
            yield buffer.strip()
            
    except json.JSONDecodeError as e:
        print("JSON decode error:", e)
        yield "\n❌ Error parsing response data."
    except requests.RequestException as e:
        print("Request error:", e)
        yield "\n❌ Connection error while generating response."
    except Exception as e:
        print("Unexpected error:", e)
        yield "\n❌ Error while generating response."

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

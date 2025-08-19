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

import re
import json
import requests

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
                            
                            # Process for formatted streaming
                            formatted_chunk, remaining_buffer = process_buffer(buffer)
                            if formatted_chunk:
                                yield formatted_chunk
                                buffer = remaining_buffer
                            
        # Flush remaining content
        if buffer.strip():
            formatted_chunk, _ = process_buffer(buffer.strip())
            yield formatted_chunk
            
    except json.JSONDecodeError as e:
        yield "❌ Error parsing response data."
    except requests.RequestException as e:
        yield "❌ Connection error while generating response."
    except Exception as e:
        yield "❌ Error while generating response."

def process_buffer(buffer):
    """
    Processes buffer to preserve formatting and stream naturally.
    Returns: (formatted_chunk, remaining_buffer)
    """
    # Priority 1: Complete Markdown elements
    markdown_patterns = [
        (r'(^#+\s.+?)(?=\n|$)', re.MULTILINE),     # Headers (##, ###)
        (r'(\*\*.+?\*\*)', 0),                      # **bold**
        (r'(\*.+?\*)', 0),                           # *italics*
        (r'(`[^`]+`)', 0),                           # `code`
        (r'(^\d+\.\s.+?)(?=\n|$)', re.MULTILINE),    # Numbered lists
        (r'(^-\s.+?)(?=\n|$)', re.MULTILINE),        # Bullet points
    ]

    for pattern, flags in markdown_patterns:
        match = re.search(pattern, buffer, flags)
        if match:
            start, end = match.span()
            if start == 0:  # Pattern at start of buffer
                return match.group(1), buffer[end:]
    
    # Priority 2: Natural language breaks
    split_chars = ('\n', '. ', '! ', '? ', ', ', '; ', ' ')
    for char in split_chars:
        if char in buffer:
            pos = buffer.find(char) + len(char)
            return buffer[:pos], buffer[pos:]
    
    # Default: Return entire buffer if no split point found
    return "", buffer

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

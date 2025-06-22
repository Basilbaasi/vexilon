from flask import Flask, request, jsonify
from flask_cors import CORS

from openai import OpenAI

#need python 3.11
# run C:/Users/basil/AppData/Local/Programs/Python/Python311/Scripts/pip.exe install -r requirements.txt
#  C:/Users/basil/AppData/Local/Programs/Python/Python311/Scripts/pip.exe install pyaudio   
# ctrl+shift+p,select python:select interpriter 3.11

# Initialize text-to-speech engine


# Initialize OpenAI client
client = OpenAI(
    base_url = "https://integrate.api.nvidia.com/v1",
    api_key = "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"
    # impala003@driftz.net
    # ichukunju123
)

app = Flask(__name__)
CORS(app)  # Allow cross-origin from extension

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    message = data.get("message", "")
    completion = client.chat.completions.create(
            model="deepseek-ai/deepseek-r1-0528",
            messages=[{"role":"user","content":message}],
            temperature=0.6,
            top_p=0.7,
            max_tokens=4096,
            stream=True
    )
    response_text = ""
        
        # Stream and accumulate each chunk of the response
    for chunk in completion:
        delta = chunk.choices[0].delta
        # Ignore reasoning_content completely
        if isinstance(delta.content, str):
            response_text += delta.content

    response_text = response_text.replace("*", " ")
    print("Received:", message)
    return jsonify({"response": f"Vexilon: {response_text}"})

app.run(port=5000)

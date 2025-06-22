from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

# Use the new OpenAI client (required in openai >= 1.0.0)
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # Dummy key for Ollama
)

app = Flask(__name__)
CORS(app)

# Memory for chat history
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
            model="llama3",  # Or your model like "mistral", "gemma:2b"
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
    return jsonify({"rThe other black? Are we building a new red cap? esponse": f"Vexilon: {response_text}"})

if __name__ == "__main__":
    app.run(port=5000)
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
message="hello"
completion = client.chat.completions.create(
            model="nvidia/nemotron-4-340b-instruct",
            messages=[{"role":"user","content":message}],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=True
    )
response_text = ""
        
        # Stream and accumulate each chunk of the response
for chunk in completion:
    content = chunk.choices[0].delta.content
    if isinstance(content, str):  # Ensure content is a string
        response_text += content  # Accumulate text

response_text=response_text.replace("*", " ")
print(response_text)
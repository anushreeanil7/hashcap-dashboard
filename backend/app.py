# NOTE: This file is for LOCAL reference only. Lovable cannot run Python.
# Run this on your machine: cd backend && pip install -r requirements.txt && python app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

generator = pipeline("text-generation", model="microsoft/phi-2", trust_remote_code=True)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    topic = data.get("topic", "")
    tone = data.get("tone", "casual")

    caption_prompt = f"Write a short engaging Instagram caption about {topic} with a {tone} tone."
    caption_result = generator(caption_prompt, max_new_tokens=100, num_return_sequences=1)
    caption = caption_result[0]["generated_text"].replace(caption_prompt, "").strip()

    hashtag_prompt = f"Generate 5 Instagram hashtags about {topic}. Only return hashtags."
    hashtag_result = generator(hashtag_prompt, max_new_tokens=60, num_return_sequences=1)
    hashtag_text = hashtag_result[0]["generated_text"].replace(hashtag_prompt, "").strip()
    hashtags = [tag.strip() for tag in hashtag_text.split() if tag.startswith("#")][:5]

    return jsonify({"caption": caption, "hashtags": hashtags})

if __name__ == "__main__":
    app.run(debug=True)

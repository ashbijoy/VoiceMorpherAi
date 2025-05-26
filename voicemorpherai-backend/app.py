from flask import Flask, request, send_file, jsonify
from gtts import gTTS
import os
import io

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"status": "VoiceMorpherAI backend (gTTS) is live ✅"})

@app.route("/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        text = data.get("text", "")
        voice = data.get("voice", "manu")

        if not text.strip():
            return jsonify({"error": "Text is required"}), 400

        # Select accent
        tld = "in" if voice == "maya" else "us"

        # Save to temp file first
        tts = gTTS(text=text, lang="en", tld=tld)
        temp_path = "/tmp/voicemorpher_tts.mp3"
        tts.save(temp_path)

        # Read file into memory buffer
        with open(temp_path, "rb") as f:
            audio_data = io.BytesIO(f.read())

        return send_file(audio_data, mimetype="audio/mpeg", download_name="speech.mp3")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
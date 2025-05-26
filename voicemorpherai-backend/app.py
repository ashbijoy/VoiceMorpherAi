from flask import Flask, request, send_file, jsonify
from flask_cors import CORS  
from gtts import gTTS
import os
import io

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

@app.route("/")
def home():
    return jsonify({"status": "VoiceMorpherAI backend (gTTS) is live ✅"})

@app.route("/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        text = data.get("text", "")
        voice = data.get("voice", "maya")

        if not text.strip():
            return jsonify({"error": "Text is required"}), 400

        # Map each voice to a gTTS-supported TLD
        tld_map = {
            "maya": "co.in",      # Indian
            "meera": "co.uk",     # British
            "melody": "com",      # American
            "mia": "com.au",      # Australian
            "marie": "ca"         # Canadian
        }

        tld = tld_map.get(voice, "co.in")  # fallback to Maya's accent

        # Generate speech
        tts = gTTS(text=text, lang="en", tld=tld)
        temp_path = "/tmp/voicemorpher_tts.mp3"
        tts.save(temp_path)

        with open(temp_path, "rb") as f:
            audio_data = io.BytesIO(f.read())

        return send_file(audio_data, mimetype="audio/mpeg", download_name="speech.mp3")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
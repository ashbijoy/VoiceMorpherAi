from flask import Flask, request, send_file, jsonify
from gtts import gTTS
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

        # Map Maya/Manu to language/accent
        lang = "en"
        tld = "in" if voice == "maya" else "us"  # Indian vs US English accent

        # Generate audio with gTTS
        tts = gTTS(text=text, lang=lang, tld=tld)
        buffer = io.BytesIO()
        tts.write_to_fp(buffer)
        buffer.seek(0)

        return send_file(buffer, mimetype="audio/mpeg", download_name="speech.mp3")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
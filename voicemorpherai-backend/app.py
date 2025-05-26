from flask import Flask, request, send_file, after_this_request
from flask_cors import CORS
import os
import logging
from utils.tts import generate_tts
from utils.voice_clone import generate_voice_clone

app = Flask(__name__)
CORS(app, origins="*")

logging.basicConfig(level=logging.INFO)

@app.route("/")
def home():
    return "VoiceMorpherAI Backend is live!", 200

@app.route("/tts", methods=["POST"])
def tts():
    data = request.json
    text = data.get("text")
    voice = data.get("voice")
    if not text or not voice:
        return {"error": "Missing 'text' or 'voice'"}, 400

    app.logger.info(f"TTS Request - Voice: {voice}, Text: {text}")
    output_path = generate_tts(text, voice)

    @after_this_request
    def cleanup(response):
        try:
            os.remove(output_path)
        except Exception as e:
            app.logger.warning(f"Failed to delete temp file: {e}")
        return response

    return send_file(output_path, mimetype="audio/wav")

@app.route("/clone", methods=["POST"])
def clone():
    if 'audio' not in request.files or 'text' not in request.form:
        return {"error": "Missing audio or text"}, 400

    audio = request.files['audio']
    text = request.form['text']

    app.logger.info("Voice cloning request received (simulated)")
    output_path = generate_voice_clone(audio, text)

    @after_this_request
    def cleanup(response):
        try:
            os.remove(output_path)
        except Exception as e:
            app.logger.warning(f"Failed to delete temp file: {e}")
        return response

    return send_file(output_path, mimetype="audio/wav")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
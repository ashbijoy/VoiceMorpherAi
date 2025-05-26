from flask import Flask, request, send_file, jsonify
import pyttsx3
import io
import os
from pydub import AudioSegment

app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({"status": "VoiceMorpherAI backend is running."})

@app.route("/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        text = data.get("text", "")
        voice = data.get("voice", "manu")

        if not text.strip():
            return jsonify({"error": "Text is required"}), 400

        engine = pyttsx3.init()
        voices = engine.getProperty("voices")

        # Voice selection logic (modify indexes if needed)
        if voice == "maya":
            engine.setProperty("voice", voices[1].id)  # female
        else:
            engine.setProperty("voice", voices[0].id)  # male

        # Save to temporary WAV file
        temp_wav_path = "temp_audio.wav"
        engine.save_to_file(text, temp_wav_path)
        engine.runAndWait()

        # Convert WAV to MP3 in-memory
        sound = AudioSegment.from_wav(temp_wav_path)
        buffer = io.BytesIO()
        sound.export(buffer, format="mp3")
        buffer.seek(0)

        # Clean up the temp file
        os.remove(temp_wav_path)

        return send_file(buffer, mimetype="audio/mpeg")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
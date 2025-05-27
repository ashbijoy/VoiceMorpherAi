from flask import Flask, request, send_file, jsonify
from flask_cors import CORS  
from gtts import gTTS
from TTS.api import TTS
import os
import io
import tempfile

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # Allow uploads up to 20 MB
CORS(app)  # ✅ Enable CORS for all routes

# Initialize Coqui TTS model once for cloning
voice_cloner = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts", progress_bar=False, gpu=False)

@app.route("/")
def home():
    return jsonify({"status": "VoiceMorpherAI backend is live ✅"})

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

@app.route("/clone", methods=["POST"])
def clone():
    try:
        if "audio" not in request.files or "text" not in request.form:
            return jsonify({"error": "Audio file and text are required"}), 400

        audio_file = request.files["audio"]
        text = request.form["text"]

        # Save uploaded audio temporarily
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            speaker_wav_path = tmp.name
            audio_file.save(speaker_wav_path)

        output_path = os.path.join(tempfile.gettempdir(), "cloned_output.wav")

        # Generate cloned voice audio
        voice_cloner.tts_to_file(
            text=text,
            speaker_wav=speaker_wav_path,
            language="en",
            file_path=output_path
        )

        with open(output_path, "rb") as f:
            return send_file(
                io.BytesIO(f.read()),
                mimetype="audio/wav",
                download_name="cloned.wav"
            )

    except Exception as e:
        print("Voice clone error:", e)
        return jsonify({"error": str(e)}), 500

port = int(os.environ.get("PORT", 10000))  # Render will set this
app.run(host="0.0.0.0", port=port)
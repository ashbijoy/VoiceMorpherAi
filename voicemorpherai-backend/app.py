from flask import Flask, request, send_file, jsonify
import requests
import io
import os

app = Flask(__name__)

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")  # Store in env var for safety

voice_map = {
    "maya": "EXAVITQu4vr4xnSDxMaL",  # Replace with your female voice ID
    "manu": "TxGEqnHWrfWFTfGW9XjX",  # Replace with your male voice ID
}

@app.route("/")
def home():
    return jsonify({"status": "VoiceMorpherAI ElevenLabs backend running ✅"})

@app.route("/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        text = data.get("text", "")
        voice = data.get("voice", "manu")

        if not text.strip():
            return jsonify({"error": "Text is required"}), 400

        voice_id = voice_map.get(voice.lower())
        if not voice_id:
            return jsonify({"error": "Invalid voice selection"}), 400

        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"
        response = requests.post(url, json=payload, headers=headers, stream=True)

        if response.status_code != 200:
            return jsonify({"error": "ElevenLabs error", "details": response.json()}), 500

        # Send the audio as a stream
        return send_file(
            io.BytesIO(response.content),
            mimetype="audio/mpeg",
            download_name="speech.mp3"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
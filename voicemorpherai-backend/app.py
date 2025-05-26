from flask import Flask, request, send_file
from flask_cors import CORS
from utils.tts import generate_tts
from utils.voice_clone import generate_voice_clone

app = Flask(__name__)
CORS(app)

@app.route("/tts", methods=["POST"])
def tts():
    data = request.json
    text = data.get("text")
    voice = data.get("voice")
    output_path = generate_tts(text, voice)
    return send_file(output_path, mimetype="audio/wav")

@app.route("/clone", methods=["POST"])
def clone():
    audio = request.files['audio']
    text = request.form['text']
    output_path = generate_voice_clone(audio, text)
    return send_file(output_path, mimetype="audio/wav")

if __name__ == "__main__":
    app.run(debug=True)
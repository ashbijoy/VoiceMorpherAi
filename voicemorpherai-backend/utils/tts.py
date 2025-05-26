import pyttsx3
from pydub import AudioSegment
import uuid
import os

def generate_tts(text, voice_name):
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[1].id if voice_name.lower() == 'maya' and len(voices) > 1 else voices[0].id)

    filename = f"tts_{uuid.uuid4().hex}.mp3"
    wav_filename = filename.replace(".mp3", ".wav")

    engine.save_to_file(text, filename)
    engine.runAndWait()

    sound = AudioSegment.from_file(filename)
    sound.export(wav_filename, format="wav")
    os.remove(filename)

    return wav_filename
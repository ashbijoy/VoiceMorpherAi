import pyttsx3
from pydub import AudioSegment
import uuid
import os

def generate_tts(text, voice_name):
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')

    if voice_name.lower() == 'maya':
        engine.setProperty('voice', voices[1].id if len(voices) > 1 else voices[0].id)
    else:
        engine.setProperty('voice', voices[0].id)

    temp_mp3 = f"tts_{uuid.uuid4().hex}.mp3"
    temp_wav = temp_mp3.replace(".mp3", ".wav")

    engine.save_to_file(text, temp_mp3)
    engine.runAndWait()

    sound = AudioSegment.from_mp3(temp_mp3)
    sound.export(temp_wav, format="wav")
    os.remove(temp_mp3)

    return temp_wav
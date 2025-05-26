from .tts import generate_tts

def generate_voice_clone(audio_file, text):
    # Simulate voice cloning by using TTS with 'manu' voice
    return generate_tts(text, "manu")
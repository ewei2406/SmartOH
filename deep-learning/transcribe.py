from google.oauth2 import service_account
from google.cloud import speech
import subprocess
from io import BytesIO
from pydub import AudioSegment


class AI:
    
    def __init__(self, video_path, credential_path):
        self.video_path = video_path
        self.credential_path = credential_path
        # self.audio_data = self._convert_video_to_audio()

        self.audio_data = AudioSegment.from_file(self.video_path, format="m4a")
        self.client = self._init_speech_client()

    def _convert_video_to_audio(self):
        process = subprocess.Popen(
            ['ffmpeg', '-i', self.video_path, '-f', 'wav', '-'],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        audio_data = BytesIO(stdout)
        audio_segment = AudioSegment.from_file(audio_data, format="wav")
        return audio_segment

    def _init_speech_client(self):
        credentials = service_account.Credentials.from_service_account_file(self.credential_path)
        client = speech.SpeechClient(credentials=credentials)
        return client

    def transcribe(self):
        # Prepare audio data for Google Cloud Speech-to-Text API
        audio_bytes = self.audio_data.raw_data
        audio = speech.RecognitionAudio(content=audio_bytes)
        
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=32000,
            language_code="en-US",
            model='video',
        )
        
        # Perform transcription
        response = self.client.recognize(config=config, audio=audio)
        
        transcripts = []
        for result in response.results:
            transcripts.append(result.alternatives[0].transcript)

        return ' '.join(transcripts)

# # Initialize the AI object
# ai = AI('./data/2.m4a', './data/sa_speech.json')

# # Perform transcription and print the result
# transcription_result = ai.transcribe()
# print(transcription_result)
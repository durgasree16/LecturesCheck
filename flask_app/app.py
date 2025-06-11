from flask import Flask, request, jsonify
import os
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
import torch
import PyPDF2
import io
import speech_recognition as sr
from moviepy.editor import VideoFileClip
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

def encode_text(text):
    inputs = tokenizer(text, return_tensors='pt', max_length=512, truncation=True, padding='max_length')
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()

def calculate_similarity(vector1, vector2):
    return cosine_similarity([vector1], [vector2])[0][0]

def extract_text_from_video(video_path):
    recognizer = sr.Recognizer()
    video_clip = VideoFileClip(video_path)
    audio_clip = video_clip.audio
    audio_path = "temp_audio.wav"
    audio_clip.write_audiofile(audio_path)

    with sr.AudioFile(audio_path) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
    
    video_clip.close()
    os.remove(audio_path)
    return text

@app.route('/extract_text', methods=['POST'])
def extract_text():
    if 'pdf_file' not in request.files or 'video_file' not in request.files:
        return jsonify({'error': 'Both PDF and video files are required'}), 400

    pdf_file = request.files['pdf_file']
    video_file = request.files['video_file']

    if pdf_file.filename == '' or video_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if pdf_file and pdf_file.filename.endswith('.pdf') and video_file:
        pdf_file_stream = io.BytesIO(pdf_file.read())
        pdf_reader = PyPDF2.PdfReader(pdf_file_stream)
        pdf_text = ''
        for page in pdf_reader.pages:
            pdf_text += page.extract_text()
        
        video_path = "temp_video.mp4"
        video_file.save(video_path)
        video_text = extract_text_from_video(video_path)

        # Ensure the video file is closed before attempting to delete it
        if os.path.exists(video_path):
            os.remove(video_path)

        # Encode texts using BERT
        video_vector = encode_text(video_text)
        pdf_vector = encode_text(pdf_text)

        # Calculate similarity
        similarity = calculate_similarity(video_vector, pdf_vector)
        return jsonify({'result': similarity * 100}), 200
    else:
        return jsonify({'error': 'Only PDF files and video files are supported'}), 400

if __name__ == '__main__':
    app.run(debug=True)

import os
from flask import Flask, request, jsonify, render_template
# import joblib
import transformers
import sqlite3
from flask_cors import CORS
import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from os.path import dirname
from gtts import gTTS
from googletrans import Translator
import gc         



app = Flask(__name__)
CORS(app)


# helper functions

def generate_sms(hedis_measure, from_age, to_age, response_type, prompt):
    # load model
    model_name = f'{dirname(__file__)}\\smsmodel'
    peft_model_id = f'{dirname(__file__)}\\smsmodel'
    config = PeftConfig.from_pretrained(peft_model_id)
    model = AutoModelForCausalLM.from_pretrained(config.base_model_name_or_path, return_dict=True, load_in_4bit=True, device_map='auto')
    tokenizer = AutoTokenizer.from_pretrained(config.base_model_name_or_path)
    # Load the Lora model
    model = PeftModel.from_pretrained(model, peft_model_id)
    batch = tokenizer(prompt, return_tensors='pt')
    batch = batch.to(torch.device('cuda'))
    with torch.cuda.amp.autocast():
        output = model.generate(**batch, max_new_tokens=360)
    res = tokenizer.decode(output[0])
    prepared_response = { 
        "type" : response_type, 
        "data" : res, 
    } 
    del model
    del tokenizer
    gc.collect()
    torch.cuda.empty_cache() 
    return prepared_response
  

def generate_email(hedis_measure, from_age, to_age, response_type, prompt):
    # load model
    model_name = f'{dirname(__file__)}\\smsmodel'
    peft_model_id = f'{dirname(__file__)}\\smsmodel'
    config = PeftConfig.from_pretrained(peft_model_id)
    model = AutoModelForCausalLM.from_pretrained(config.base_model_name_or_path, return_dict=True, load_in_4bit=True, device_map='auto')
    tokenizer = AutoTokenizer.from_pretrained(config.base_model_name_or_path)
    # Load the Lora model
    model = PeftModel.from_pretrained(model, peft_model_id)
    batch = tokenizer(prompt, return_tensors='pt')
    batch = batch.to(torch.device('cuda'))
    with torch.cuda.amp.autocast():
        output = model.generate(**batch, max_new_tokens=360)
    res = tokenizer.decode(output[0])
    prepared_response = { 
        "type" : response_type, 
        "data" : res, 
    } 
    del model
    del tokenizer
    gc.collect()
    torch.cuda.empty_cache() 
    return prepared_response

def generate_ivr(hedis_measure, response_type, prompt):
    # load model
    model_name = f'{dirname(__file__)}\\ivrmodel'
    peft_model_id = f'{dirname(__file__)}\\ivrmodel'
    config = PeftConfig.from_pretrained(peft_model_id)
    model = AutoModelForCausalLM.from_pretrained(config.base_model_name_or_path, return_dict=True, load_in_4bit=True, device_map='auto')
    tokenizer = AutoTokenizer.from_pretrained(config.base_model_name_or_path)
    # Load the Lora model
    model = PeftModel.from_pretrained(model, peft_model_id)
    batch = tokenizer(prompt, return_tensors='pt')
    batch = batch.to(torch.device('cuda'))
    with torch.cuda.amp.autocast():
        output = model.generate(**batch, max_new_tokens=360)
    res = tokenizer.decode(output[0])
    prepared_response = { 
        "type" : response_type, 
        "data" : res, 
    } 
    del model
    del tokenizer
    gc.collect()
    torch.cuda.empty_cache() 
    return prepared_response


DATABASE = 'database.db'

def connect_db():
    return sqlite3.connect(DATABASE)

# # API endpoint to get data from the Bucket table
# @app.route('/api/bucket', methods=['GET'])
# def get_bucket_data():
#     try:
#         conn = connect_db()
#         cursor = conn.cursor()

#         # Assuming the Bucket table has a 'name' column
#         cursor.execute('SELECT name FROM Bucket')
#         data = cursor.fetchall()

#         # Convert data to a list of names
#         bucket_names = [row[0] for row in data]

#         conn.close()

#         return jsonify({'bucket_names': bucket_names})

#     except Exception as e:
#         return jsonify({'error': str(e)})
    
# API endpoint to get data from the HedisMeasure table
@app.route('/api/hedis_measure', methods=['GET'])
def get_hedis_measure_data():
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Assuming the Bucket table has a 'name' column
        cursor.execute('SELECT name FROM HedisMeasure')
        data = cursor.fetchall()

        # Convert data to a list of names
        hedis_measure_names = [row[0] for row in data]

        conn.close()

        return jsonify({'hedis_measure_names': hedis_measure_names})

    except Exception as e:
        return jsonify({'error': str(e)})

# # Endpoint to create a new guide
# @app.route('/generate', methods=["POST"])
# def generate():
#     hedis_measure = request.json['hedis_measure']
#     bucket = request.json['bucket']
#     generate_type = request.json['type']

#     generate_type_str = str(generate_type)


#     response_data = {
#                 'hedis_measure': hedis_measure,
#                 'bucket': bucket,
#                 'generate_type': generate_type_str
#             }

#     return jsonify(response_data) 



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate',  methods=['GET'])
def generate():
    if request.method == 'GET':
        hedis_measure = request.args.get('hedis')
        from_age = request.args.get('from')
        to_age = request.args.get('to')
        response_type = request.args.get('type')

        if response_type == 'sms':
            prompt = f'Please write a sms for informing customer about {hedis_measure} whose  age From {from_age} To {to_age}'
            data = generate_sms(hedis_measure, from_age, to_age, response_type, prompt)
        elif response_type == 'email':
            prompt = f'Please write a email for informing customer about {hedis_measure} whose  age From {from_age} To {to_age}'
            data = generate_email(hedis_measure, from_age, to_age, response_type, prompt)
        else:
            prompt = f'### Please generate three questions for the customer having the following \n\n### Hedis Measure:\n{hedis_measure}\n'
            data = generate_ivr(hedis_measure, response_type, prompt)

    return jsonify(data) 

@app.route('/reset-memory')
def reset():
    pass

@app.route('/translation', methods=['GET'])
def translate():
    if request.method == 'GET':
        text_to_translate = request.args.get('text')
        # Create a Translator object
        translator = Translator()
        # Translate the text to Spanish
        translated_text = translator.translate(text_to_translate, src='en', dest='es')
        prepared_response = { 
            "type" : 'txt', 
            "data" : translated_text.text, 
        } 
    return jsonify(prepared_response)

@app.route('/generate-audio', methods=['GET'])
def genereate_audio():
    if request.method == 'GET':
        text_to_convert = request.args.get('text')
        translate_to = request.args.get('lang')
       
        # spanish
        if translate_to == 'es':
            language = 'es'
            # Create a gTTS object
            tts = gTTS(text=text_to_convert, lang=language, slow=False)
            # Save the audio file
            tts.save('output_audio_spanish.mp3')
            saved_path = f'{dirname(__file__)}\\output_audio_spanish.mp3'
        else:
            language = 'en'
            # Create a gTTS object
            tts = gTTS(text=text_to_convert, lang=language, slow=False)
            # Save the audio file
            tts.save('output_audio_english.mp3')
            saved_path = f'{dirname(__file__)}\\output_audio_english.mp3'

        prepared_response = { 
            "type" : 'message', 
            "data" : f'Audio save at location: {saved_path}', 
        } 

    return jsonify(prepared_response)


if __name__ == '__main__':
    app.run(port=5000)
import os
os.environ["KERAS_BACKEND"] = "theano"
import base64
import numpy as np
import io
from PIL import Image # PIL Python Image Lib

# from tensorflow import keras
# from tensorflow.keras.models import Sequential, load_model
# from tensorflow.keras.layers import Dense
# from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array
# from tensorflow.keras.optimizers import Adam

import tensorflow as tf

import keras
from keras import backend as K
from keras.models import Sequential
from keras.models import load_model
from keras.preprocessing.image import ImageDataGenerator
from keras.preprocessing.image import img_to_array

from flask import request
from flask import jsonify
from flask import Flask

urls = (
    '/', 'index',
    '/favicon.ico', 'icon'
)
# Process favicon.ico requests
class icon:
    def GET(self): raise web.seeother("/static/favicon.ico")

app = Flask(__name__)

def get_model():
    global model
    model = load_model('vgg16model.h5')
    print(" * Model loaded!")


def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)

    return image

print(" * Loading Keras model...")
get_model()  # load model to memery ahead of time, instead of each time a request made to to endpoint
# graph  = tf.get_default_graph() #"if 'class_name' not in config[0] or config[0]['class_name'] == 'Merge': KeyError: 0"


@app.route("/predict", methods=["POST"]) # post image to endpoint and get prediction
def predict():
    message = request.get_json(force=True)
    encoded = message['image'] # the json data from client with base64 image value
    decoded = base64.b64decode(encoded) # the decoded image data
    image = Image.open(io.BytesIO(decoded)) # create instance of PIL image by wrapping the decoded var in bytes
    processed_image = preprocess_image(image, target_size=(224, 224))
    
    # global graph ##
    # with graph.as_default(): ##
    #     prediction = model.predict(processed_image).tolist()
    prediction = model.predict(processed_image).tolist() # numpy array into python list

    response = {
        'prediction': {
            'control': prediction[0][0],
            'mutant': prediction[0][1]
        }
    }
    return jsonify(response)

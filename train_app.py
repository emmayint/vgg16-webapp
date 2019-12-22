import os
os.environ["KERAS_BACKEND"] = "theano"
import base64
import numpy as np
import io
from PIL import Image # PIL Python Image Lib

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

# dependencies for training
from keras.layers import Activation
from keras.layers.core import Dense, Flatten
from keras.optimizers import Adam, SGD
from keras.metrics import categorical_crossentropy
from keras.layers.normalization import BatchNormalization
from keras.layers.convolutional import *
import itertools
import matplotlib.pyplot as plt
print(K.image_data_format())
# get_ipython().run_line_magic('matplotlib', 'inline')

urls = (
    '/', 'index',
    '/favicon.ico', 'icon'
)
# Process favicon.ico requests
class icon:
    def GET(self): raise web.seeother("/static/favicon.ico")

app = Flask(__name__)


@app.route("/testFlask", methods=["POST"])
def testFlask():
    message = request.get_json(force=True)
    response = {
        "response": "hello from flask",
        "selectedModel": message['selectedModel'],
        "projectName": message['projectName'],
        "modelName": message['modelName']
    }
    return jsonify(response)


## TODO: add output layer####
@app.route("/train", methods=["POST"]) # post req (datasets path, params, model name) to endpoint and get trained model
def train():
    ## get http request and extract values
    message = request.get_json(force=True)
    ## TODO
    train_path = '' ## TODO "../allProject/projetName/datasets"; need "req.projetName"
    train_batches = ImageDataGenerator().flow_from_directory(train_path, target_size=(224,224), classes=['control', 'mutant'], batch_size=15) ## TODO customize batch_size
    # plots images with labels within jupyter notebook
    def plots(ims, figsize=(12,6), rows=1, interp=False, titles=None):
        if type(ims[0]) is np.ndarray:
            ims = np.array(ims).astype(np.uint8)
            if (ims.shape[-1] != 3):
                ims = ims.transpose((0,2,3,1))
        f = plt.figure(figsize=figsize)
        cols = len(ims)//rows if len(ims) % 2 == 0 else len(ims)//rows + 1
        for i in range(len(ims)):
            sp = f.add_subplot(rows, cols, i+1)
            sp.axis('Off')
            if titles is not None:
                sp.set_title(titles[i], fontsize=16)
            plt.imshow(ims[i], interpolation=None if interp else 'none')

    imgs, labels = next(train_batches)

    plots(imgs, titles=labels)


    # ## Build Fine-tuned VGG16 model
    vgg16_model = keras.applications.vgg16.VGG16()

    model = Sequential()
    for layer in vgg16_model.layers[:-1]:
        model.add(layer)

    for layer in model.layers:
        layer.trainable = False

    model.add(Dense(2, activation='softmax')) ## TODO customize layer size 2 -> # of categories
    # model.summary()

    # ## Train the fine-tuned VGG16 model
    model.compile(Adam(lr=.0001), loss='categorical_crossentropy', metrics=['accuracy'])

    model.fit_generator(train_batches, steps_per_epoch=18, 
                        validation_data=valid_batches, validation_steps=10, epochs=15, verbose=2) ## TODO split train, valid, test
        ## TODO verbose? log to webpage

    # ## Predict using fine-tuned VGG16 model
    test_imgs, test_labels = next(test_batches) ## TODO ../allProject/projetName/testsets; need "req.projetName"
    plots(test_imgs, titles=test_labels)

    test_labels = test_labels[:,0]
    test_labels

    # Returns the loss value & metrics values for the model in test mode with !! OUT OF SAMPLE !! data.
    test_loss, test_acc = model.evaluate_generator(test_batches, steps=10, verbose=0)  # evaluate the out of sample data with model
    print(test_loss)  # model's loss (error)
    print(test_acc)  # model's accuracy

    # ## Save the fine-tuned VGG16 model TODO save to ../allProject/projetName/model as h5? put flask_predict inside webapp-train?
    # ## rename to request.modelname
    model.save('model/VGG16.model')

# predict logic
def get_model():
    global model
    model = load_model('vgg16-1.h5')
    # model = load_model('vgg16model.h5')
    print(" * Model loaded!")

def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)

    return image
    
@app.route("/predict", methods=["POST"]) # post image to endpoint and get prediction
# print(" * Loading model for training...")
# get_model()  
# graph  = tf.get_default_graph() #"if 'class_name' not in config[0] or config[0]['class_name'] == 'Merge': KeyError: 0"

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

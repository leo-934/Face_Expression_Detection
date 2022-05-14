import detection.expression as ex
from flask import Flask
from flask import request
import numpy as np
from PIL import Image
import io, cv2

app = Flask(__name__)

@app.route("/getExpression", methods=['POST'])
def get_frame():

    f = request.files['file']
    img = cv2.imdecode(np.frombuffer(f.stream.read(), np.uint8), cv2.IMREAD_COLOR)
    return ex.getExpression(img)

app.run(host='0.0.0.0', port=81)
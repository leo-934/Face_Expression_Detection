import detection.expression as ex
from flask import Flask
from flask import request
from flask import jsonify, make_response
import numpy as np
from PIL import Image
import io, cv2

app = Flask(__name__)

@app.route("/getExpression", methods=['POST'])
def get_expression():

    try:
        f = request.files['file']
        img = cv2.imdecode(np.frombuffer(f.stream.read(), np.uint8), cv2.IMREAD_COLOR)
        res = ex.getExpression(img)
    except:
        return make_response(jsonify({'data': None, 'status': 0, 'error': 'Something is wrong'}), 0)
    
    return make_response(jsonify({'data': res, 'status': 200, 'error': None}), 200)

app.run(host='0.0.0.0', port=81)
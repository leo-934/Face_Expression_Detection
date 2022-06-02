from urllib import response
import detection.expression as ex
from flask import Flask
from flask import request
from flask import jsonify, make_response
from flask_cors import CORS
import numpy as np
import cv2

app = Flask(__name__)
CORS(app, resources={r"/*"})


@app.route("/getExpression", methods=['POST'])
async def get_expression():
    response = await handle_pic_get_expression(request)
    return response


async def handle_pic_get_expression(request):
    try:
        f = request.files['file']
        img = cv2.imdecode(np.frombuffer(
            f.stream.read(), np.uint8), cv2.IMREAD_COLOR)
        res = ex.getExpression(img)
        print(res)
    except Exception as e:
        print('err: ', e)
        return make_response(jsonify({'data': None, 'status': 0, 'error': 'Something is wrong'}), 0)

    response = jsonify({'data': res, 'status': 200, 'error': None})
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST'
    response.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return make_response(response, 200)


app.run(host='0.0.0.0', port=81)

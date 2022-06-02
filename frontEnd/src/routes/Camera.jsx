import { dataToFile } from '../utils/actions';
import Header from '../components/Header';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function App() {
  const webcamRef = useRef(null);
  const captureRef = useRef(null);

  const [imgSrc, setImgSrc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const capture = () => {
    // Something wrong with the camera
    if (!webcamRef || !webcamRef.current) {
      toast.error('Check your camera.');
      return;
    }
    const imgSrc = webcamRef.current.getScreenshot();

    const file = dataToFile(imgSrc, 'Face');
    const data = new FormData();
    data.append('file', file, file.name);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    };

    axios
      .post('http://127.0.0.1:81/getExpression', data, config)
      .then((response) => {
        const res = response.data.data;
        if (res === 0 || res === 'unknown') {
          setImgSrc('');
        } else {
          setImgSrc('./emojis/' + response.data.data + '.svg');
        }
      }).catch((err) => {
        toast.error(err);
      });
  };

  const startTimer = () => {
    // Get a screenshot every 3 second
    const timer = setInterval(() => {
      capture();
    }, 3000);
    captureRef.current = timer;
  };

  const clearTimer = () => {
    // Stop collecting screenshots
    clearInterval(captureRef.current);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header/>
      <div className="flex-1 w-full px-20">

        <div className="text-3xl font-bold mb-12">
          Camera Mode.
        </div>

        <div className="flex w-full items-center justify-between">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-96 h-96"
          />

          <div
            className="cursor-pointer font-bold text-xl"
            onClick={() => {
              isGenerating ? clearTimer() : startTimer();
              setIsGenerating(!isGenerating);
            }}
          >
            {isGenerating ? 'Stop' : 'Start'}
          </div>

          <div className="w-96 h-96">
            {
              imgSrc ?
                <img src={imgSrc} alt="" /> :
                'No Face Detected'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

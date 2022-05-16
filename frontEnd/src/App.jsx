import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { dataToFile } from "./actions";
import axios from "axios";

export default function App() {
  const webcamRef = useRef(null);
  const captureRef = useRef(null);

  const [imgSrc, setImgSrc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [emotion, setEmotion] = useState(0);

  const capture = useCallback(() => {
    // Something wrong with the camera
    if (!webcamRef || !webcamRef.current) {
      toast.error("Check your camera.");
      return;
    }
    const imgSrc = webcamRef.current.getScreenshot();
    setImgSrc(imgSrc);
    const file = dataToFile(imgSrc, "Face");
    const data = new FormData();
    data.append("file", file, file.name);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post("http://127.0.0.1:81/getExpression", data, config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {});
  }, [webcamRef, setImgSrc]);

  const startTimer = () => {
    // Get a screenshot every second
    const timer = setInterval(() => {
      capture();
    }, 5000);
    captureRef.current = timer;
  };

  const clearTimer = () => {
    // Stop collecting screenshots
    clearInterval(captureRef.current);
  };

  return (
    <div className="app">
      <Toaster />
      <div className="container">
        {/* Camera */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="web-camere"
        />

        {/* Button */}
        <button
          onClick={() => {
            if (isGenerating) {
              clearTimer();
            } else {
              startTimer();
            }
            setIsGenerating(!isGenerating);
          }}
        >
          {isGenerating ? "Stop" : "Start"}
        </button>

        {/* Result */}
        {isGenerating ? (
          imgSrc ? (
            <div className="result">
              <img src={imgSrc} alt="img" />
            </div>
          ) : (
            <div className="result">Generating...</div>
          )
        ) : (
          <div className="result">Waiting...</div>
        )}
      </div>
    </div>
  );
}

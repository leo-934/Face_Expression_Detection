import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import ImageUploading from "react-images-uploading";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import { dataToFile } from "./actions";
import axios from "axios";

export default function App() {
  const webcamRef = useRef(null);
  const captureRef = useRef(null);

  const [mode, setMode] = useState(0);

  const [imgSrc, setImgSrc] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [uploadImage, setUploadImage] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);

  const handleUploading = (image) => {
    setUploadImage(image);
    setUploadUrl(image[0].data_url);
  };

  const sendData = () => {
    const file = dataToFile(uploadUrl, "Face");
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
        const res = response.data.data;
        console.log(res);
        if (res === 0 || res === "unknown") {
          setImgSrc("./noFace.jpg");
        }
        else {
          setImgSrc("./emojis/" + response.data.data + ".svg");
        }
      }).catch((err) => {
        toast.error('Something went wrong. Please try again.');
      })
  };

  const capture = useCallback(() => {
    // Something wrong with the camera
    if (!webcamRef || !webcamRef.current) {
      toast.error("Check your camera.");
      return;
    }
    const imgSrc = webcamRef.current.getScreenshot();

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
        const res = response.data.data;
        if (res === 0 || res === "unknown") {
          setImgSrc("./noFace.jpg");
        } else {
          setImgSrc("./emojis/" + response.data.data + ".svg");
        }
      }).catch((err) => {
        toast.error('Something went wrong. Please try again.');
      })
  }, [webcamRef]);

  const startTimer = () => {
    // Get a screenshot every second
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
    <div className="app">
      <Toaster />
      <div className="container">
        {mode ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="web-camera"
          />
        ) : (
          <ImageUploading
            value={uploadImage}
            onChange={handleUploading}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload }) => (
              <div className="upload">
                <button className="upload-button" onClick={onImageUpload}>
                  Upload or drag an image here.
                </button>
                {imageList.map((image, index) => (
                  <img
                    className="upload-image"
                    key={index}
                    src={image.data_url}
                    alt="img"
                  />
                ))}
              </div>
            )}
          </ImageUploading>
        )}

        {mode ? (
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
        ) : (
          <button onClick={sendData}>Confirm</button>
        )}

        <button
          onClick={() => {
            setMode(1 - mode);
          }}
        >
          Mode
        </button>

        {imgSrc ? (
          <div className="result">
            <img src={imgSrc} alt="img" />
          </div>
        ) : (
          <div className="result">Current mode: {mode ? "Video" : "Image"}</div>
        )}
      </div>
    </div>
  );
}

import { dataToFile } from '../utils/actions';
import Header from '../components/Header';
import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function App() {
  const [imgSrc, setImgSrc] = useState('');

  const [uploadImage, setUploadImage] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(null);

  const handleUploading = (image) => {
    setUploadImage(image);
    setUploadUrl(image[0].data_url);
  };

  const sendData = () => {
    const file = dataToFile(uploadUrl, 'Face');
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
        console.log(res);
        setImgSrc('./emojis/' + response.data.data + '.svg');
      }).catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header/>
      <div className="flex-1 w-full px-20">
        <div className="text-3xl font-bold mb-12">
          Camera Mode.
        </div>
        <div className="flex w-full items-center justify-between">

          <ImageUploading
            value={uploadImage}
            onChange={handleUploading}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload }) => (
              <div className="w-96 flex flex-col justify-center items-center">
                <div
                  className="text-lg font-bold mb-6 cursor-pointer"
                  onClick={onImageUpload}
                >
                  Upload image here.
                </div>
                {imageList.map((image, index) => (
                  <img
                    className="w-64 h-64"
                    key={index}
                    src={image.data_url}
                    alt="img"
                  />
                ))}
              </div>
            )}
          </ImageUploading>

          <div
            className="cursor-pointer font-bold text-xl"
            onClick={() => { sendData(); }}
          >
            Confirm
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

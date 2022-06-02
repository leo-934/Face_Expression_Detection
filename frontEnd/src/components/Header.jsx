import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-between items-center w-full mb-8 px-12
    border-b-2 border-black shadow-lg">

      <div
        style={textStyle}
        className="py-4 text-2xl"
        onClick={()=>{navigate('/');}}
      >
        Face to Emoji
      </div>

      <div className="flex w-1/3 h-full rounded-full text-sm items-center">

      </div>

      <div className="flex items-center h-full">
        <div className="flex items-center h-full">
          <div
            className="mx-4 hover:border-b-2 border-black"
            style={textStyle}
            onClick={()=>{navigate('/camera');}}
          >
            Camera
          </div>

          <div
            className="mx-4 hover:border-b-2 border-black"
            style={textStyle}
            onClick={()=>{navigate('/upload');}}
          >
            Upload
          </div>
        </div>
      </div>

    </div>
  );
}

const textStyle = {
  fontWeight: 'bold',
  cursor: 'pointer',
};

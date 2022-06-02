import Header from '../components/Header';
import React from 'react';
export default function Home() {
  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div
        className="flex-1 w-full flex flex-col items-center">
        <div className="text-4xl font-bold mb-20">
          Welcome to Face to Emoji
        </div>
        <div className="text-2xl font-bold mb-12">
          Created by:
        </div>
        <div className="text-xl font-bold mb-36">
          陆天 | 王佳宁 | 夏宇航
        </div>
        <div className="mb-2">
          How to use:
        </div>
        <div>
          There are 2 modes for this project:
        </div>
        <div>
          1. Camera: Use web camera to capture user face.
        </div>
        <div>
          2. Upload: Upload a local image.
        </div>
      </div>
    </div>
  );
}

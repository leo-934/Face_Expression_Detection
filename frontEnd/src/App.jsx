import Home from './routes/Home';
import Camera from './routes/Camera';
import Upload from './routes/Upload';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function App() {

  return (
    <div className="w-full h-full font-sans bg-primary-brown">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

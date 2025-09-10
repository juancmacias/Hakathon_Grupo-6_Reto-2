// src/CameraCapture.js
import React, { useRef, useEffect, useState } from 'react';

const CameraCapture = ({ onCameraReady, onCameraError }) => {
  const videoRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState('Esperando acceso a la cámara...');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoadingMessage('¡Cámara lista!');
        onCameraReady();
      } catch (error) {
        setLoadingMessage('Error al acceder a la cámara. Revisa tus permisos.');
        onCameraError(error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCameraReady, onCameraError]);

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
      <p>{loadingMessage}</p>
    </div>
  );
};

export default CameraCapture;
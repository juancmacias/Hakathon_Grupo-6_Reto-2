// src/LocationManager.js
import React, { useEffect, useRef } from 'react';

const LocationManager = ({ onLocationUpdate, onLocationError, isReducedMobility }) => {
  const watchId = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      onLocationError('Tu navegador no soporta la geolocalización.');
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      onLocationUpdate({ latitude, longitude, isReducedMobility });
    };

    const handleError = (error) => {
      let errorMessage = 'Error al buscar tu ubicación.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permiso denegado. El Ratoncito Pérez no puede encontrarte.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Ubicación no disponible.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado.';
          break;
      }
      onLocationError(errorMessage);
    };

    watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [onLocationUpdate, onLocationError, isReducedMobility]);

  return null;
};

export default LocationManager;
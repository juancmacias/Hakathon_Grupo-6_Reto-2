import React, { useState } from 'react';
import './App.css';
import LocationManager from './components/LocationManager';
import CameraCapture from './components/CameraCapture';
import AgentMessage from './components/AgentMessage';

const App = () => {
  // Estado para la comunicación con el usuario y el backend
  const [appState, setAppState] = useState('ready'); // 'ready', 'loading', 'camera'
  const [agentResponse, setAgentResponse] = useState('');
  // La variable de estado isReducedMobility y su función de actualización
  const [isReducedMobility, setIsReducedMobility] = useState(false);

  // Función que se activa con cada actualización de ubicación
  const handleLocationUpdate = async (coords) => {
    if (appState === 'loading') return; // Evita múltiples llamadas mientras se carga
    setAppState('loading');

    try {
      // Envía las coordenadas y el estado de movilidad al backend
      const response = await fetch('/api/ubicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor. El Ratoncito Pérez está en apuros.');
      }

      const data = await response.json();
      setAgentResponse(data.message);

      // Si el backend envía una acción para activar la cámara
      if (data.action === 'activate_camera') {
        setAppState('camera');
      } else {
        setAppState('ready');
      }

    } catch (error) {
      console.error('Error de conexión:', error);
      setAgentResponse('Error de conexión. Intenta de nuevo.');
      setAppState('ready');
    }
  };

  // Función para manejar errores de geolocalización
  const handleLocationError = (msg) => {
    setAgentResponse(msg);
    setAppState('ready');
  };

  // Función para manejar el estado de la cámara
  const handleCameraReady = () => {
    console.log('Cámara lista para la magia.');
  };

  // Función para manejar errores de la cámara
  const handleCameraError = (error) => {
    console.error('Error de la cámara:', error);
    setAgentResponse('No pudimos acceder a la cámara. Lo siento, la magia está en pausa.');
    setAppState('ready');
  };

  // Función para cambiar el estado de movilidad
  const toggleMobility = () => {
    setIsReducedMobility(!isReducedMobility);
  };

  return (
    <div className="app-container">
      <h1>Aventura Mágica con el Ratoncito Pérez</h1>

      {/* Componente para manejar la geolocalización */}
      <LocationManager 
        onLocationUpdate={handleLocationUpdate}
        onLocationError={handleLocationError}
        isReducedMobility={isReducedMobility}
      />

      {/* Control para la opción de movilidad reducida */}
      <div className="options">
        <label>
          <input 
            type="checkbox" 
            checked={isReducedMobility} 
            onChange={toggleMobility} 
          />
          Movilidad Reducida ♿
        </label>
      </div>

      {/* Muestra la cámara solo cuando el estado lo requiera */}
      {appState === 'camera' && (
        <CameraCapture 
          onCameraReady={handleCameraReady} 
          onCameraError={handleCameraError} 
        />
      )}

      {/* Muestra mensajes de estado y del agente */}
      {appState === 'loading' && <p>Buscando al Ratoncito Pérez...</p>}
      
      {agentResponse && <AgentMessage message={agentResponse} />}
      
    </div>
  );
};

export default App;

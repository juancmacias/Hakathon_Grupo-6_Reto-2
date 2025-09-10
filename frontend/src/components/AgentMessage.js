// src/components/AgentMessage.js
import React from 'react';

const AgentMessage = ({ message }) => {
  if (!message) return null; // No renderiza nada si el mensaje está vacío

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeeba',
      borderRadius: '12px',
      padding: '12px 16px',
      margin: '15px auto',
      maxWidth: '400px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      color: '#856404'
    }}>
      🐭✨ {message}
    </div>
  );
};

export default AgentMessage;

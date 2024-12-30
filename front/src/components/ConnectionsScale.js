import React from 'react';

const ConnectionsScale = ({ greenConnections, purpleConnections }) => {
  const totalConnections = greenConnections + purpleConnections;

  return (
    <div
      style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          width: `${(greenConnections / totalConnections) * 100}%`,
          height: '100%',
          backgroundColor: '#008000', // Зелёный цвет
          display: 'inline-block',
        }}
      />
      <div
        style={{
          width: `${(purpleConnections / totalConnections) * 100}%`,
          height: '100%',
          backgroundColor: '#800080', // Фиолетовый цвет
          display: 'inline-block',
        }}
      />
    </div>
  );
};

export default ConnectionsScale;
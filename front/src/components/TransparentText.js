import React from 'react';

const TransparentText = ({ totalCenters, totalConnections }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.7)', // Полупрозрачный текст
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Полупрозрачный фон
        padding: '10px',
        borderRadius: '5px',
        backdropFilter: 'blur(5px)', // Размытие фона
      }}
    >
      
      Каталогизатор философов с античности до современности
      <span style={{ marginLeft: '10px' }}>{totalCenters}</span> Философов
      <span style={{ marginLeft: '10px' }}>{totalConnections}</span> Связей между философами
    </div>
  );
};

export default TransparentText;
import React, { useState } from 'react';
import ConnectionsScale from './ConnectionsScale';

const PhilosophersList = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Фильтруем философов с хотя бы одной связью
  const filteredData = data.filter((item) => {
    const influencedByCount = item.influenced_by ? item.influenced_by.split(',').length : 0;
    const influencedCount = item.influenced ? item.influenced.split(',').length : 0;
    return influencedByCount > 0 || influencedCount > 0;
  });

  // Сортируем по сумме всех связей (от наибольшего к наименьшему)
  const sortedData = filteredData.sort((a, b) => {
    const aConnections = (a.influenced_by ? a.influenced_by.split(',').length : 0) + (a.influenced ? a.influenced.split(',').length : 0);
    const bConnections = (b.influenced_by ? b.influenced_by.split(',').length : 0) + (b.influenced ? b.influenced.split(',').length : 0);
    return bConnections - aConnections;
  });

  // Подсчёт общего количества зелёных и фиолетовых связей
  const totalGreenConnections = data.reduce((acc, item) => acc + (item.influenced ? item.influenced.split(',').length : 0), 0);
  const totalPurpleConnections = data.reduce((acc, item) => acc + (item.influenced_by ? item.influenced_by.split(',').length : 0), 0);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px',
          backgroundColor: '#fff',
          border: '2px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isOpen ? 'Скрыть список' : 'Показать список философов'}
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: '5px',
            backgroundColor: '#fff',
            border: '2px solid #ccc',
            borderRadius: '5px',
            padding: '15px',
            maxHeight: '500px',
            overflowY: 'auto',
            width: '300px', // Фиксированная ширина для аккуратного отображения
          }}
        >
          {/* Шкала связей */}
          <ConnectionsScale
            greenConnections={totalGreenConnections}
            purpleConnections={totalPurpleConnections}
          />

          {/* Список философов */}
          {sortedData.map((item) => {
            const greenConnections = item.influenced ? item.influenced.split(',').length : 0;
            const purpleConnections = item.influenced_by ? item.influenced_by.split(',').length : 0;
            const totalConnections = greenConnections + purpleConnections;

            return (
              <div
                key={item.id}
                style={{
                  marginBottom: '10px',
                  padding: '1px',
                  borderBottom: '2px solid #eee', // Разделитель между элементами
                }}
              >
                <strong>{item.person_name}</strong>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  {item.short_description}
                </p>
                <ConnectionsScale
                  greenConnections={greenConnections}
                  purpleConnections={purpleConnections}
                />
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>
                  Всего связей: {totalConnections}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhilosophersList;
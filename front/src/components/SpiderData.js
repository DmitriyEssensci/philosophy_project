import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import SpiderWeb from './SpiderWeb';
import CenterDetailsModal from './CenterDetailsModal';
import TransparentText from './TransparentText';
import PhilosophersList from './PhilosophersList';

const SpiderData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    console.log('Компонент SpiderData смонтирован или обновлён');
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.24.32.172:9000/data/api/philosophers/minimal/');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        const philosophers = await response.json();

        // Вычисляем координаты x и y для каждого философа
        const processedData = philosophers.map((philosopher, index, array) => ({
          ...philosopher,
          x: 400 + Math.cos((index / array.length) * 2 * Math.PI) * 300,
          y: 400 + Math.sin((index / array.length) * 2 * Math.PI) * 300,
        }));

        setData(processedData);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCenterDoubleClick = async (center) => {
    try {
      const response = await fetch(`http://172.24.32.172:9000/data/api/philosophers/${center.id}/`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных');
      }
      const fullData = await response.json();
      setSelectedCenter(fullData);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedCenter(null);
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

   // Подсчёт количества центров и связей
   const totalCenters = data.length;
   const totalConnections = data.reduce((acc, item) => acc + (item.influenced_by ? item.influenced_by.split(',').length : 0) + (item.influenced ? item.influenced.split(',').length : 0), 0);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Текст слева сверху */}
      <TransparentText totalCenters={totalCenters} totalConnections={totalConnections} />

      {/* Основное поле с паутиной */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <TransformWrapper key="transform-wrapper" doubleClick={{ disabled: true }}>
          <TransformComponent>
            <SpiderWeb
              data={data}
              onCenterClick={() => {}}
              onCenterDoubleClick={handleCenterDoubleClick}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Вкладка справа снизу */}
      <PhilosophersList data={data} />

      {/* Модальное окно с деталями */}
      {selectedCenter && (
        <CenterDetailsModal center={selectedCenter} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SpiderData;
import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import SpiderWeb from './SpiderWeb';
import CreateCenterForm from './CreateCenterForm';
import CenterDetailsModal from './CenterDetailsModal';

const SpiderData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    console.log('Загрузка данных с сервера...');
    fetch('http://localhost:9000/data/api/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        return res.json();
      })
      .then((response) => {
        console.log('Данные получены:', response);
        const rawData = response.objects;

        if (Array.isArray(rawData)) {
          const processedData = rawData
            .filter((item) => item.person_name !== 'string')
            .map((item, index, array) => ({
              ...item,
              x: 400 + Math.cos((index / array.length) * 2 * Math.PI) * 300,
              y: 400 + Math.sin((index / array.length) * 2 * Math.PI) * 300,
            }));
          console.log('Обработанные данные:', processedData);
          setData(processedData);
        } else {
          throw new Error('Данные не являются массивом');
        }
      })
      .catch((err) => {
        console.error('Ошибка при загрузке данных:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateCenter = (newCenter) => {
    console.log('Создание нового центра:', newCenter);
    fetch('http://localhost:9000/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCenter),
    })
      .then((res) => res.json())
      .then((newItem) => {
        console.log('Новый центр создан:', newItem);
        const newData = [
          ...data,
          {
            ...newItem,
            x: 400 + Math.cos((data.length / (data.length + 1)) * 2 * Math.PI) * 300,
            y: 400 + Math.sin((data.length / (data.length + 1)) * 2 * Math.PI) * 300,
          },
        ];
        setData(newData);
      })
      .catch((err) => {
        console.error('Ошибка при создании центра:', err);
        setError(err.message);
      });
  };

  const handleCenterClick = (center) => {
    console.log('Выбран центр:', center);
    alert(`Выбран центр: ${center.person_name}`);
  };

  const handleCenterDoubleClick = (center) => {
    console.log('Двойной клик на центр:', center); // Отладочный вывод
    setSelectedCenter(center);
  };

  const handleCloseModal = () => {
    setSelectedCenter(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Основное поле с паутиной */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <TransformWrapper
          doubleClick={{ disabled: true }} // Отключаем обработку двойного клика
        >
          <TransformComponent>
            <SpiderWeb
              data={data}
              onCenterClick={handleCenterClick}
              onCenterDoubleClick={handleCenterDoubleClick}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Боковое окно с формой */}
      <div style={{ width: '7cm', padding: '20px', borderLeft: '1px solid #ccc' }}>
        <CreateCenterForm onSubmit={handleCreateCenter} />
      </div>

      {/* Модальное окно */}
      {selectedCenter && (
        <CenterDetailsModal center={selectedCenter} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SpiderData;
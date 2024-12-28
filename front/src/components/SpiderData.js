import React, { useState, useEffect } from 'react';
import SpiderWeb from './SpiderWeb';
import CreateCenterForm from './CreateCenterForm';

const SpiderData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Загрузка данных с сервера...'); // Отладочный вывод
    fetch('http://localhost:9000/data/api/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        return res.json();
      })
      .then((response) => {
        console.log('Данные получены:', response); // Отладочный вывод

        // Извлекаем массив objects из ответа
        const rawData = response.objects;

        if (Array.isArray(rawData)) {
          // Фильтруем и обрабатываем данные
          const processedData = rawData
            .filter((item) => item.person_name !== 'string') // Игнорируем некорректные записи
            .map((item, index, array) => ({
              id: item.id,
              person_name: item.person_name,
              years_life: item.years_life,
              school_teaching: item.school_teaching,
              person_teacher: item.person_teacher !== 'string' ? item.person_teacher : null,
              person_followers: item.person_followers !== 'string' ? item.person_followers : null,
              // Добавляем координаты для рендеринга
              x: Math.cos((index / array.length) * 2 * Math.PI) * 300,
              y: Math.sin((index / array.length) * 2 * Math.PI) * 300,
            }));
          console.log('Обработанные данные:', processedData); // Отладочный вывод
          setData(processedData);
        } else {
          throw new Error('Данные не являются массивом');
        }
      })
      .catch((err) => {
        console.error('Ошибка при загрузке данных:', err); // Отладочный вывод
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateCenter = (newCenter) => {
    console.log('Создание нового центра:', newCenter); // Отладочный вывод
    fetch('http://localhost:9000/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCenter),
    })
      .then((res) => {
        return res.json();
      })
      .then((newItem) => {
        console.log('Новый центр создан:', newItem); // Отладочный вывод
        // Добавляем координаты для нового центра
        const newData = [
          ...data,
          {
            ...newItem,
            x: Math.cos((data.length / (data.length + 1)) * 2 * Math.PI) * 300,
            y: Math.sin((data.length / (data.length + 1)) * 2 * Math.PI) * 300,
          },
        ];
        setData(newData);
      })
      .catch((err) => {
        console.error('Ошибка при создании центра:', err); // Отладочный вывод
        setError(err.message);
      });
  };

  const handleCenterClick = (center) => {
    console.log('Выбран центр:', center); // Отладочный вывод
    alert(`Выбран центр: ${center.person_name}`);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <SpiderWeb data={data} onCenterClick={handleCenterClick} />
      </div>
      <div style={{ width: '300px', padding: '20px' }}>
        <CreateCenterForm onSubmit={handleCreateCenter} />
      </div>
    </div>
  );
};

export default SpiderData;
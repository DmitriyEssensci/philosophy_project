import React, { useEffect, useRef } from 'react';
import Sigma from 'sigma';
import { Graph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';

const SpiderWeb = ({ data, onCenterClick, onCenterDoubleClick }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('Данные для отрисовки:', data); // Отладочный вывод
    if (!data.length) return;

    // Создаем граф
    const graph = new Graph();

    // Добавляем узлы
    data.forEach((item) => {
      graph.addNode(item.id.toString(), { // Используем item.id как идентификатор узла
        label: item.person_name,
        x: item.x || Math.random() * 500,
        y: item.y || Math.random() * 500,
        size: 10,
        color: getColorBySchool(item.school_teaching),
      });
    });

    // Добавляем ребра
    const schoolMap = {};
    data.forEach((item) => {
      if (!schoolMap[item.school_teaching]) {
        schoolMap[item.school_teaching] = [];
      }
      schoolMap[item.school_teaching].push(item.id); // Используем id
    });

    Object.values(schoolMap).forEach((group) => {
      if (group.length > 1) {
        for (let i = 0; i < group.length - 1; i++) {
          for (let j = i + 1; j < group.length; j++) {
            graph.addEdge(group[i], group[j], {
              color: '#ccc',
            });
          }
        }
      }
    });

    // Инициализируем Sigma
    const sigmaInstance = new Sigma(graph, containerRef.current);

    // Применяем ForceAtlas2 layout
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 50 });

    // Обработка клика на узел
    sigmaInstance.on('clickNode', (event) => {
      const nodeId = event.node;
      const node = data.find((item) => item.id === nodeId); // Ищем по id
      if (node) onCenterClick(node);
    });

    // Обработка двойного клика на узел
    sigmaInstance.on('doubleClickNode', (event) => {
      try {
        event.preventSigmaDefault(); // Отключаем стандартное поведение зума
        const nodeId = event.node;
        console.log('Node ID:', nodeId); // Отладочный вывод
        const node = data.find((item) => item.id.toString() === nodeId); // Ищем по id
        console.log('Двойной клик на узел:', node); // Отладочный вывод
        if (node) onCenterDoubleClick(node);
      } catch (error) {
        console.error('Ошибка при обработке двойного клика:', error);
      }
    });

    return () => {
      sigmaInstance.kill();
    };
  }, [data, onCenterClick, onCenterDoubleClick]);

  const getColorBySchool = (school) => {
    const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'];
    const index = school?.length % colors.length || 0;
    return colors[index];
  };

  return <div ref={containerRef} style={{ width: '1600px', height: '900px', border: '10px solid #ccc' }} />;
};

export default SpiderWeb;
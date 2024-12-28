import React, { useEffect, useRef } from 'react';
import Sigma from 'sigma';
import { Graph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';

const SpiderWeb = ({ data, onCenterClick }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    // Создаем граф
    const graph = new Graph();

    // Добавляем узлы
    data.forEach((item) => {
      graph.addNode(item.id, {
        label: item.person_name,
        x: item.x,
        y: item.y,
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
      schoolMap[item.school_teaching].push(item.id);
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
      const nodeId = event.data.node;
      const node = data.find((item) => item.id === nodeId);
      if (node) onCenterClick(node);
    });

    return () => {
      sigmaInstance.kill();
    };
  }, [data, onCenterClick]);

  const getColorBySchool = (school) => {
    const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'];
    const index = school?.length % colors.length || 0;
    return colors[index];
  };

  return <div ref={containerRef} style={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />;
};

export default SpiderWeb;
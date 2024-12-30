import React, { useEffect, useRef } from 'react';
import Sigma from 'sigma';
import { Graph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';

const SpiderWeb = ({ data, onCenterClick, onCenterDoubleClick }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data.length) return;

    // console.log('Данные для отрисовки:', data); // Отладочный вывод

    const graph = new Graph({ multi: true }); // Создаём мультиграф

    // Добавляем узлы
    data.forEach((item) => {
      graph.addNode(item.id.toString(), {
        label: item.person_name,
        x: item.x,
        y: item.y,
        size: 5,
        color: getColorBySchool(item.school_teaching),
      });
    });

    // Функция для разбиения строки на массив имён
    const splitNames = (names) => {
      if (!names) return [];
      return names.split(',').map((name) => name.trim().toLowerCase());
    };

    

    // Добавляем рёбра на основе influenced_by и influenced
    data.forEach((sourceItem) => {
      const sourceId = sourceItem.id.toString();
      const sourceName = sourceItem.person_name.trim().toLowerCase();

      data.forEach((targetItem) => {
        const targetId = targetItem.id.toString();

        // Обрабатываем influenced_by (фиолетовые рёбра)
        if (targetItem.influenced_by) {
          const influencedByNames = splitNames(targetItem.influenced_by);
          // console.log(`Проверка influenced_by для ${targetItem.person_name}:`, influencedByNames);

          if (influencedByNames.includes(sourceName)) {
            // console.log(`Добавлено фиолетовое ребро от ${sourceName} к ${targetItem.person_name}`);
            graph.addEdge(sourceId, targetId, { color: '#800080' });
          }
        }

        // Обрабатываем influenced (зелёные рёбра)
        if (targetItem.influenced) {
          const influencedNames = splitNames(targetItem.influenced);
          // console.log(`Проверка influenced для ${targetItem.person_name}:`, influencedNames);

          if (influencedNames.includes(sourceName)) {
            // console.log(`Добавлено зелёное ребро от ${targetItem.person_name} к ${sourceName}`);
            graph.addEdge(targetId, sourceId, { color: '#008000' });
          }
        }
      });
    });

    // console.log('Узлы графа:', graph.nodes()); // Отладочный вывод
    // console.log('Рёбра графа:', graph.edges()); // Отладочный вывод

    // Инициализируем Sigma
    const sigmaInstance = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: false,
      enableEdgeHoverEvents: false,
      enableEdgeClickEvents: false,
    });

    // console.log('Sigma инициализирован:', sigmaInstance); // Отладочный вывод

    // Применяем ForceAtlas2 с меньшим количеством итераций
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 20 });

    // Обработка событий
    sigmaInstance.on('clickNode', (event) => {
      const node = data.find((item) => item.id.toString() === event.node);
      if (node) onCenterClick(node);
    });

    sigmaInstance.on('doubleClickNode', (event) => {
      event.preventSigmaDefault();
      const node = data.find((item) => item.id.toString() === event.node);
      if (node) onCenterDoubleClick(node);
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

  return <div ref={containerRef} style={{ width: '2000px', height: '1200px', border: '1px solid #ccc' }} />;
};

export default React.memo(SpiderWeb);
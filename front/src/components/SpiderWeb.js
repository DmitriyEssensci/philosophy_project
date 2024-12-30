import React, { useEffect, useRef, useState } from 'react';
import Sigma from 'sigma';
import { Graph } from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { EdgeArrowProgram } from 'sigma/rendering';

const SpiderWeb = ({ data, onCenterClick, onCenterDoubleClick }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const hoverTimeoutRef = useRef(null); // Для хранения таймера задержки
  const sigmaInstanceRef = useRef(null); // Для хранения экземпляра Sigma
  const graphRef = useRef(null); // Для хранения графа
  const selectedNodeRef = useRef(null); // Для хранения выбранного узла

  useEffect(() => {
    if (!data.length) return;

    const graph = new Graph({ multi: true }); // Создаём мультиграф
    graphRef.current = graph; // Сохраняем граф в ref

    // Добавляем узлы
    data.forEach((item) => {
      graph.addNode(item.id.toString(), {
        label: item.person_name,
        x: item.x,
        y: item.y,
        size: 5,
        color: getColorBySchool(item.person_name), // Динамический цвет на основе имени
        highlighted: false, // Добавляем атрибут для подсветки
      });
    });

    // Функция для разбиения строки на массив имён
    const splitNames = (names) => {
      if (!names) return [];
      return names.split(',').map((name) => name.trim().toLowerCase());
    };

    // Функция для получения части строки до запятой
    const getNameBeforeComma = (name) => {
      return name.split(',')[0].trim().toLowerCase();
    };

    // Добавляем рёбра на основе influenced_by и influenced
    data.forEach((sourceItem) => {
      const sourceId = sourceItem.id.toString();
      const sourceName = getNameBeforeComma(sourceItem.person_name); // Берём часть до запятой

      data.forEach((targetItem) => {
        const targetId = targetItem.id.toString();

        // Обрабатываем influenced_by (фиолетовые рёбра)
        if (targetItem.influenced_by) {
          const influencedByNames = splitNames(targetItem.influenced_by);

          if (influencedByNames.some((name) => getNameBeforeComma(name) === sourceName)) {
            graph.addEdge(sourceId, targetId, {
              color: '#800080',
              type: 'arrow', // Добавляем тип стрелочки
              size: 0.5, // Толщина ребра
              highlighted: false, // Добавляем атрибут для подсветки
            });
          }
        }

        // Обрабатываем influenced (зелёные рёбра)
        if (targetItem.influenced) {
          const influencedNames = splitNames(targetItem.influenced);

          if (influencedNames.some((name) => getNameBeforeComma(name) === sourceName)) {
            graph.addEdge(targetId, sourceId, {
              color: '#008000',
              type: 'arrow', // Добавляем тип стрелочки
              size: 0.5, // Толщина ребра
              highlighted: false, // Добавляем атрибут для подсветки
            });
          }
        }
      });
    });

    // Динамическое изменение размера узлов в зависимости от количества связей
    graph.forEachNode((node) => {
      const degree = graph.degree(node);
      graph.setNodeAttribute(node, 'size', Math.log(degree + 1) * 3); // Уменьшаем размер узлов
    });

    // Инициализируем Sigma с поддержкой стрелочек
    const sigmaInstance = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: false,
      enableEdgeHoverEvents: true,
      enableEdgeClickEvents: false,
      edgeProgramClasses: {
        arrow: EdgeArrowProgram, // Используем программу для отрисовки стрелочек
      },
    });

    sigmaInstanceRef.current = sigmaInstance; // Сохраняем экземпляр Sigma

    // Настройка ForceAtlas2
    const settings = forceAtlas2.inferSettings(graph);
    settings.adjustSizes = true; // Учитываем размеры узлов
    settings.scalingRatio = 50; // Увеличиваем масштаб
    settings.gravity = 100; // Уменьшаем гравитацию для более равномерного распределения
    settings.strongGravityMode = false; // Включаем сильную гравитацию

    // Применяем ForceAtlas2 для динамического расположения узлов
    forceAtlas2.assign(graph, { settings, iterations: 1000 }); // Увеличиваем количество итераций

    // Обработка событий
    sigmaInstance.on('clickNode', (event) => {
      const node = event.node;
      selectedNodeRef.current = node; // Сохраняем выбранный узел

      // Выделяем связи и зависимые центры
      const neighbors = graph.neighbors(node);
      const edges = graph.edges(node);

      // Затемняем все узлы и рёбра
      graph.forEachNode((n) => {
        graph.setNodeAttribute(n, 'hidden', true);
      });
      graph.forEachEdge((e) => {
        graph.setEdgeAttribute(e, 'hidden', true);
      });

      // Подсвечиваем узел и его соседей
      graph.setNodeAttribute(node, 'hidden', false);
      graph.setNodeAttribute(node, 'highlighted', true);
      neighbors.forEach((neighbor) => {
        graph.setNodeAttribute(neighbor, 'hidden', false);
        graph.setNodeAttribute(neighbor, 'highlighted', true);
      });

      // Подсвечиваем рёбра
      edges.forEach((edge) => {
        graph.setEdgeAttribute(edge, 'hidden', false);
        graph.setEdgeAttribute(edge, 'highlighted', true);
      });

      sigmaInstance.refresh();
    });

    sigmaInstance.on('doubleClickNode', (event) => {
      event.preventSigmaDefault();
      const node = data.find((item) => item.id.toString() === event.node);
      if (node) onCenterDoubleClick(node);
    });

    // Выделение связей при наведении на узел с задержкой
    sigmaInstance.on('enterNode', (event) => {
      // Очищаем предыдущий таймер
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Устанавливаем новый таймер
      hoverTimeoutRef.current = setTimeout(() => {
        const node = event.node;
        const neighbors = graph.neighbors(node);
        const edges = graph.edges(node);

        // Затемняем все узлы и рёбра
        graph.forEachNode((n) => {
          graph.setNodeAttribute(n, 'hidden', true);
        });
        graph.forEachEdge((e) => {
          graph.setEdgeAttribute(e, 'hidden', true);
        });

        // Подсвечиваем узел и его соседей
        graph.setNodeAttribute(node, 'hidden', false);
        graph.setNodeAttribute(node, 'highlighted', true);
        neighbors.forEach((neighbor) => {
          graph.setNodeAttribute(neighbor, 'hidden', false);
          graph.setNodeAttribute(neighbor, 'highlighted', true);
        });

        // Подсвечиваем рёбра
        edges.forEach((edge) => {
          graph.setEdgeAttribute(edge, 'hidden', false);
          graph.setEdgeAttribute(edge, 'highlighted', true);
        });

        sigmaInstance.refresh();
      }, 300); // Задержка 300 мс
    });

    // Сброс выделения при уходе с узла
    sigmaInstance.on('leaveNode', (event) => {
      // Очищаем таймер
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Если узел не выбран, сбрасываем выделение
      if (!selectedNodeRef.current) {
        graph.forEachNode((n) => {
          graph.setNodeAttribute(n, 'hidden', false);
          graph.setNodeAttribute(n, 'highlighted', false);
        });
        graph.forEachEdge((e) => {
          graph.setEdgeAttribute(e, 'hidden', false);
          graph.setEdgeAttribute(e, 'highlighted', false);
        });

        sigmaInstance.refresh();
      }
    });

    // Обработка клика в пустое пространство
    sigmaInstance.on('clickStage', () => {
      // Сбрасываем выделение всех узлов и рёбер
      selectedNodeRef.current = null; // Сбрасываем выбранный узел
      graph.forEachNode((n) => {
        graph.setNodeAttribute(n, 'hidden', false);
        graph.setNodeAttribute(n, 'highlighted', false);
      });
      graph.forEachEdge((e) => {
        graph.setEdgeAttribute(e, 'hidden', false);
        graph.setEdgeAttribute(e, 'highlighted', false);
      });

      sigmaInstance.refresh();
    });

    // Обновляем размеры Sigma при изменении размеров контейнера
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        sigmaInstance.refresh();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      sigmaInstance.kill();
      resizeObserver.disconnect();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [data, onCenterClick, onCenterDoubleClick]);

  // Функция для генерации динамического цвета на основе строки
  const getColorBySchool = (school) => {
    const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'];
    const index = school?.length % colors.length || 0;
    return colors[index];
  };

  return (
    <div>
      <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        border: '1px solid #ccc',
      }}
    />
    </div>
    
  );
};

export default React.memo(SpiderWeb);
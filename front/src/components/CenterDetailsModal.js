import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root');
  return ReactDOM.createPortal(children, modalRoot);
};

const CenterDetailsModal = ({ center, onClose }) => {
  useEffect(() => {
    // Обработчик для закрытия модального окна по нажатию на Escape
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Добавляем обработчик события keydown
    document.addEventListener('keydown', handleKeyDown);

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Обработчик для закрытия модального окна по клику вне его области
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!center) return null;

  return (
    <ModalPortal>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}
        onClick={handleBackdropClick} // Закрытие по клику вне модального окна
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            width: '300px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative', // Для позиционирования крестика
          }}
        >
          {/* Крестик для закрытия */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          <h3>Данные центра</h3>
          <p><strong>Имя персонажа:</strong> {center.person_name}</p>
          <p><strong>Период жизни:</strong> {center.period_life}</p>
          <p><strong>Дата рождения:</strong> {center.birth_date}</p>
          <p><strong>Дата смерти:</strong> {center.death_date}</p>
          <p><strong>Школа обучения:</strong> {center.school_teaching}</p>
          <p><strong>Учитель:</strong> {center.influenced_by}</p>
          <p><strong>Последователи:</strong> {center.influenced}</p>
          <p><strong>Работы:</strong> {center.person_works}</p>
          <p><strong>Краткое описание:</strong> {center.short_description}</p>
          <p><strong>Полное описание:</strong> {center.full_description}</p>
          <p><strong>Wiki страница:</strong> {center.wiki_url}</p>
          <p><strong>Wiki id публикации:</strong> {center.wiki_id}</p>
        </div>
      </div>
    </ModalPortal>
  );
};

export default React.memo(CenterDetailsModal);
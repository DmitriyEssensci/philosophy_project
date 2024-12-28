import React from 'react';

const CenterDetailsModal = ({ center, onClose }) => {
  if (!center) return null;

  return (
    <div style={{
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
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative', // Для позиционирования крестика
      }}>
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
        <p><strong>Годы жизни:</strong> {center.years_life}</p>
        <p><strong>Школа обучения:</strong> {center.school_teaching}</p>
        <p><strong>Учитель:</strong> {center.person_teacher}</p>
        <p><strong>Последователи:</strong> {center.person_followers}</p>
        <p><strong>Работы:</strong> {center.person_works}</p>
        <p><strong>Краткое описание:</strong> {center.short_description}</p>
        <p><strong>Полное описание:</strong> {center.full_description}</p>
      </div>
    </div>
  );
};

export default CenterDetailsModal;
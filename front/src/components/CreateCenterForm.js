import React, { useState } from 'react';

const CreateCenterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    person_name: '',
    years_life: '',
    school_teaching: '',
    period_life: '',
    person_teacher: '',
    person_followers: '',
    person_works: '',
    short_description: '',
    full_description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Создать новый центр</h3>
      <div>
        <label>Имя персонажа:</label>
        <input
          type="text"
          name="person_name"
          value={formData.person_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Годы жизни:</label>
        <input
          type="text"
          name="years_life"
          value={formData.years_life}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Школа обучения:</label>
        <input
          type="text"
          name="school_teaching"
          value={formData.school_teaching}
          onChange={handleChange}
          required
        />
      </div>
      {/* Опциональные поля */}
      <div>
        <label>Период жизни:</label>
        <input
          type="text"
          name="period_life"
          value={formData.period_life}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Учитель:</label>
        <input
          type="text"
          name="person_teacher"
          value={formData.person_teacher}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Создать</button>
    </form>
  );
};

export default CreateCenterForm;
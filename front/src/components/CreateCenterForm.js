import React, { useState } from 'react';

const CreateCenterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    person_name: '',
    birth_date: '',
    death_date: '',
    school_teaching: '',
    period_life: '',
    influenced: '',
    influenced_by: '',
    person_works: '',
    short_description: '',
    full_description: '',
    wiki_url: '',
    wiki_id: '',
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
        <label>Дата рождения:</label>
        <input
          type="text"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Дата рождения:</label>
        <input
          type="text"
          name="death_date"
          value={formData.death_date}
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
          name="influenced"
          value={formData.influenced}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Wiki страница:</label>
        <input
          type="text"
          name="wiki_url"
          value={formData.wiki_url}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Wiki id публикации:</label>
        <input
          type="text"
          name="wiki_id"
          value={formData.wiki_id}
          onChange={handleChange}
        />
      </div>
      <></>
      <button type="submit">Создать</button>
    </form>
  );
};

export default CreateCenterForm;
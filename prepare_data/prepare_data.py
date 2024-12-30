import pandas as pd
import json
import requests
from bs4 import BeautifulSoup

# Загрузка JSON-файла
with open('data/all_philo.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Извлечение данных
rows = [{'id': entry['id'], 'title': entry['title']} for entry in data['*'][0]['a']['*']]

df = pd.DataFrame(rows)
df['wikipedia_url'] = 'https://ru.wikipedia.org/wiki/' + df['title'].str.replace(',', '%2C')
df['title'] = df['title'].str.replace('_', ' ')

def get_infobox_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        infobox = soup.find('table', class_=lambda x: x and 'infobox' in x)
        if not infobox:
            return None, None, None, None, None, None

        birth_date, death_date, influenced_by, influenced, period_life, school_teaching = None, None, None, None, None, None

        for row in infobox.find_all('tr'):
            header = row.find('th')
            if not header:
                continue

            header_text = header.text.strip()
            data_cell = row.find('td')

            if 'Дата рождения' in header_text and data_cell:
                birth_date = data_cell.text.strip()
            elif 'Дата смерти' in header_text and data_cell:
                death_date = data_cell.text.strip()
            elif 'Оказавшие влияние' in header_text and data_cell:
                influenced_by = data_cell.text.strip()
            elif 'Испытавшие влияние' in header_text and data_cell:
                influenced = data_cell.text.strip()
            elif 'Период' in header_text and data_cell:
                period_life = data_cell.text.strip()
            elif 'Школа/традиция' in header_text and data_cell:
                school_teaching = data_cell.text.strip()

        return birth_date, death_date, influenced_by, influenced, period_life, school_teaching
    except Exception as e:
        print(f"Ошибка при обработке {url}: {e}")
        return None, None, None, None, None, None

# Применение функции к каждой строке
df[['birth_date', 'death_date', 'influenced_by', 'influenced', 'period_life', 'school_teaching']] = df['wikipedia_url'].apply(lambda x: pd.Series(get_infobox_data(x)))

# Сохранение данных
df.to_csv('data/all_philo.csv', index=False, encoding='utf-8-sig')
df.to_excel('data/all_philo.xlsx', index=False)

print(df)
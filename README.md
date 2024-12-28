# philosophy_project
Проект по стилизованной библиотеке по философии

![Версия 0.0.1](img/v0.0.1.png)

# Создангие проекта через npx:
npx create-react-app front

# Закидывание пакетов pip
pip3 freeze > requirements.txt

# Установка с пакетов pip
pip3 install -r requirements.txt

## Окружение:
- Swager: http://127.0.0.1:9000/docs#/
- Backend: http://127.0.0.1:9000/
- СУБД - postgres: 
    - postgresql://postgres:postgres@localhost:6432/postgres
- Frontend: http://127.0.0.1:4000/

# Запуск back:
- fastapi run main.py --port=9000 --host=localhost
    ИЛИ
- uvicorn main:app --port 9000 --host localhost --reload ## Предпочтительней т.к. есть авторелоад


# Запуск front:
- npm start
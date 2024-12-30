from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import pandas as pd
import logging
from .database import Base, engine, get_db
from .models import DataModel
from .schemas import DataObject, DataObjectUpdate

Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/data", tags=["data"])

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Создание объекта
@router.post("/")
def create_data_object(object: DataObject, db: Session = Depends(get_db)):
    try:
        new_data_object = DataModel(
            person_name=object.person_name,
            period_life=object.period_life,
            birth_date=object.birth_date,
            death_date=object.death_date,
            school_teaching=object.school_teaching,
            influenced_by=object.influenced_by,
            influenced=object.influenced,
            person_works=object.person_works,
            short_description=object.short_description,
            full_description=object.full_description,
            wiki_url=object.wiki_url,
            wiki_id=object.wiki_id,
            create_data=object.create_data,
        )
        db.add(new_data_object)
        db.commit()
        db.refresh(new_data_object)
        return {
            "message": "data object added successfully",
            "object": {
                "id": new_data_object.id,
                "person_name": new_data_object.person_name,
                "school_teaching": new_data_object.school_teaching,
                "short_description": new_data_object.short_description,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

# Удаление объекта
@router.delete("/{data_object_id}")
def delete_data_object(data_object_id: int, db: Session = Depends(get_db)):
    data_object = db.query(DataModel).filter(DataModel.id == data_object_id).first()
    if data_object is None:
        raise HTTPException(status_code=404, detail="Объект не найден")
    db.delete(data_object)
    db.commit()
    return {"message": "Объект удален"}

# Редактирование объекта
@router.put("/edit/{data_object_id}")
def edit_data_object(
    data_object_id: int, updated_object: DataObjectUpdate, db: Session = Depends(get_db)
):
    data_object = db.query(DataModel).filter(DataModel.id == data_object_id).first()
    if data_object is None:
        raise HTTPException(status_code=404, detail="Объект не найден")

    if updated_object.person_name is not None:
        data_object.person_name = updated_object.person_name
    if updated_object.period_life is not None:
        data_object.period_life = updated_object.period_life
    if updated_object.birth_date is not None:
        data_object.birth_date = updated_object.birth_date
    if updated_object.death_date is not None:
        data_object.death_date = updated_object.death_date
    if updated_object.school_teaching is not None:
        data_object.school_teaching = updated_object.school_teaching
    if updated_object.influenced_by is not None:
        data_object.influenced_by = updated_object.influenced_by
    if updated_object.influenced is not None:
        data_object.influenced = updated_object.influenced
    if updated_object.person_works is not None:
        data_object.person_works = updated_object.person_works
    if updated_object.short_description is not None:
        data_object.short_description = updated_object.short_description
    if updated_object.full_description is not None:
        data_object.full_description = updated_object.full_description
    if updated_object.wiki_url is not None:
        data_object.wiki_url = updated_object.wiki_url
    if updated_object.wiki_id is not None:
        data_object.wiki_id = updated_object.wiki_id

    db.commit()
    db.refresh(data_object)

    return {"message": "Объект обновлён", "object": data_object}

# Загрузка файла с данными
@router.post("/upload_file")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Проверка формата файла
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Файл должен быть в формате CSV")

    try:
        # Чтение CSV-файла
        df = pd.read_csv(file.file)

        # Замена пустых значений на None
        df = df.where(pd.notna(df), None)

        # Сопоставление колонок CSV с полями модели
        for _, row in df.iterrows():
            data_object = DataModel(
                person_name=row.get('title'),
                period_life=row.get('period_life'),
                birth_date=row.get('birth_date'),
                death_date=row.get('death_date'),
                school_teaching=row.get('school_teaching'),
                influenced_by=row.get('influenced_by'),
                influenced=row.get('influenced'),
                person_works=row.get('person_works'),
                short_description=row.get('short_description'),
                full_description=row.get('full_description'),
                wiki_url=row.get('wikipedia_url'),
                wiki_id=row.get('id'),
            )
            db.add(data_object)
        db.commit()

        return {"message": "Данные успешно загружены в СУБД"}
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при обработке файла: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке файла: {str(e)}")
    finally:
        file.file.close()
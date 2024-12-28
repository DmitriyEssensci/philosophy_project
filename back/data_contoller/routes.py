from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from .models import DataModel
from .schemas import DataObject, DataObjectUpdate

Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/data", tags=["data"])

# Создание объекта
@router.post("/")
def create_data_object(object: DataObject, db: Session = Depends(get_db)):
    try:
        new_data_object = DataModel(
            person_name=object.person_name,

            period_life=object.period_life,
            years_life=object.years_life,
            school_teaching=object.school_teaching,

            person_teacher=object.person_teacher,
            person_followers=object.person_followers,
            person_works=object.person_works,

            short_description=object.short_description,
            full_description=object.full_description,

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
    if updated_object.years_life is not None:
        data_object.years_life = updated_object.years_life
    if updated_object.school_teaching is not None:
        data_object.school_teaching = updated_object.school_teaching
        
    if updated_object.person_teacher is not None:
        data_object.person_teacher = updated_object.person_teacher
    if updated_object.person_followers is not None:
        data_object.person_followers = updated_object.person_followers
    if updated_object.person_works is not None:
        data_object.person_works = updated_object.person_works

    if updated_object.short_description is not None:
        data_object.short_description = updated_object.short_description
    if updated_object.full_description is not None:
        data_object.full_description = updated_object.full_description

    db.commit()
    db.refresh(data_object)

    return {"message": "Объект обновлён", "object": data_object}
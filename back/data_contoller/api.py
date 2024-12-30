from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import DataModel
from .schemas import PhilosopherMinimal, PhilosopherFull

router = APIRouter(prefix="/data/api", tags=["data"])

# Вывод всех данных БД
@router.get("/")
def get_data_objects(db: Session = Depends(get_db)):
    data_objects = db.query(DataModel).all()
    return {"objects": data_objects}

# Минимальны вывод данных для рендеринга главной страницы, центры и связи
@router.get("/philosophers/minimal/", response_model=list[PhilosopherMinimal])
def get_minimal_philosophers(db: Session = Depends(get_db)):
    philosophers = db.query(
        DataModel.id,
        DataModel.person_name,
        DataModel.school_teaching,
        DataModel.influenced_by,
        DataModel.influenced
    ).all()
    
    result = []
    for index, philosopher in enumerate(philosophers):
        result.append({
            "id": philosopher.id,
            "person_name": philosopher.person_name,
            "school_teaching": philosopher.school_teaching,
            "influenced_by": philosopher.influenced_by,
            "influenced": philosopher.influenced,
        })
    return result


# Ограниченный вывод данных для рендеринга модального окна выбранного центра
@router.get("/philosophers/{philosopher_id}/", response_model=PhilosopherFull)
def get_philosopher(philosopher_id: int, db: Session = Depends(get_db)):
    philosopher = db.query(DataModel).filter(DataModel.id == philosopher_id).first()
    if not philosopher:
        raise HTTPException(status_code=404, detail="Philosopher not found")
    return philosopher
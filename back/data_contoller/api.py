from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import DataModel

router = APIRouter(prefix="/data/api", tags=["data"])

@router.get("/")
def get_data_objects(db: Session = Depends(get_db)):
    data_objects = db.query(DataModel).all()
    return {"objects": data_objects}
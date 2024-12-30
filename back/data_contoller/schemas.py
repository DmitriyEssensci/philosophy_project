from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Схема данных для создания
class DataObject(BaseModel):
    person_name: str

    period_life: str

    birth_date: str
    death_date: str

    school_teaching: str

    influenced_by: str
    influenced: str
    person_works: str

    short_description: str
    full_description: str

    wiki_url: str
    wiki_id: str

    create_data: datetime
    update_data: datetime

    class Config:
        orm_mode = True

# Схема данных для апдейта
class DataObjectUpdate(BaseModel):
    person_name: Optional[str] = None

    period_life: Optional[str] = None

    birth_date: Optional[str] = None
    death_date: Optional[str] = None

    school_teaching: Optional[str] = None

    influenced_by: Optional[str] = None
    influenced: Optional[str] = None
    person_works: Optional[str] = None
    
    short_description: Optional[str] = None
    full_description: Optional[str] = None

    wiki_url: Optional[str] = None
    wiki_id: Optional[str] = None

    class Config:
        orm_mode = True

# Схема данных для рендеринга главной страницы
class PhilosopherMinimal(BaseModel):
    id: int
    person_name: str
    school_teaching: Optional[str] = None
    influenced_by: Optional[str] = None
    influenced: Optional[str] = None

# Схема данных для рендеринга модального окна выбранного центра
class PhilosopherFull(BaseModel):
    id: int
    person_name: str
    period_life: Optional[str] = None
    birth_date: Optional[str] = None
    death_date: Optional[str] = None
    school_teaching: Optional[str] = None
    influenced_by: Optional[str] = None
    influenced: Optional[str] = None
    person_works: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    wiki_url: str
    wiki_id: str
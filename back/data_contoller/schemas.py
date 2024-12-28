from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DataObject(BaseModel):
    person_name: str

    period_life: str
    years_life: str
    school_teaching: str

    person_teacher: str
    person_followers: str
    person_works: str

    short_description: str
    full_description: str

    create_data: datetime
    update_data: datetime

    class Config:
        orm_mode = True

class DataObjectUpdate(BaseModel):
    person_name: Optional[str] = None

    period_life: Optional[str] = None
    years_life: Optional[str] = None
    school_teaching: Optional[str] = None

    person_teacher: Optional[str] = None
    person_followers: Optional[str] = None
    person_works: Optional[str] = None
    
    short_description: Optional[str] = None
    full_description: Optional[str] = None

    class Config:
        orm_mode = True
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class DataModel(Base):
    __tablename__ = "data_objects"

    id = Column(Integer, primary_key=True, index=True)

    person_name = Column(String, nullable=False)

    period_life = Column(String, nullable=False)
    years_life = Column(String, nullable=False)
    school_teaching = Column(String, nullable=False)

    person_teacher = Column(String, nullable=False)
    person_followers = Column(String, nullable=False)
    person_works = Column(String, nullable=False)
    
    short_description = Column(String, nullable=False)
    full_description = Column(String, nullable=False)

    create_data = Column(DateTime, default=datetime.utcnow, nullable=False)  # Автоматически задаётся при создании
    update_data = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)  # Автоматически обновляется
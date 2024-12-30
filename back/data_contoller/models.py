from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class DataModel(Base):
    __tablename__ = "data_objects"

    id = Column(Integer, primary_key=True, index=True)

    person_name = Column(String, nullable=False)

    period_life = Column(String, nullable=True)
    birth_date = Column(String, nullable=True)
    death_date = Column(String, nullable=True)

    school_teaching = Column(String, nullable=True)

    influenced_by = Column(String, nullable=True)
    influenced = Column(String, nullable=True)
    person_works = Column(String, nullable=True)
    
    short_description = Column(String, nullable=True)
    full_description = Column(String, nullable=True)

    wiki_url = Column(String, nullable=False)
    wiki_id = Column(String, nullable=False)

    create_data = Column(DateTime, default=datetime.utcnow, nullable=False)
    update_data = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
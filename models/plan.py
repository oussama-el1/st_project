#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, Integer, Float
from sqlalchemy.orm import relationship

class Plan(BaseData, Base):
    """Plan Data Model"""
    
    __tablename__ = 'plans'
    NumberPeople = Column(Integer, nullable=False)
    NumberMeals = Column(Integer, nullable=False)
    boxtotale = Column(Float, nullable=False)
    
    users = relationship("User", secondary="orders", overlaps="plans")
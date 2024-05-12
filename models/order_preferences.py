#!/usr/bin/python3
from models.base import Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

class OrderPreference(Base):
    """MealIngredient Table"""
    __tablename__ = 'order_preferences'

    order_id = Column(String(60), ForeignKey('orders.id'), primary_key=True)
    preference_id = Column(String(60), ForeignKey('preferences.id'), primary_key=True)
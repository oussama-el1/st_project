#!/usr/bin/python3
from models.base import BaseData, Base
from sqlalchemy import Column, ForeignKey, String, Enum
from sqlalchemy.orm import relationship

class Order(BaseData, Base):
    """Order Data Model"""
    __tablename__ = 'orders'
    user_id = Column(String(60), ForeignKey('users.id'), primary_key=True)
    plan_id = Column(String(60), ForeignKey('plans.id'), primary_key=True)
    status = Column(Enum('pending', 'confirmed', 'cancelled', 'delivered'), default='pending', nullable=False)

    # Define many-to-many relationship with Meals
    meals = relationship("Meal", secondary="order_meals", backref="order_associations")
    preferences = relationship("Preference", secondary="order_preferences", overlaps="orders")

    # Define relationship with OrderMeal for cascade deletion
    order_meals = relationship("OrderMeal", cascade="all, delete", backref="order", overlaps="meals,order_associations")
    order_preferences = relationship("OrderPreference", cascade="all, delete", backref="order", overlaps="preferences")

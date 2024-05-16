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

    user = relationship("User", back_populates="orders")

    meals = relationship("Meal", secondary="order_meals", back_populates="orders")
    preferences = relationship("Preference", secondary="order_preferences", back_populates="orders")

    order_meals = relationship("OrderMeal", cascade="all, delete", back_populates="order")
    order_preferences = relationship("OrderPreference", cascade="all, delete", back_populates="order")

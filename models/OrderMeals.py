from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from models.base import Base

class OrderMeal(Base):
    """Model representing the relationship between orders and meals"""
    __tablename__ = 'order_meals'

    order_id = Column(String(60), ForeignKey('orders.id'), primary_key=True)
    meal_id = Column(String(60), ForeignKey('meals.id'), primary_key=True)
    quantity = Column(Integer, nullable=False, default=1)

#!/usr/bin/python3
""" Create User Models """
from models.base import BaseData, Base
from sqlalchemy import Column, String
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class User(BaseData, Base):
    __tablename__ = 'users'

    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    FirstName = Column(String(45), nullable=False)
    LastName = Column(String(45), nullable=False)
    tel = Column(String(45), nullable=False)

    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    plans = relationship("Plan", secondary="orders", back_populates="users")
    orders = relationship("Order", cascade="all, delete", back_populates="user")
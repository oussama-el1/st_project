#!/usr/bin/python3
""" Create User Models """
from models.base import BaseData, Base
from sqlalchemy import Column, String, ForeignKey
from models.user import User
from sqlalchemy.orm import relationship


class Address(BaseData, Base):
    """ Address Data class Model """
    __tablename__ = 'address'
    
    state = Column(String(45), nullable=False)
    city = Column(String(45), nullable=False)
    street = Column(String(45), nullable=False)
    zipcode = Column(String(45), nullable=False)
    apt = Column(String(45), nullable=False)
    user_id = Column(String(60), ForeignKey('users.id'))
    
    user = relationship("User", back_populates="addresses")
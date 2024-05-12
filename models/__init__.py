#!/usr/bin/python3
"""
initialize the models package
"""

from models.Data.db_engine import DBStorage

storage = DBStorage()
storage.reload()
#!/usr/bin/python3
""" create  """
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')

allusers = {
    'john': 'password123'
}

def authenticate(username, password):
    return username in allusers and allusers[username] == password

from api.v1.views.status import *
from api.v1.views.address import *
from api.v1.views.users import *
from api.v1.views.plans import *
from api.v1.views.orders import *
from api.v1.views.ingredients import *
from api.v1.views.meals import *
from api.v1.views.customizationOptions import *
from api.v1.views.pref import *
#!/usr/bin/python3
""" Routes for Status of api """
from api.v1.views import app_views
from flask import jsonify
from models.user import User
from models.plan import Plan
from models.order import Order
from models.meals import Meal
from models.ingredients import Ingredient
from models.address import Address
from models import storage


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """ status of API """
    return jsonify({"status": "OK"})


@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def number_objects():
    """ Retrieves the number of each objects by type """
    classes = [Plan, Order, Meal, Ingredient, Address, User]
    names = ["Plans", "Orders", "Meals", "Ingredients", "Address", "Users"]

    num_objs = {}
    for i in range(len(classes)):
        num_objs[names[i]] = storage.count(classes[i])
    return jsonify(num_objs)
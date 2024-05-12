#!/usr/bin/python3
"""  """
from api.v1.views import app_views
from flask import abort, jsonify, request
from models.meals import Meal
from models.customization import CustomizationOptions
from models.order_meal_cust import OrderMealCustomization
from models.order import Order
from models import storage


@app_views.route('/meals/<meal_id>/customize', methods=['GET'], strict_slashes=False)
def get_options(meal_id):
    """ get the Customization Options for a meal """
    if not storage.get(Meal, meal_id):
        abort(400, description=f"Meal with ID {meal_id} does not exist")
    meal = storage.get(Meal, meal_id)
    meal_option = meal.customization_options
    meals_option = {}
    meals_option["meal name"] = meal.name
    options = []
    for option in meal_option:
        one_options = {}
        one_options["ingredient"] = option.ingredient.ingredientsName
        one_options["portion_size"] = option.portion_size
        one_options["price"] = option.price
        options.append(one_options)
    meals_option["option"] = options
    return jsonify(meals_option), 200


@app_views.route('/meals/<meal_id>/customize', methods=['POST'], strict_slashes=False)
def post_customization(meal_id):
    """Post a user's choice for meal customization"""
    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    # Check if meal_id exists in the meals table
    if not storage.get(Meal, meal_id):
        abort(400, description=f"Meal with ID {meal_id} does not exist")
    # Check if order_id exists in the orders table
    order_id = data.get("order_id")
    if not storage.get(Order, order_id):
        abort(400, description=f"Order with ID {order_id} does not exist")

    # Insert customizations into the order_meal_customization table
    for customization in data.get("customizations", []):
        row = OrderMealCustomization()
        row.order_id = order_id
        row.meal_id = meal_id
        row.ingredient_id = customization.get("ingredient_id")
        row.portion_size = customization.get("portion_size")
        row.save()

    return jsonify({"customization": "Done"}), 200
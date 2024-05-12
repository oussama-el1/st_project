#!/usr/bin/python3
from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.order import Order
from models import storage
from models.meals import Meal
from models.Preference import Preference
from models.OrderMeals import OrderMeal
from collections import Counter


@app_views.route('/orders', methods=['POST'], strict_slashes=False)
def add_order():
    """ add order """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')
    
    if not request.get_json():
        abort(400, description="Not a JSON")
    attr = ["plan_id", "user_id"]
    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for key in attr:
        if key not in data:
            abort(400, description="Missing args")
    for key in data.keys():
        if key in ignore:
            abort(400, description="Ignored key passed")
    order = Order(**data)
    order.save()
    return make_response(jsonify(order.to_dict()), 201)


@app_views.route('/orders/<order_id>/meals', methods=['POST'])
def add_meals_to_order(order_id):
    """ Retrieve the order from the database """
    order = storage.get(Order, order_id)

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.json
    meals_ids = data.get('meal_ids', [])

    meal_id_counts = Counter(meals_ids)
    order_meals = []
    processed_meals = set()

    for meal_id in meals_ids:
        if meal_id in processed_meals:
            continue

        meal = storage.get(Meal, meal_id)
        if not meal:
            return jsonify({'error': f'Meal with ID {meal_id} not found'}), 404

        quantity = meal_id_counts[meal_id]
        order_meal = OrderMeal(order_id=order_id, meal_id=meal_id, quantity=quantity)
        order_meals.append(order_meal)

        processed_meals.add(meal_id)
        storage.new(order_meal)

    storage.save()
    return jsonify({'message': 'Meals added to order successfully'}), 200


@app_views.route('/orders/<order_id>/preferences', methods=['POST'], strict_slashes=False)
def order_preferences(order_id):
    """ Post the Preference selected for Order """
    
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        abort(401, 'Authentication required')
    
    order = storage.get(Order, order_id)
    if order is None:
        abort(404, f'{order_id} - Order Not Found')
    
    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")
    
    if "preferences_ids" not in data:
        abort(400, description="Missing args")
    
    for pref_id in data["preferences_ids"]:
        preference = storage.get(Preference, pref_id)
        order.preferences.append(preference)
    storage.save()
    return make_response(jsonify({"message": "Preferences selected added successfully"}), 201)
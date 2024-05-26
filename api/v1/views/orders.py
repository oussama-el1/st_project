#!/usr/bin/python3
from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.order import Order
from models import storage
from models.meals import Meal
from models.Preference import Preference
from models.OrderMeals import OrderMeal
from collections import Counter
from models.plan import Plan
from datetime import timedelta, datetime




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

    order.meals = []
    order.save()
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


@app_views.route('/admin/orders', methods=['GET'], strict_slashes=False)
def orders_data():
    """ Post the Preference selected for Order """

    orders = storage.orders_data()
    return jsonify(orders)




@app_views.route('/admin/orders/<order_id>', methods=['PUT'], strict_slashes=False)
def admin_update_order(order_id):
    """ admin users update orders """

    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        abort(401, 'Authentication required')
    
    order = storage.get(Order, order_id)
    if order is None:
        abort(404, f'{order_id} - Order Not Found')
    
    data = request.get_json()

    if data is None:
        abort(400, description="Not a JSON")

    user = order.user
    addresse = user.addresses[-1]
    args = ["state", "city", "zipcode", "street", "apt", "status", "delevred_at", 'meals']

    for key in data.keys():
        if key not in args:
            abort(400, description=f"Passing unknown args {key}")


    if "state" in data:
        addresse.state = data["state"]
    if "city" in data:
        addresse.city = data["city"]
    if "zipcode" in data:
        addresse.zipcode = data["zipcode"]
    if "street" in data:
        addresse.street = data["street"]
    if "apt" in data:
        addresse.apt = data["apt"]
    if "status" in data:
        order.status = data["status"]
    if "delevred_at" in data:
        time_part = order.created_at.time()
        delevred_at_object = datetime.strptime(data["delevred_at"], "%m/%d/%Y")

        if delevred_at_object < order.created_at:
            return jsonify({"message": "Bad request ..."}), 400
        delevred_at_object = datetime.combine(delevred_at_object, time_part)
        new_date_object = delevred_at_object - timedelta(days=2)
        order.created_at = new_date_object

    if data["meals"] == []:
        order.meals = []
    else:
        order.meals = []
        storage.save()
        # add meals in the order
        meals_ids = data["meals"]

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

    order.save()
    return jsonify({"message": "Order updated ..."}), 200




@app_views.route('/admin/orders/<order_id>', methods=['DELETE'], strict_slashes=False)
def admin_delete_order(order_id):
    """ admin users delete orders """

    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        abort(401, 'Authentication required')

    order = storage.get(Order, order_id)
    if order is None:
        abort(404, f'{order_id} - Order Not Found')

    plan = storage.get(Plan, order.plan_id)
    if plan is None:
        abort(404, f'{order_id} - Plan Not Found')
    storage.delete(order)
    storage.delete(plan)
    storage.save()
    return jsonify({"message": "Order deleted ..."}), 200
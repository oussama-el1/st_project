#!/usr/bin/python3
""" Meal Routes for all
    (CRUD) operation :
        CREATE (POST) : create Meal
        READ (GET) : get Meal or Meals
        UPDATE (UPDATE) : update Meal
        DELETE (DELETE) : delete Meal
"""

from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.meals import Meal
from models.Preference import Preference
from models import storage
import os
from flask import request, jsonify, abort
from PIL import Image
import base64
import io



@app_views.route('/meals/<meal_id>', methods=['GET'], strict_slashes=False)
def get_meal(meal_id):
    """ get Meal from Meals """
    data = storage.get(Meal, meal_id)
    if data is None:
        return jsonify({'message': 'Meal Not Found'}), 404
    else:
        meal = data.to_dict()
        ingredients = []
        for ing in data.ingredients:
            ingredients.append(ing.ingredientsName)
        meal['ingredients'] = ingredients
        return jsonify(meal)


@app_views.route('/meals/<meal_id>', methods=['DELETE'], strict_slashes=False)
def delete_meal(meal_id):
    """ delete meal from meals """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return jsonify({'message': 'Authentication required'}), 401

    meal = storage.get(Meal, meal_id)
    if meal is None:
        return jsonify({'message': 'Meal Not Found'}), 404
    else:
        storage.delete(meal)
        storage.save()
        return jsonify({f"meal - {meal.id}" : "deleted"}), 200



@app_views.route('/meals/<meal_id>', methods=['PUT'], strict_slashes=False)
def update_meal(meal_id):
    """ update Meal """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")
    meal = storage.get(Meal, meal_id)
    attr = ["name", "prix", "protein", "calories", "Carbs", "Fat"]
    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for k, v in data.items():
        if k in attr and k not in ignore:
            setattr(meal, k, v)
    meal.save()
    return jsonify(meal.to_dict()), 200



@app_views.route('/meals/<meal_id>/preferences', methods=['GET'], strict_slashes=False)
def prefs_for_meal(meal_id):
    """ all preferences for a meal """
    meal = storage.get(Meal, meal_id)
    if meal is None:
        return jsonify({"meassage": f"Meal [{meal_id}] Not Found"}), 404
    preferences = meal.preferences
    data = []
    for preference in preferences:
        data.append(preference.name)
    return jsonify(data), 200


@app_views.route('/meals_search', methods=['POST'], strict_slashes=False)
def meals_by_preferences():
    """To retrieve meals that have all the selected preferences"""
    if request.get_json() is None:
        abort(400, description="Not a JSON")

    data = request.get_json()
    preferences_ids = data.get("preferences", None)
    if not preferences_ids:
        return jsonify({'message': 'No preferences provided'}), 400
    list_meals = storage.all(Meal).values()
    pref_obj = [storage.get(Preference, p_id) for p_id in preferences_ids]
    list_meals = [meal for meal in list_meals
                        if all([pref in meal.preferences
                                for pref in pref_obj])]
    meals = []
    for meal in list_meals:
        data = meal.to_dict()
        data.pop('preferences', None)
        ingredients = [ing.ingredientsName for ing in meal.ingredients]
        data['ingredients'] = ingredients
        meals.append(data)

    return jsonify(meals), 200


@app_views.route('/admin/meals', methods=['GET'], strict_slashes=False)
def admin_meals():
    """ get all meals """
    meals = storage.meals_data()

    return jsonify(meals), 200



@app_views.route('/meals', methods=['POST'], strict_slashes=False)
def add_meal():
    """ add Meal """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")
    
    data = request.get_json()
    attr = ["name", "protein", "calories", "Carbs", "Fat"]
    for key in attr:
        if key not in data:
            abort(400, description="Missing args")
    ignore = ['id', 'created_at', 'updated_at']
    for key in data.keys():
        if key in ignore:
            abort(400, description="Ignored key passed")
    
    meal = Meal(**data)
    meal.save()

    # Save the image
    image_data = data.get('image')
    if image_data:
        save_image(meal.id, image_data)
    
    return jsonify(meal.to_dict()), 201



def save_image(meal_id, image_data):
    """Save base64 image to file"""
    image_data = image_data.split(",")[1]
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))

    # Save the image to the specified directory
    image_path = f"C:\\Users\\oussama\\Desktop\\stage technique project\\v1\\st_project\\web_dynamic\\static\\images\\meals\\{meal_id}.jpg"
    image.save(image_path)




@app_views.route('/meals/<meal_id>/preferences', methods=['POST'], strict_slashes=False)
def add_meal_in_preference(meal_id):
    """ add meal in preference """
    meal = storage.get(Meal, meal_id)

    if meal is None:
        return jsonify({'message': 'Meal Not Found'}), 404

    data = request.get_json()
    if not data:
        abort(400, description="Not a JSON")

    Preferenceids = data.get("preferences", None)
    if not Preferenceids:
        return jsonify({'message': 'No preferences provided'}), 400

    pref_obj = [storage.get(Preference, p_id) for p_id in Preferenceids]
    for pref in pref_obj:
        meal.preferences.append(pref)
    meal.save()
    return jsonify({'message': 'Meal added to preferences'}), 200

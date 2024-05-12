#!/usr/bin/python3
""" Preferences routes """
from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.Preference import Preference
from models import storage

@app_views.route('/preferences', methods=['GET'], strict_slashes=False)
def get_all_pref():
    """ All preferences available """
    all_pref = storage.all(Preference).values()
    res = []
    for preference in all_pref:
        res.append(preference.to_dict())
    return jsonify(res), 200


@app_views.route('/preferences/<pref_id>', methods=['GET'], strict_slashes=False)
def get_pref(pref_id):
    """ get preference from preferences """
    preference = storage.get(Preference, pref_id)
    if preference is None:
        return jsonify({'message': f'Preference [{pref_id}] Not Found'}), 404
    else:
        return jsonify(preference.to_dict()), 200


@app_views.route('/preferences/<pref_id>', methods=['DELETE'], strict_slashes=False)
def delete_pref(pref_id):
    """ delete preference from DB """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return jsonify({'message': 'Authentication required'}), 401
    
    pref = storage.get(Preference, pref_id)
    if pref is None:
        return jsonify({'message': f'Preference [{pref_id}] Not Found'}), 404
    else:
        storage.delete(pref)
        storage.save()
        return jsonify({f"Preference - {pref_id}" : "deleted"}), 200



@app_views.route('/preferences', methods=['POST'], strict_slashes=False)
def add_pref():
    """ add preference """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    if "name" not in data:
            abort(400, description="Missing args")
    for key in data.keys():
        if key in ignore:
            abort(400, description=f"Ignored key passed : {key}")
    pref = Preference(**data)
    pref.save()
    return make_response(jsonify(pref.to_dict()), 201)


@app_views.route('/preferences/<pref_id>', methods=['PUT'], strict_slashes=False)
def update_pref(pref_id):
    """ update preference """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')
    
    if not request.get_json():
        abort(400, description="Not a JSON")
    pref = storage.get(Preference, pref_id)
    if pref is None:
        return jsonify({'message': f'Preference [{pref_id}] Not Found'}), 404
    attr = ["name"]
    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for k, v in data.items():
        if k in attr and k not in ignore:
            setattr(pref, k, v)
    pref.save()
    return jsonify(pref.to_dict()), 200



@app_views.route('/preferences/<pref_id>/meals', methods=['GET'], strict_slashes=False)
def meals_in_pref(pref_id):
    """ get all meals in preference """
    preference = storage.get(Preference, pref_id)
    if preference is None:
        return jsonify({'message': f'Preference [{pref_id}] Not Found'}), 404
    meals = preference.meals
    data = []
    for meal in meals:
        ingredients = []
        for ingredient in meal.ingredients:
            ingredients.append(ingredient.ingredientsName)
        meal_json = meal.to_dict()
        meal_json['ingredients'] = ingredients
        data.append(meal_json)
    return jsonify(data), 200



@app_views.route('/preferences/meals', methods=['POST'], strict_slashes=False)
def meals_prefs():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Not a json'}), 400
    preferences = data.get("preferences", [])
    if not preferences:
        return jsonify({'message': 'No preferences provided'}), 400
    
    meals = []
    for pref_id in preferences:
        preference = storage.get(Preference, pref_id)
        if preference is None:
            return jsonify({'message': f'Preference [{preference.id}] Not Found'}), 404
        mealsPref = preference.meals
        for meal in mealsPref:
            if meal.to_dict() not in meals:
                meals.append(meal.to_dict())
    return jsonify(meals)
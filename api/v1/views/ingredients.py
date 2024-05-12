#!/usr/bin/python3
""" Ingredients Routes for all
    (CRUD) operation :
        CREATE (POST) : create ingredients
        READ (GET) : get ingredient or ingredient
        UPDATE (UPDATE) : update ingredient
        DELETE (DELETE) : delete ingredient
"""

from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.ingredients import Ingredient 
from models import storage


@app_views.route('/ings', methods=['GET'], strict_slashes=False)
def get_all_ing():
    """ All ingredients available """
    all_ing = storage.all(Ingredient).values()
    res = []
    for ing in all_ing:
        res.append(ing.to_dict())
    return jsonify(res), 200


@app_views.route('/ings/<ing_id>', methods=['GET'], strict_slashes=False)
def get_ing(ing_id):
    """ get ingredient from Ingredients """
    ingredient = storage.get(Ingredient, ing_id)
    if ingredient is None:
        return jsonify({'message': 'Ingredient Not Found'}), 404
    else:
        return jsonify(ingredient.to_dict()), 200


@app_views.route('/ings/<ing_id>', methods=['DELETE'], strict_slashes=False)
def delete_ing(ing_id):
    """ delete ingredient from DB """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return jsonify({'message': 'Authentication required'}), 401
    
    ing = storage.get(Ingredient, ing_id)
    if ing is None:
        return jsonify({'message': 'Ingredient Not Found'}), 404
    else:
        storage.delete(ing)
        storage.save()
        return jsonify({f"Ingredient - {ing.id}" : "deleted"}), 200


@app_views.route('/ings', methods=['POST'], strict_slashes=False)
def add_ing():
    """ add ingredient """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    if "ingredientsName" not in data:
            abort(400, description="Missing args")
    for key in data.keys():
        if key in ignore:
            abort(400, description=f"Ignored key passed : {key}")
    ing = Ingredient(**data)
    ing.save()
    return make_response(jsonify(ing.to_dict()), 201)


@app_views.route('/ings/<ing_id>', methods=['PUT'], strict_slashes=False)
def update_ing(ing_id):
    """ update ingredient """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')
    
    if not request.get_json():
        abort(400, description="Not a JSON")
    ing = storage.get(Ingredient, ing_id)
    attr = ["ingredientsName"]
    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for k, v in data.items():
        if k in attr and k not in ignore:
            setattr(ing, k, v)
    ing.save()
    return jsonify(ing.to_dict()), 200
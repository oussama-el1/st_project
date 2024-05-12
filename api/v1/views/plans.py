#!/usr/bin/python3
""" Plans Routes for all
    (CRUD) operation :
        CREATE (POST) : create a plans
        READ (GET) : get a plan or plans
        UPDATE (UPDATE) : update plan
        DELETE (DELETE) : delete a plan
"""

from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.plan import Plan
from models import storage


@app_views.route('/plans', methods=['GET'], strict_slashes=False)
def get_all_plans():
    """ All plans available """
    all_plans = storage.all(Plan).values()
    res = []
    for plan in all_plans:
        res.append(plan.to_dict())
    return jsonify(res)


@app_views.route('/plans/<plan_id>', methods=['GET'], strict_slashes=False)
def get_plan(plan_id):
    """ get plan from Plans """
    plan = storage.get(Plan, plan_id)
    if plan is None:
        return jsonify({'message': 'Plan Not Found'}), 404
    else:
        return jsonify(plan.to_dict())


@app_views.route('/plans/<plan_id>', methods=['DELETE'], strict_slashes=False)
def delete_plan(plan_id):
    """ delete plan from plans """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return jsonify({'message': 'Authentication required'}), 401
    
    plan = storage.get(Plan, plan_id)
    if plan is None:
        return jsonify({'message': 'Plan Not Found'}), 404
    else:
        storage.delete(plan)
        storage.save()
        return jsonify({f"plan - {plan.id}" : "deleted"}), 200


@app_views.route('/plans', methods=['POST'], strict_slashes=False)
def add_plan():
    """ add plan """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')
    
    if not request.get_json():
        abort(400, description="Not a JSON")
    attr = ["NumberPeople", "NumberMeals", "boxtotale"]
    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for key in attr:
        if key not in data:
            abort(400, description="Missing args")
    for key in data.keys():
        if key in ignore:
            abort(400, description="Ignored key passed")
    plan = Plan(**data)
    plan.save()
    return make_response(jsonify(plan.to_dict()), 201)


@app_views.route('/plans/<plan_id>', methods=['PUT'], strict_slashes=False)
def update_plan(plan_id):
    """ update plan """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')
    
    if not request.get_json():
        abort(400, description="Not a JSON")
    plan = storage.get(Plan, plan_id)
    attr = ["NumberPeople", "NumberMeals", "boxtotale"]
    ignore = ['id', 'created_at', 'updated_at']
    data = request.get_json()
    for k, v in data.items():
        if k in attr and k not in ignore:
            setattr(plan, k, v)
    plan.save()
    return jsonify(plan.to_dict()), 200
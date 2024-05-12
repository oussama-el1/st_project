#!/usr/bin/python3
""" Addresse routes """
from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.user import User
from models import storage

@app_views.route('/users', methods=['POST'], strict_slashes=False)
def add_users():
    """ add user """
    auth = request.authorization
    if not auth or not authenticate(auth['username'], auth['password']):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']
    args = ['email', 'tel', 'password', 'FirstName', 'LastName']
    data = request.get_json()
    for arg in args:
        if arg not in data:
            abort(400, description="Missing args")
    for key in data.keys():
        if key in ignore:
            abort(400, description=f"Ignored key passed : {key}")
    user = User(**data)
    user.save()
    return make_response(jsonify(user.to_dict()), 201)
#!/usr/bin/python3
""" Addresse routes """
from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.address import Address
from models import storage

@app_views.route('/address', methods=['POST'], strict_slashes=False)
def add_address():
    """ add Address """
    auth = request.authorization
    if not auth or not authenticate(auth.username, auth.password):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'created_at', 'updated_at']
    args = ['state', 'city', 'apt', 'zipcode']
    data = request.get_json()
    for arg in args:
        if arg not in data:
            abort(400, description="Missing args")
    for key in data.keys():
        if key in ignore:
            abort(400, description=f"Ignored key passed : {key}")
    address = Address(**data)
    address.save()
    return make_response(jsonify(address.to_dict()), 201)
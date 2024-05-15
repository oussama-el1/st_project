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


@app_views.route('/admin/users', methods=['GET'], strict_slashes=False)
def user_data_for_admin():
    """ Get user data for admin operation with pagination """
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('perPage', default=10, type=int)

    all_users = storage.users_data()

    start_index = (page - 1) * per_page
    end_index = min(start_index + per_page, len(all_users))

    users_on_page = all_users[start_index:end_index]

    return jsonify({
        'users': users_on_page,
        'total_users': len(all_users),
        'page': page,
        'per_page': per_page
    })
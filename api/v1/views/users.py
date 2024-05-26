#!/usr/bin/python3
""" Addresse routes """
from api.v1.views import app_views, authenticate
from flask import abort, jsonify, make_response, request
from models.user import User
from models.order import Order
from models import storage



@app_views.route('/allusers', methods=['GET'], strict_slashes=False)
def all_users():
    """ get all users """
    users = storage.all(User).values()
    return jsonify([user.to_dict() for user in users])




@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
def getuser(user_id):
    """ get user by id """
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    return jsonify(user.to_dict())




@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
def update_user(user_id):
    """ get all users """
    auth = request.authorization
    if not auth or not authenticate(auth['username'], auth['password']):
        return abort(401, 'Authentication required')

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'updated_at']
    args = ['email', 'tel', 'password', 'FirstName', 'LastName', 'created_at']
    data = request.get_json()
    for arg in data.keys():
        if arg not in args:
            abort(400, description=f"invalid argument {arg}")
    for key in data.keys():
        if key in ignore:
            abort(400, description=f"Ignored key passed : {key}")

    user = storage.get(User, user_id)
    for key, value in data.items():
        setattr(user, key, value)

    user.save()
    return jsonify({"message": f" User < {user_id} > updated seccessfully "}), 200





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





@app_views.route('/users/<user_id>', methods=['DELETE'], strict_slashes=False)
def delete_users(user_id):
    """ Delete user and related data """
    auth = request.authorization
    if not auth or not authenticate(auth['username'], auth['password']):
        return abort(401, 'Authentication required')

    # Get the user
    user = storage.get(User, user_id)
    if not user:
        abort(404)

    # Delete the user and all associated rows
    storage.delete(user)
    storage.save()

    return make_response(jsonify({"message": f"User <{user_id}> deleted successfully"}), 200)






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




@app_views.route('/admin/users/simple', methods=['GET'], strict_slashes=False)
def user_simple_data_for_admin():
    return jsonify({'users': storage.users_data()})




@app_views.route('/users/validemail', methods=['POST'], strict_slashes=False)
def valid_email():
    """ check if email is exist """
    deta = request.get_json()
    if not deta:
        abort(400, description="Not a JSON")

    user = storage.email_users(deta['email'])
    if user:
        return jsonify({"message": "This email is already registered"}), 400
    return jsonify({"message": "This email is available for registration"}), 200
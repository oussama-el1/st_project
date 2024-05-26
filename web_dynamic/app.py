#!/usr/bin/python3
""" Nershor Meals web app """

from models import storage
from models.Preference import Preference
from flask import Flask, render_template, jsonify, request, session, make_response
from uuid import uuid4
import requests
from models.order import Order
from models.plan import Plan
from models.user import User
from models.meals import Meal


app = Flask(__name__)
app.secret_key = 'oussama@1230.'


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/home', strict_slashes=False)
def home_page():
    """ home page for the web app """
    return render_template("home.html", unique_id=uuid4())


@app.route('/plans', strict_slashes=False)
def plans():
    """ this route is for the plans """
    preferences = storage.all(Preference).values()
    icons = ['<i class="fas fa-heartbeat"></i>',
             '<i class="fas fa-carrot"></i>',
             '<i class="fas fa-child"></i>',
             '<i class="fas fa-utensils"></i>',
             '<i class="fas fa-stopwatch"></i>',
             '<i class="fas fa-fish"></i>']
    prefs_icons = list(zip(icons, preferences))
    return render_template("plans.html", prefs_icons=prefs_icons, unique_id=uuid4())


@app.route('/store_session_data_plan', methods=['POST'])
def store_session_data_plan():
    """ Store user preferences and plan information in session """
    data = request.json
    session['selectedPrefs'] = data['selectedPrefs']
    session['numPeople'] = data['numPeople']
    session['mealsPerWeek'] = data['mealsPerWeek']
    session['boxprice'] = data['boxprice']
    session['discount'] = data['discount']
    session['totale'] = data['totale']
    
    return 'Session data for plan stored successfully', 200


@app.route('/store_session_data_registration', methods=['POST'])
def store_session_data_registration():
    data = request.json
    session['email'] = data['email']
    session['password'] = data['password']
    
    return "Session data for registration stored successfully", 200


@app.route('/store_session_data_address', methods=['POST'])
def store_session_data_address():
    """ Store user delivery address information in session """
    data = request.json
    
    session['first_name'] = data.get('first_name', '')
    session['last_name'] = data.get('last_name', '')
    session['street'] = data.get('street', '')
    session['apt'] = data.get('apt', '')
    session['city'] = data.get('city', '')
    session['zip_code'] = data.get('zip_code', '')
    session['state'] = data.get('state', '')
    session['tel'] = data.get('tel', '')
    
    return 'Session data for address stored successfully', 200



@app.route('/create_user_and_address', methods=['POST'])
def create_user_and_address():
    # Retrieve user and address data from session
    user_data = {
        'email': session.get('email'),
        'password': session.get('password'),
        'FirstName': session.get('first_name'),
        'LastName': session.get('last_name'),
        'tel': session.get('tel')
    }
    
    address_data = {
        'state': session.get('state'),
        'city': session.get('city'),
        'street': session.get('street'),
        'zipcode': session.get('zip_code'),
        'apt': session.get('apt')
    }
    
    user_creation_response = requests.post('http://127.0.0.1:5000/api/v1/users', json=user_data, auth=('john', 'password123'))
    
    if user_creation_response.status_code != 201:
        print("error user")
        return jsonify({'error': 'Failed to create user'}), 500
    
    user_id = user_creation_response.json().get('id')
    
    address_data['user_id'] = user_id
    address_creation_response = requests.post('http://127.0.0.1:5000/api/v1/address', json=address_data, auth=('john', 'password123'))
    
    if address_creation_response.status_code != 201:
        print("error address")
        return jsonify({'error': 'Failed to create address'}), 500
    
    plan_data = {
        "NumberPeople": session.get('numPeople'),
        "NumberMeals": session.get('mealsPerWeek'),
        "boxtotale": session.get('totale')
    }
    
    order_data = {
        "user_id": user_id
    }
    
    plan_creation_response = requests.post('http://127.0.0.1:5000/api/v1/plans', json=plan_data, auth=('john', 'password123'))
    
    if plan_creation_response.status_code != 201:
        print("error plan")
        return jsonify({'error': 'Failed to create plan'}), 500
    
    plan_id = plan_creation_response.json().get('id')
    order_data["plan_id"] = plan_id
    
    order_creation_response = requests.post('http://127.0.0.1:5000/api/v1/orders', json=order_data, auth=('john', 'password123'))
    
    if order_creation_response.status_code != 201:
        print("error order")
        return jsonify({'error': 'Failed to create order'}), 500
    
    order_id = order_creation_response.json().get('id')
    
    order_preferences = {"preferences_ids": session.get("selectedPrefs")}
    
    preference_creation_response = requests.post(f'http://127.0.0.1:5000/api/v1/orders/{order_id}/preferences', json=order_preferences, auth=('john', 'password123'))
    
    if preference_creation_response.status_code != 201:
        print("error Preferences")
        return jsonify({'error': 'Failed to create Preferences Order'}), 500
    
    return make_response(jsonify({'message': 'User and address created successfully', 'order_id': order_id}), 200)


@app.route('/registration', strict_slashes=False)
def registration():
    """ Retrieve user preferences from session """
    return render_template('registration.html', unique_id=uuid4())


@app.route('/form', strict_slashes=False)
def form():
    """ User form """
    
    session_data = {
        'selectedPrefs': session.get('selectedPrefs'),
        'numPeople': session.get('numPeople'),
        'mealsPerWeek': session.get('mealsPerWeek'),
        'boxprice': session.get('boxprice'),
        'discount': session.get('discount'),
        'totale': session.get('totale')
    }
    numPeople = session.get('numPeople')
    mealsPerWeek = session.get('mealsPerWeek')
    
    serving = int(numPeople) * int(mealsPerWeek)
    session_data['serving'] = serving 
    
    preferencesName = [storage.get(Preference, pref_id).name for pref_id in session_data.get('selectedPrefs')]
    preference_string = ' '.join(preferencesName)
    session_data['preferences'] = preference_string
    
    return render_template('form.html', session_data=session_data, unique_id=uuid4())


@app.route('/checkout')
def checkout():
    """ Display checkout page with session data """
    session_data = {
        'selectedPrefs': session.get('selectedPrefs'),
        'numPeople': session.get('numPeople'),
        'mealsPerWeek': session.get('mealsPerWeek'),
        'boxprice': session.get('boxprice'),
        'discount': session.get('discount'),
        'totale': session.get('totale'),
        'firstname': session.get('first_name'),
        'lastname': session.get('last_name'),
        'address': {
            'street': session.get('street'),
            'apt': session.get('apt'),
            'city': session.get('city'),
            'zipcode': session.get('zip_code')
        }
    }
    
    numPeople = session.get('numPeople')
    mealsPerWeek = session.get('mealsPerWeek')
    serving = int(numPeople) * int(mealsPerWeek)
    session_data['serving'] = serving 
    
    preferencesName = [storage.get(Preference, pref_id).name for pref_id in session_data.get('selectedPrefs')]
    preference_string = ' '.join(preferencesName)
    session_data['preferences'] = preference_string
    
    return render_template('checkout.html', session_data=session_data, unique_id=uuid4())


@app.route('/order/<order_id>')
def order_page(order_id):
    """ route for meals Order page to select meals (last page) after checkout"""
    
    meal_details = ["protein", "Carbs", "Fat"]
    order = storage.get(Order, order_id)
    
    if order is None:
        return make_response("<h1>Order Not Found </h1>", 404)
    plan = storage.get(Plan, order.plan_id)
    user = storage.get(User, order.user_id)
    order_details = {
        'order_id': order_id,
        'mealsPerWeek': plan.NumberMeals
    }
    
    preferences = []
    for preference in order.preferences:
        preferences.append(preference.id)
    
    preferences_data = {
        'preferences': preferences
    }
    
    meals_response = requests.post('http://127.0.0.1:5000/api/v1/meals_search', json=preferences_data)
    
    if meals_response.status_code != 200:
        return "Meals in all the preference selectef error", 403
    topmeals = meals_response.json()
    
    data = {}
    
    # send request to api http://localhost:5000/api/v1/preferences/76d6225d-f35e-11ee-862f-c8d9d2eb390e/meals
    for pref_id in preferences:
        preference_meals_response = requests.get(f'http://127.0.0.1:5000/api/v1/preferences/{pref_id}/meals')
        if preference_meals_response.status_code != 200:
            return "Preference Not found", 404
        preference_obj = storage.get(Preference, pref_id)
        data[preference_obj.name] = preference_meals_response.json()
    
    boxmeals = []
    for order_meal in order.order_meals:
        meal = storage.get(Meal, order_meal.meal_id)
        for _ in range(order_meal.quantity):
            boxmeals.append(meal)
    
    return render_template('order.html', order_details=order_details, Topmeal=topmeals, meal_details=meal_details, data=data, user=user, order_id=order_id,
                           boxmeals=boxmeals)



""" Admin dashbord  """

@app.route('/admin', strict_slashes=False)
def admin_count():
    """Shows the admin dashboard page

    This page displays a dashboard with the following information:
    - Total orders for each month in the year
    - Number of users and the percentage of active users
    - Number of plans and the percentage of active plans

    The page also displays a chart showing the evolution of the number of orders per month
    over the last year.

    The page also generates a unique id that can be used as an identifier for the dashboard
    in the database.
    """
    data = storage.month_data()
    chartdata = storage.charts_data()

    latest_orders = {}

    for order in storage.get_latest_orders(6):
        latest_orders[order.id] = order.created_at

    
    return render_template('admin/template/index.html', data=data, chartdata=chartdata, latest_orders=latest_orders, unique_id=uuid4())



@app.route('/admin/users', strict_slashes=False)
def admin_users():
    """ UI for CRUD operation on users """
    users = storage.users_data()
    return render_template('admin/template/users.html',users=users, unique_id=uuid4())



@app.route('/admin/orders', strict_slashes=False)
def admin_orders():
    """ UI for CRUD operation on orders """

    orders = storage.orders_data()
    return render_template('admin/template/orders.html', orders=orders, unique_id=uuid4())


@app.route('/admin/meals', strict_slashes=False)
def admin_meals():
    """ UI for CRUD operation on meals """
    meals = storage.meals_data()
    preferences = storage.preferences_data()
    return render_template('admin/template/meals.html',meals=meals, preferences=preferences, unique_id=uuid4())



@app.route('/admin/settings', strict_slashes=False)
def admin_setting():
    """ UI for admin settings """
    """ data = storage.admin_data() """
    return render_template('admin/template/settings.html', unique_id=uuid4())


if __name__ == "__main__":
    host = "0.0.0.0"
    port = 5005
    app.run(host=host, port=port, debug=True)
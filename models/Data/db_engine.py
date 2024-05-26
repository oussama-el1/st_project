#!/usr/bin/python3
"""
Contains the class DBStorage
"""

from datetime import datetime, timedelta
from os import getenv
from sqlalchemy import create_engine, Index, func
from sqlalchemy.orm import scoped_session, sessionmaker
from models.base import Base
from models.user import User
from models.plan import Plan
from models.order import Order
from models.meals import Meal
from models.ingredients import Ingredient
from models.address import Address
from models.mealIngredient import MealIngredient
from models.OrderMeals import OrderMeal
from models.customization import CustomizationOptions
from models.order_meal_cust import OrderMealCustomization
from models.Preference import Preference
from models.mealPreference import MealPreference
from models.order_preferences import OrderPreference


classes = {"User": User, "Plan": Plan, "Order": Order, "Meal": Meal, "Ingredient": Ingredient, "Address": Address, "Preference": Preference}
meal_id_index = Index('meal_id_index', Meal.id)
order_id_index = Index('order_id_index', Order.id)

table_order = [
    Base.metadata.tables['address'],
    Base.metadata.tables['users'],
    Base.metadata.tables['plans'],
    Base.metadata.tables['meals'],
    Base.metadata.tables['preferences'],
    Base.metadata.tables['orders'],
    Base.metadata.tables['ingredients'],
    Base.metadata.tables['meal_ingredients'],
    Base.metadata.tables['order_meals'],
    Base.metadata.tables['customization_options'],
    Base.metadata.tables['order_meal_customization'],
    Base.metadata.tables['meal_preferences'],
    Base.metadata.tables['order_preferences']
]


class DBStorage:
    """Interacts with the MySQL database"""
    __engine = None
    __session = None

    def __init__(self):
        """Instantiate a DBStorage object"""
        self.__engine = create_engine('mysql+mysqldb://root:@localhost/nershormeals1',pool_pre_ping=True)
        

    def all(self, cls=None):
        """Query on the current database session"""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return new_dict

    def new(self, obj):
        """Add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """Commit all changes of the current database session"""
        self.__session.commit()

    def delete(self, obj=None):
        """Delete from the current database session obj if not None"""
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        """Reloads data from the database"""
        Base.metadata.create_all(self.__engine, tables=table_order)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session

    def close(self):
        """Call remove() method on the private session attribute"""
        self.__session.remove()

    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        if cls not in classes.values():
            return None

        all_cls = self.all(cls)
        for value in all_cls.values():
            if value.id == id:
                return value

        return None

    def count(self, cls=None):
        """
        Count the number of objects in storage
        """
        if not cls:
            count = 0
            for clas in classes.values():
                count += len(self.all(clas).values())
        else:
            count = len(self.all(cls).values())

        return count

    def month_data(self):
        """ Query count of orders created in the current month """
        current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if current_month_start.month == 12:
            current_month_end = datetime.now().replace(day=31, month=current_month_start.month, hour=0, minute=0, second=0, microsecond=0)
        else:
            current_month_end = current_month_start.replace(month=current_month_start.month + 1)

        orders_count_in_current_month = self.__session.query(func.count(Order.id)).filter(
            Order.created_at >= current_month_start,
            Order.created_at < current_month_end
        ).scalar()

        total_orders = self.count(Order)
        orders_percentage = 0 if total_orders == 0 else round((orders_count_in_current_month / total_orders) * 100, 2)

        users_count_in_current_month = self.__session.query(func.count(User.id)).filter(
            User.created_at >= current_month_start,
            User.created_at < current_month_end
        ).scalar()

        total_users = self.count(User)
        users_percentage = 0 if total_users == 0 else round((users_count_in_current_month / total_users) * 100, 2)

        sales_count_in_current_month = self.__session.query(func.sum(Plan.boxtotale)).filter(
            Plan.created_at >= current_month_start,
            Plan.created_at < current_month_end
        ).scalar()

        total_sales = self.__session.query(func.sum(Plan.boxtotale)).scalar()
        
        sales_count_in_current_month = 0 if sales_count_in_current_month is None else round(sales_count_in_current_month, 2)
        total_sales = 0 if total_sales is None else total_sales
        
        sales_percentage = 0 if total_sales == 0 else round((sales_count_in_current_month / total_sales) * 100, 2)

        monthly_data = {
            'orders': {'count': orders_count_in_current_month, 'percentage': orders_percentage},
            'users': {'count': users_count_in_current_month, 'percentage': users_percentage},
            'sales': {'count': sales_count_in_current_month, 'percentage': sales_percentage}
        }
        return monthly_data


    def get_latest_orders(self, num_orders: int) -> list:
            """Returns a list of the latest orders in the database.

            Args:
                num_orders (int): The maximum number of orders to return.

            Returns:
                list: A list of the latest orders in the database.
            """
            return self.__session.query(Order).order_by(Order.created_at.desc()).limit(num_orders).all()


    def charts_data(self) -> dict:
        """
        Returns a dictionary containing data for charts.
        The dictionary has two keys: 'status' and 'earning'.

        The 'status' key maps to a dictionary with the following keys:
            - pending: number of orders in the 'pending' status
            - delivered: number of orders in the 'delivered' status
            - canceled: number of orders in the 'canceled' status
            - confirmed: number of orders in the 'confirmed' status

        The 'earning' key maps to a dictionary with the following keys:
            - January: total earnings in January
            - February: total earnings in February
            - ...: total earnings in each month of the year
        """
        # Get the number of each status in the orders table
        pending_count = self.__session.query(Order.id).filter(Order.status == 'pending').count()
        delivered_count = self.__session.query(Order.id).filter(Order.status == 'delivered').count()
        canceled_count = self.__session.query(Order.id).filter(Order.status == 'cancelled').count()
        confirmed_count = self.__session.query(Order.id).filter(Order.status == 'confirmed').count()

        # Create the 'status' dictionary
        chart_data = {
            'pending': pending_count,
            'delivered': delivered_count,
            'cancelled': canceled_count,
            'confirmed': confirmed_count
        }

        # Create the 'earning' dictionary
        earning = {}
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        for i in range(1, 13):
            current_month_start = datetime.now().replace(day=1, month=i, hour=0, minute=0, second=0, microsecond=0)
            if i == 12:
                current_month_end = datetime.now().replace(day=31, month=i, hour=0, minute=0, second=0, microsecond=0)
            else:
                current_month_end = current_month_start.replace(month=current_month_start.month + 1)
            earning_in_current_month = self.__session.query(func.sum(Plan.boxtotale)).filter(
                Plan.created_at >= current_month_start,
                Plan.created_at < current_month_end
            )

            if earning_in_current_month.scalar() is None:
                earning[months[i-1]] = 0
            else:
                earning[months[i-1]] = round(earning_in_current_month.scalar(), 2)

        # Add the 'earning' dictionary to the 'charts_data' dictionary
        chart_data['earning'] = earning

        return chart_data

    @classmethod
    def calculate_total_spend_by_user(cls, session, user_id):
        total_spend = (
            session.query(func.sum(Plan.boxtotale))
            .join(Order)
            .filter(Order.user_id == user_id)
            .scalar()
        )
        
        total_spend = 0 if total_spend is None else total_spend

        return round(total_spend, 2)

    @classmethod
    def calculate_number_of_orders_by_user(cls, session, user_id):
        number_of_orders = (
            session.query(func.count(Order.id))
            .filter(Order.user_id == user_id)
            .scalar()
        )
        return number_of_orders

    def users_data(self):
        """
        Get user data including total spending and number of orders.
        """
        users_objects = self.all(User).values()
        users_dicts = []

        for user in users_objects:
            users_dicts.append(user.to_dict())

        for user in users_dicts:
            user_id = user.get('id')
            user['totale_spend'] = self.calculate_total_spend_by_user(self.__session, user_id)
            user['total_orders'] = self.calculate_number_of_orders_by_user(self.__session, user_id)
            
            original_date_str = user.get('created_at')
            original_date = datetime.strptime(original_date_str, "%Y-%m-%dT%H:%M:%S.%f")
            formatted_date = original_date.strftime("%m/%d/%Y %H:%M:%S")
            user['created_at'] = formatted_date

            original_date_str = user.get('updated_at')
            original_date = datetime.strptime(original_date_str, "%Y-%m-%dT%H:%M:%S.%f")
            formatted_date = original_date.strftime("%m/%d/%Y %H:%M:%S")
            user['updated_at'] = formatted_date

        return users_dicts

    def orders_data(self):
        """
            Get orders date including order id  : done
            user id (this can be link to the user row in the table) : done
            status : done
            Order date : done
            Totale : done
            Delivery address (state, city, , street, apt) : done
            delivery date 
            user email
            User tel
        """

        orders = self.all(Order).values()
        orders_data = []

        for order in orders:
            """ get data for each user """
            email = order.user.email
            tel = order.user.tel

            plan = self.get(Plan, order.plan_id)
            if plan is not None:
                totale = plan.boxtotale
            else:
                totale = 0

            if len(order.user.addresses) > 0:
                adress_object = order.user.addresses[-1] # get last address
                delivry_adress = f"{adress_object.state}, {adress_object.city} [{adress_object.zipcode}], {adress_object.street} , {adress_object.apt}"
            else:
                delivry_adress = "No address"

            order_date = order.created_at.strftime("%m/%d/%Y %H:%M:%S")
            # add two days to the order date
            delivery_date = (order.created_at + timedelta(days=2)).strftime("%m/%d/%Y %H:%M:%S")

            if order.status == 'pending':
                color = 'yellow'
            elif order.status == 'delivered':
                color = 'green'
            elif order.status == 'cancelled':
                color = 'red'
            else:
                color = 'primary'

            
            # meals_objects = order.meals
            
            # meals = [ meal.to_dict() for meal in meals_objects]
            meals = []
            for order_meal in order.order_meals:
                meal = self.get(Meal, order_meal.meal.id)
                if meal is not None:
                    meal_data = meal.to_dict()
                    meal_data['quantity'] = order_meal.quantity
                    if meal_data not in meals:
                        meals.append(meal_data)

            order_data = {
                'order_id': order.id,
                'user_id': order.user_id,
                'status': order.status,
                'color': color,
                'order_date': order_date,
                'totale': totale,
                'delivery_address': delivry_adress,
                'delivery_date': delivery_date,
                'user_email': email,
                'user_tel': tel,
                'meals': meals
            }

            orders_data.append(order_data)

        return orders_data



    def meals_data(self):
        """
        Get the data for each meal
        """
        meals = self.all(Meal).values()
        meals_data = []
        for meal in meals :
            ingredients = []
            for ingredient in meal.ingredients:
                ingredients.append(ingredient.ingredientsName)
            meal_dict = meal.to_dict()
            meal_dict['ingredients'] = ingredients
            meals_data.append(meal_dict)

        return meals_data

    def preferences_data(self):
        """
        Get the data for each preference
        """
        preferences = self.all(Preference).values()
        preferences_data = []
        for preference in preferences :
            preference_dict = preference.to_dict()
            preferences_data.append(preference_dict)

        return preferences_data


    def get_orders_for_a_user(self, user_id):
        orders = self.__session.query(Order).filter(Order.user_id == user_id).all()
        return orders


    def email_users(self, email):
        """ Users with an email address """
        user = self.__session.query(User).filter(User.email == email).first()
        return user
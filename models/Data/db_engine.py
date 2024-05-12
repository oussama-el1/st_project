#!/usr/bin/python3
"""
Contains the class DBStorage
"""

from datetime import datetime
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
        self.__engine = create_engine('mysql+mysqldb://root:root@localhost/nershormeals2',pool_pre_ping=True)
        

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
        # Query count of orders created in the current month
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
        canceled_count = self.__session.query(Order.id).filter(Order.status == 'canceled').count()
        confirmed_count = self.__session.query(Order.id).filter(Order.status == 'confirmed').count()

        # Create the 'status' dictionary
        chart_data = {
            'pending': pending_count,
            'delivered': delivered_count,
            'canceled': canceled_count,
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

            # Add the earnings for the current month to the 'earning' dictionary
            earning[months[i-1]] = earning_in_current_month.scalar()

        # Add the 'earning' dictionary to the 'charts_data' dictionary
        chart_data['earning'] = earning

        return chart_data

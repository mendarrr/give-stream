from models import db
from functools import wraps
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask import Flask, make_response,jsonify,session,request, current_app, jsonify
from flask_restful import Resource, Api
import bcrypt
from datetime import datetime, timedelta

from config import app,db,api
from models import db, Admin, Donor,Charity


# Views go here!
class checkSession(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt_identity()
        if claims:
            return {"user is logged in": "True"},200
        else:
            return {"message": "Invalid token user not logged in"}, 401
        
from models import db, Admin, Donor, Donation,Charity,CharityApplication,Beneficiary,Inventory,Story

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] != 'admin':
                return jsonify(msg='Admins only!'), 403
            else:
                return fn(*args, **kwargs)
        return decorator
    return wrapper

def donor_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] != 'donor':
                return jsonify(msg='Donors only!'), 403
            else:
                return fn(*args, **kwargs)
        return decorator
    return wrapper

def charity_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] != 'charity':
                return jsonify(msg='Charities only!'), 403
            else:
                return fn(*args, **kwargs)
        return decorator
    return wrapper

def admin_or_donor_or_charity_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt_identity()
            if claims['role'] not in ['admin', 'donor', 'charity']:
                return jsonify(msg='Unauthorized'), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

from datetime import timedelta

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username and password are required'}, 400

        donor = Donor.query.filter_by(username=username).first()
        charity = Charity.query.filter_by(username=username).first()
        admin = Admin.query.filter_by(username=username).first()

        if donor:
            if donor.authenticate(password):
                access_token = create_access_token(
                    identity={'id': donor.id, 'role': 'donor'},
                    expires_delta=timedelta(days=4)
                )
                session['id'] = donor.id
                return {'access_token': access_token}, 200
            else:
                return {'message': 'Invalid password for donor'}, 401
        elif charity:
            if charity.authenticate(password):
                access_token = create_access_token(
                    identity={'id': charity.id, 'role': 'charity'},
                    expires_delta=timedelta(days=4)
                )
                session['id'] = charity.id
                return {'access_token': access_token}, 200
            else:
                return {'message': 'Invalid password for charity'}, 401    
        elif admin:
            if admin._password_hash is None:
                return {'message': 'Admin password not set'}, 500
            if admin.authenticate(password):
                access_token = create_access_token(
                    identity={'id': admin.id, 'role': 'admin'},
                    expires_delta=timedelta(days=4)
                )
                return {'access_token': access_token, 'role': 'admin'}, 200
            else:
                return {'message': 'Invalid password for admin'}, 401
        else:
            return {'message': 'User not found'}, 404

class Donations(Resource):
    # Retrieve all donations
    def get(self, donor_id=None, charity_id=None):
        if donor_id is not None:
            return self.get_donation_by_donor_id(donor_id)
        elif charity_id is not None:
            return self.get_donation_by_charity_id(charity_id)
        else:
            all_donations = Donation.query.all()
            donations_json = [donation.to_dict() for donation in all_donations]
            return donations_json

    # Retrieve donations by donor id and the sum
    def get_donation_by_donor_id(self, donor_id):
        donor_donations = Donation.query.filter_by(donor_id=donor_id).all()
        if donor_donations:
            donations_json = [donation.to_dict() for donation in donor_donations]
            total_amount = sum(donation.amount for donation in donor_donations)
            return {
                'donations': donations_json,
                'total_amount': total_amount
            }
        else:
            return {'message': 'No donations found for this donor'}, 404
        
    # Retrieve donations by charity id and the sum
    def get_donation_by_charity_id(self, charity_id):
        charity_donations = Donation.query.filter_by(charity_id=charity_id).all()
        if charity_donations:
            donations_json = [donation.to_dict() for donation in charity_donations]
            total_amount = sum(donation.amount for donation in charity_donations)
            return {
                'donations': donations_json,
                'total_amount': total_amount
            }
        else:
            return {'message': 'No donations found for this charity'}, 404.
    
    # Create a new donation
    def post(self):
        data = request.get_json()
        date = datetime.strptime(data['date'], '%Y-%m-%d')
        new_donation = Donation(
            donor_id=data['donor_id'],
            charity_id=data['charity_id'],
            amount=data['amount'],
            date=date,
            is_anonymous=data['is_anonymous'],
            is_recurring=data['is_recurring'],
            recurring_frequency=data['recurring_frequency']
        )
        db.session.add(new_donation)
        db.session.commit()
        return new_donation.to_dict()
    
    # Updating a donation
    def put(self, id):
        data = request.get_json()
        donation = Donation.query.get(id)
        if donation:
            donation.donor_id = data['donor_id']
            donation.charity_id = data['charity_id']
            donation.amount = data['amount']
            donation.date = datetime.strptime(data['date'], '%Y-%m-%d')
            donation.is_anonymous = data['is_anonymous']
            donation.is_recurring = data['is_recurring']
            donation.recurring_frequency = data['recurring_frequency']
            db.session.commit()
            return donation.to_dict()
        else:
            return {'message': 'Donation not found'}, 404
        

        # inventory



class InventoryResource(Resource):
    # Retrieve all inventory items
    def get(self, id=None):
        if id:
            inventory_item = Inventory.query.get(id)
            if inventory_item:
                return jsonify(inventory_item.to_dict())
            return {'message': 'Inventory item not found'}, 404
        else:
            inventory_list = Inventory.query.all()
            return jsonify([item.to_dict() for item in inventory_list])

    # Create a new inventory item
    def post(self):
        data = request.get_json()
        try:
            new_item = Inventory(
                charity_id=data['charity_id'],
                item_name=data['item_name'],
                quantity=data['quantity'],
                date_updated=datetime.now()  # Set current date and time
            )
            db.session.add(new_item)
            db.session.commit()
            return new_item.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'Failed to create item', 'error': str(e)}, 400

    # Update an existing inventory item
    def put(self, id):
        data = request.get_json()
        inventory_item = Inventory.query.get(id)
        if inventory_item:
            try:
                inventory_item.charity_id = data['charity_id']
                inventory_item.item_name = data['item_name']
                inventory_item.quantity = data['quantity']
                inventory_item.date_updated = datetime.now()  # Update timestamp
                db.session.commit()
                return inventory_item.to_dict()
            except Exception as e:
                db.session.rollback()
                return {'message': 'Failed to update item', 'error': str(e)}, 400
        else:
            return {'message': 'Inventory item not found'}, 404

    # Delete an inventory item
    def delete(self, id):
        inventory_item = Inventory.query.get(id)
        if inventory_item:
            try:
                db.session.delete(inventory_item)
                db.session.commit()
                return {'message': 'Item deleted successfully'}, 200
            except Exception as e:
                db.session.rollback()
                return {'message': 'Failed to delete item', 'error': str(e)}, 400
        else:
            return {'message': 'Inventory item not found'}, 404

# Add the InventoryResource to the API
# api.add_resource(InventoryResource, '/inventory', '/inventory/<int:id>')

# if __name__ == '__main__':
#     app.run(debug=True)
# # Routes
api.add_resource(Login, '/login');    
api.add_resource(Donations, '/donations','/donations/<int:id>', '/donations/donor/<int:donor_id>', '/donations/charity/<int:charity_id>')
api.add_resource(InventoryResource, '/inventory', '/inventory/<int:id>')
        

if __name__ == '__main__':
    app.run(debug=True)

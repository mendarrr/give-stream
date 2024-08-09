from models import db
from functools import wraps
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask import Flask, make_response,jsonify,session,request, current_app, jsonify
from flask_restful import Resource, Api
import bcrypt
from datetime import datetime, timedelta
from flask_apscheduler import APScheduler
from notification_service import run_notification_service

from config import app,db,api
from models import db, Admin, Donor,Charity, PaymentMethod, Message


scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

@scheduler.task('cron', id='notify_subscriptions', hour=0)
def scheduled_notification_service():
    run_notification_service()

# Home page
class Index(Resource):
    def get(self):
        return jsonify({"Message": "Welcome to GiveStream API"})

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
from flask_restful import Resource
from flask import request, jsonify
from models import db, Charity, Donation
from datetime import datetime, timedelta

class Charities(Resource):
    def get(self, id=None):
        if id:
            charity = Charity.query.get_or_404(id)
            charity_dict = charity.to_dict()
            
            # Add recent donors
            recent_donors = Donation.query.filter_by(charity_id=id).order_by(Donation.date.desc()).limit(3).all()
            charity_dict['recentDonors'] = [
                {
                    'name': donor.donor.username if not donor.is_anonymous else 'Anonymous',
                    'amount': donor.amount,
                    'type': 'Recent donation'
                } for donor in recent_donors
            ]
            
            # Add recent donation count
            charity_dict['recentDonationCount'] = Donation.query.filter_by(charity_id=id).filter(Donation.date >= datetime.utcnow() - timedelta(hours=24)).count()
            
            return charity_dict
        else:
            charities = Charity.query.all()
            return jsonify([charity.to_dict_with_stats() for charity in charities])

def to_dict_with_stats(self):
    donations = Donation.query.filter_by(charity_id=self.id).all()
    total_raised = sum(donation.amount for donation in donations)
    donation_count = len(donations)
    percentage_raised = (total_raised / self.needed_donation) * 100 if self.needed_donation else 0

    return {
        'id': self.id,
        'name': self.name,
        'total_raised': total_raised,
        'donation_count': donation_count,
        'percentage_raised': percentage_raised,
        'needed_donation': self.needed_donation
    }

    def post(self):
        data = request.get_json()
        new_charity = Charity(
            username=data['username'],
            email=data['email'],
            name=data['name'],
            description=data.get('description'),
            needed_donation=data.get('needed_donation'),
            goal_amount=data.get('goal_amount'),
            image_url=data.get('image_url'),
            organizer=data.get('organizer')
        )
        new_charity.password_hash = data['password']
        db.session.add(new_charity)
        db.session.commit()
        return new_charity.to_dict(), 201

    def put(self, id):
        charity = Charity.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(charity, key, value)
        db.session.commit()
        return charity.to_dict()

    def delete(self, id):
        charity = Charity.query.get_or_404(id)
        db.session.delete(charity)
        db.session.commit()
        return '', 204
    

class CharityApplications(Resource):
    def get(self):
        applications = CharityApplication.query.all()
        return jsonify([app.to_dict() for app in applications])

    def post(self):
        data = request.get_json()
        
        # Ensure all fields are handled correctly
        new_application = CharityApplication(
            name=data['name'],
            email=data['email'],
            description=data['description'],
            status=data.get('status', 'pending'),  # Default to 'pending' if not provided
            submission_date=data.get('submission_date'),
            reviewed_by=data.get('reviewed_by'),
            review_date=data.get('review_date'),
            country=data.get('country'),
            city=data.get('city'),
            zipcode=data.get('zipcode'),
            fundraising_category=data.get('fundraising_category'),
            title=data.get('title'),
            target_amount=data.get('target_amount'),
            image=data.get('image')  # Include image field
        )
        
        db.session.add(new_application)
        db.session.commit()
        
        return new_application.to_dict(), 201

    def put(self, id):
        application = CharityApplication.query.get_or_404(id)
        data = request.get_json()
        application.status = data['status']
        # application.reviewed_by = get_jwt_identity()['id']  # Comment out this line

        if data['status'] == 'approved':
            new_charity = Charity(
                username=application.name.lower().replace(' ', '_'),
                email=application.email,
                name=application.name,
                description=application.description
            )
            db.session.add(new_charity)
            
        application.country = data.get('country', application.country)
        application.city = data.get('city', application.city)
        application.zipcode = data.get('zipcode', application.zipcode)
        application.fundraising_category = data.get('fundraising_category', application.fundraising_category)
        application.title = data.get('title', application.title)
        application.target_amount = data.get('target_amount', application.target_amount)

        db.session.commit()
        return application.to_dict(), 200

    
class CommonDashboard(Resource):
    def get(self):
        return {
            'total_donations': db.session.query(db.func.sum(Donation.amount)).scalar() or 0,
            'charity_count': Charity.query.count(),
            'donor_count': Donor.query.count(),
            'story_count': Story.query.count(),
            'total_users': Donor.query.count() + Charity.query.count() + Admin.query.count()
        }

class AdminDashboard(Resource):
    #@admin_required()
    def get(self):
        total_donations = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
        charity_count = Charity.query.count()
        donor_count = Donor.query.count()
        recent_donations = Donation.query.order_by(Donation.date.desc()).limit(10).all()
        pending_applications = CharityApplication.query.filter_by(status='pending').count()
        total_donation_amount = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
        active_donors = db.session.query(Donor.id).join(Donation).distinct().count()
        story_count = Story.query.count()
        beneficiary_count = Beneficiary.query.count()
        total_inventory_items = db.session.query(db.func.sum(Inventory.quantity)).scalar() or 0
        charity_application_count = CharityApplication.query.count()
        total_users = (
            Donor.query.count() +
            Charity.query.count() +
            Admin.query.count()
        )

        return {
            'total_users': total_users,
            'total_donations': total_donations,
            'charity_count': charity_count,
            'donor_count': donor_count,
            'recent_donations': [donation.to_dict() for donation in recent_donations],
            'pending_applications': pending_applications,
            'total_donation_amount': float(total_donation_amount),
            'active_donors': active_donors,
            'story_count': story_count,
            'beneficiary_count': beneficiary_count,
            'total_inventory_items': total_inventory_items,
            'charity_application_count': charity_application_count
        }
    
class CharityDashboard(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt_identity()
        charity_id = claims.get('id')
        
        all_charity_data = {
            'total_charities': Charity.query.count(),
            'total_donations_all_charities': db.session.query(db.func.sum(Donation.amount)).scalar() or 0,
            'total_beneficiaries': Beneficiary.query.count(),
            'total_stories': Story.query.count()
        }
        
        if charity_id:
            specific_charity_data = {
                'charity_donations': db.session.query(db.func.sum(Donation.amount)).filter(Donation.charity_id == charity_id).scalar() or 0,
                'charity_donors': db.session.query(Donor.id).join(Donation).filter(Donation.charity_id == charity_id).distinct().count(),
                'charity_stories': Story.query.filter_by(charity_id=charity_id).count(),
                'charity_beneficiaries': Beneficiary.query.filter_by(charity_id=charity_id).count(),
                'charity_inventory': db.session.query(db.func.sum(Inventory.quantity)).filter(Inventory.charity_id == charity_id).scalar() or 0
            }
            all_charity_data.update(specific_charity_data)
        
        return all_charity_data
    
class DonorDashboard(Resource):
    @jwt_required()
    def get(self):
        claims = get_jwt_identity()
        donor_id = claims.get('id')
        
        all_donor_data = {
            'total_donors': Donor.query.count(),
            'total_donations': db.session.query(db.func.sum(Donation.amount)).scalar() or 0,
            'average_donation': db.session.query(db.func.avg(Donation.amount)).scalar() or 0
        }
        
        if donor_id:
            specific_donor_data = {
                'donor_total_donated': db.session.query(db.func.sum(Donation.amount)).filter(Donation.donor_id == donor_id).scalar() or 0,
                'donor_donation_count': Donation.query.filter_by(donor_id=donor_id).count(),
                'donor_charities_supported': db.session.query(Charity.id).join(Donation).filter(Donation.donor_id == donor_id).distinct().count()
            }
            all_donor_data.update(specific_donor_data)
        
        return all_donor_data

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
        
class DonorResource(Resource):
    def get(self, donor_type=None, id=None):
        if id:
            donor = Donor.query.get(id)
            if donor:
                return donor.to_dict()
            return {'message': 'Donor not found'}, 404
        elif donor_type == 'anonymous':
            donors = Donor.query.filter_by(is_anonymous=True).all()
        elif donor_type == 'non-anonymous':
            donors = Donor.query.filter_by(is_anonymous=False).all()
        else:
            donors = Donor.query.all()
        return jsonify([donor.to_dict() for donor in donors])

    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        is_anonymous = data.get('is_anonymous', False)

        if Donor.query.filter_by(username=username).first():
            return {'message': 'Username already exists'}, 400
        if Donor.query.filter_by(email=email).first():
            return {'message': 'Email already exists'}, 400

        new_donor = Donor(
            username=username,
            email=email,
            is_anonymous=is_anonymous
        )
        new_donor.password_hash = password

        db.session.add(new_donor)
        db.session.commit()

        return new_donor.to_dict(), 201

    def put(self, id):
        donor = Donor.query.get(id)
        if not donor:
            return {'message': 'Donor not found'}, 404

        data = request.get_json()
        donor.username = data.get('username', donor.username)
        donor.email = data.get('email', donor.email)
        donor.is_anonymous = data.get('is_anonymous', donor.is_anonymous)

        if 'password' in data:
            donor.password_hash = data['password']

        db.session.commit()
        return donor.to_dict(), 200

    def delete(self, id):
        donor = Donor.query.get(id)
        if not donor:
            return {'message': 'Donor not found'}, 404

        db.session.delete(donor)
        db.session.commit()
        return {'message': 'Donor deleted successfully'}, 200

        
class StoryResource(Resource):
    def get(self, id=None):
        try:
            if id is None:
                stories = Story.query.all()
                return make_response(jsonify([story.to_dict() for story in stories]), 200)
            else:
                story = Story.query.get(id)
                if story:
                    return make_response(story.to_dict(), 200)
                return make_response(jsonify({"error": "Story not found"}), 404)
        except Exception as e:
            print(f"Error during GET: {e}")
            return make_response(jsonify({"error": "An error occurred during GET"}), 500)

    def post(self):
        try:
            data = request.get_json()
            # Parse the date_posted string to a datetime object
            date_posted_str = data.get('date_posted')
            if date_posted_str:
                date_posted = datetime.strptime(date_posted_str, "%a, %d %b %Y %H:%M:%S GMT")
            else:
                date_posted = datetime.utcnow()  # default to current time if not provided

            new_story = Story(
                title=data['title'],
                content=data['content'],
                charity_id=data['charity_id'],
                date_posted=date_posted
            )
            db.session.add(new_story)
            db.session.commit()
            return make_response(new_story.to_dict(), 201)
        except Exception as e:
            print(f"Error during POST: {e}")
            return make_response(jsonify({"error": "An error occurred during POST"}), 500)

    def put(self, id):
        try:
            data = request.get_json()
            story = Story.query.get(id)
            if story:
                story.title = data['title']
                story.content = data['content']
                db.session.commit()
                return make_response(story.to_dict(), 200)
            return make_response(jsonify({"error": "Story not found"}), 404)
        except Exception as e:
            print(f"Error during PUT: {e}")
            return make_response(jsonify({"error": "An error occurred during PUT"}), 500)

    def patch(self, id):
        try:
            data = request.get_json()
            story = Story.query.get(id)
            if story:
                if 'title' in data:
                    story.title = data['title']
                if 'content' in data:
                    story.content = data['content']
                db.session.commit()
                return make_response(story.to_dict(), 200)
            return make_response(jsonify({"error": "Story not found"}), 404)
        except Exception as e:
            print(f"Error during PATCH: {e}")
            return make_response(jsonify({"error": "An error occurred during PATCH"}), 500)

    def delete(self, id):
        try:
            story = Story.query.get(id)
            if story:
                db.session.delete(story)
                db.session.commit()
                return make_response('', 204)
            return make_response(jsonify({"error": "Story not found"}), 404)
        except Exception as e:
            print(f"Error during DELETE: {e}")
            return make_response(jsonify({"error": "An error occurred during DELETE"}), 500)


class Beneficiaries(Resource):
    # Retrieve all beneficiaries
    def get(self, beneficiary_id=None):
        if beneficiary_id:
            beneficiary = Beneficiary.query.get_or_404(beneficiary_id)
            return beneficiary.to_dict()
        else:
            beneficiaries = Beneficiary.query.all()
            return [beneficiary.to_dict() for beneficiary in beneficiaries]
        
    # Create a beneficiary
    def post(self):
        data = request.get_json()
        new_beneficiary = Beneficiary(
            charity_id=data['charity_id'],
            name=data['name'],
            description=data.get('description')
        )
        db.session.add(new_beneficiary)
        db.session.commit()
        return new_beneficiary.to_dict(), 201
    
    # Update a beneficiary
    def put(self, beneficiary_id):
        beneficiary = Beneficiary.query.get_or_404(beneficiary_id)
        data = request.get_json()
        beneficiary.charity_id = data.get('charity_id', beneficiary.charity_id)
        beneficiary.name = data.get('name', beneficiary.name)
        beneficiary.description = data.get('description', beneficiary.description)
        db.session.commit()
        return beneficiary.to_dict()
    
    # Delete a beneficiary
    def delete(self, beneficiary_id):
        beneficiary = Beneficiary.query.get_or_404(beneficiary_id)
        db.session.delete(beneficiary)
        db.session.commit()
        return '', 204

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
            
class PaymentMethods(Resource):
    def get(self, id=None):
        if id:
            payment_method = PaymentMethod.query.get_or_404(id)
            return payment_method.to_dict()
        else:
            payment_methods = PaymentMethod.query.all()
            return [pm.to_dict() for pm in payment_methods]

    def post(self):
        data = request.get_json()
        new_payment_method = PaymentMethod(name=data['name'], description=data.get('description'))
        db.session.add(new_payment_method)
        db.session.commit()
        return new_payment_method.to_dict(), 201

    def put(self, id):
        payment_method = PaymentMethod.query.get_or_404(id)
        data = request.get_json()
        payment_method.name = data.get('name', payment_method.name)
        payment_method.description = data.get('description', payment_method.description)
        db.session.commit()
        return payment_method.to_dict()

    def delete(self, id):
        payment_method = PaymentMethod.query.get_or_404(id)
        db.session.delete(payment_method)
        db.session.commit()
        return '', 204

class MessageResource(Resource):
    def get(self):
        messages = Message.query.all()
        return jsonify([message.to_dict() for message in messages])

    def post(self):
        data = request.get_json()
        new_message = Message(
            email=data['email'],
            content=data['content']
        )
        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict(), 201
    
class AnswerMessage(Resource):
    def put(self, id):
        message = Message.query.get_or_404(id)
        message.is_answered = True
        db.session.commit()
        return message.to_dict()

# # Routes
api.add_resource(Index, '/')
api.add_resource(Login, '/login');    
api.add_resource(Donations, '/donations','/donations/<int:id>', '/donations/donor/<int:donor_id>', '/donations/charity/<int:charity_id>')
api.add_resource(StoryResource, '/stories', '/stories/<int:id>')     
api.add_resource(Beneficiaries, '/beneficiaries', '/beneficiaries/<int:beneficiary_id>')
api.add_resource(DonorResource, '/donors', '/donors/<string:donor_type>', '/donors/<int:id>')
api.add_resource(InventoryResource, '/inventory', '/inventory/<int:id>')
api.add_resource(Charities, '/charities', '/charities/<int:id>')
api.add_resource(CharityApplications, '/charity-applications', '/charity-applications/<int:id>')
api.add_resource(PaymentMethods, '/payment-methods', '/payment-methods/<int:id>')
api.add_resource(CommonDashboard, '/dashboard/common')
api.add_resource(AdminDashboard, '/dashboard/admin')
api.add_resource(CharityDashboard, '/dashboard/charity')
api.add_resource(DonorDashboard, '/dashboard/donor')   
api.add_resource(MessageResource, '/messages')
api.add_resource(AnswerMessage, '/messages/<int:id>/answer')

if __name__ == '__main__':
    app.run(debug=True)
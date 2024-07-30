from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from models import db, Donor, Charity, Admin, CharityApplication, Donation, Story, Beneficiary, Inventory

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///give_stream.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

@app.route('/')
def home():
    return "Welcome to the Charity Donation Platform"

class DonationResource(Resource):
    # Method used to get all donation records from the databasedef get(self, donor_id=None, charity_id=None)
    def get(self, donor_id=None, charity_id=None):
        if donor_id is not None:
            return self.get_donation_by_donor_id(donor_id)
        elif charity_id is not None:
            return self.get_donation_by_charity_id(charity_id)
        else:
            all_donations = Donation.query.all()
            donations_json = [donation.serialize() for donation in all_donations]
            return jsonify(donations_json)

    # Method to retrieve sum of all donations of a particular donor   
    def get_donation_by_donor_id(self, donor_id):
        donor_donations = Donation.query.filter_by(donor_id=donor_id).all()
        if donor_donations:
            donations_json = [donation.serialize() for donation in donor_donations]
            total_amount = sum(donation.amount for donation in donor_donations)
            return jsonify({
                'donations': donations_json,
                'total_amount': total_amount
            })
        else:
            return jsonify({'message': 'No donations found for this donor'}), 404
        
    # Method to retrieve sum of all donations of a particular charity id
    def get_donation_by_charity_id(self, charity_id):
        charity_donations = Donation.query.filter_by(charity_id=charity_id).all()
        if charity_donations:
            donations_json = [donation.serialize() for donation in charity_donations]
            total_amount = sum(donation.amount for donation in charity_donations)
            return jsonify({
                'donations': donations_json,
                'total_amount': total_amount
            })
        else:
            return jsonify({'message': 'No donations found for this charity'}), 404
    
    # Method used to add a new donation record to the database
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
        return jsonify(new_donation.serialize())
    
    # Method to update existing donation records by id
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
            return jsonify(donation.serialize())
        else:
            return jsonify({'message': 'Donation not found'}), 404

api.add_resource(DonationResource, '/donations','/donations/<int:id>', '/donations/donor/<int:donor_id>', '/donations/charity/<int:charity_id>')

if __name__ == '__main__':
    app.run(debug=True)

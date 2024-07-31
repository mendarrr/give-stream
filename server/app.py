from flask import Flask, request, jsonify, make_response
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

class Index(Resource):
    def get(self):
        response_dict = {"index": "Welcome to the GiveStream API"}
        return make_response(response_dict, 200)

api.add_resource(Index, '/')

class DonationResource(Resource):
    def get(self, donor_id=None, charity_id=None):
        if donor_id is not None:
            return self.get_donation_by_donor_id(donor_id)
        elif charity_id is not None:
            return self.get_donation_by_charity_id(charity_id)
        else:
            all_donations = Donation.query.all()
            donations_json = [donation.serialize_donation() for donation in all_donations]
            return jsonify(donations_json)

    def get_donation_by_donor_id(self, donor_id):
        donor_donations = Donation.query.filter_by(donor_id=donor_id).all()
        if donor_donations:
            donations_json = [donation.serialize_donation() for donation in donor_donations]
            total_amount = sum(donation.amount for donation in donor_donations)
            return jsonify({
                'donations': donations_json,
                'total_amount': total_amount
            })
        else:
            return jsonify({'message': 'No donations found for this donor'}), 404
        
    def get_donation_by_charity_id(self, charity_id):
        charity_donations = Donation.query.filter_by(charity_id=charity_id).all()
        if charity_donations:
            donations_json = [donation.serialize_donation() for donation in charity_donations]
            total_amount = sum(donation.amount for donation in charity_donations)
            return jsonify({
                'donations': donations_json,
                'total_amount': total_amount
            })
        else:
            return jsonify({'message': 'No donations found for this charity'}), 404
    
    def get_anonymous_donations_for_charity_id(self, charity_id):
        anonymous_donations = Donation.query.filter(
            (Donation.charity_id == charity_id) & (Donation.is_anonymous == True)
        ).all()
        donations_json = [donation.serialize_donation() for donation in anonymous_donations]
        total_sum = sum(donation.amount for donation in anonymous_donations)
        return jsonify({
            'donations': donations_json,
            'total_sum': total_sum
        })

    def get_non_anonymous_donations_by_charity(self, charity_id):
        non_anonymous_donations = Donation.query.filter(
            (Donation.charity_id == charity_id) & (Donation.is_anonymous == False)
        ).all()
        donations_json = [donation.serialize_donation() for donation in non_anonymous_donations]
        total_amount = sum(donation.amount for donation in non_anonymous_donations)
        return jsonify({
            'donations': donations_json,
            'total_amount': total_amount
        })

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
        return jsonify(new_donation.serialize_donation())
    
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
            return jsonify(donation.serialize_donation())
        else:
            return jsonify({'message': 'Donation not found'}), 404

api.add_resource(DonationResource, '/donations','/donations/<int:id>', '/donations/donor/<int:donor_id>', '/donations/charity/<int:charity_id>','/donations/charity/<int:charity_id>/anonymous','/donations/charity/<int:charity_id>/non-anonymous')

if __name__ == '__main__':
    app.run(debug=True)

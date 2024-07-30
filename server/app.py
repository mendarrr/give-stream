from flask import Flask
from flask import Flask, request, make_response, jsonify, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
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

class Donation(Resource):
    def get(self):
        all_donations = Donation.query.all()
        donations_json = [donation.serialize for donation in all_donations]
        return jsonify(donations_json)
    
    def post(self):
        data = request.get_json()
        new_donation = Donation(donor_id=data['donor_id'], charity_id=data['charity_id'],
                                amount=data['amount'], date=data['date'],
                                is_anonymous=data['is_anonymous'], is_recurring=data['is_recurring'],
                                recurring_frequency=data['recurring_frequency'],
                                next_donation_date=data['next_donation_date'])
        db.session.add(new_donation)
        db.session.commit()
        return jsonify(new_donation.serialize)
    
    def put(self, id):
        data = request.get_json()
        donation = Donation.query.get(id)
        if donation:
            donation.donor_id = data['donor_id']
            donation.charity_id = data['charity_id']
            donation.amount = data['amount']
            donation.date = data['date']
            donation.is_anonymous = data['is_anonymous']
            donation.is_recurring = data['is_recurring']
            donation.recurring_frequency = data['recurring_frequency']
            donation.next_donation_date = data['next_donation_date']
            db.session.commit()
            return jsonify(donation.serialize)
        else:
            return jsonify({'message': 'Donation not found'}), 404
        
api.add_resource(Donation, '/donations', '/donations/<int:id>')

if __name__ == '__main__':
    app.run(debug=True)

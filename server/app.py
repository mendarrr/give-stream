from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, Donor, Charity, Admin, CharityApplication, Donation, Story, Beneficiary, Inventory

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///give_stream.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/')
def home():
    return "Welcome to the Charity Donation Platform"

if __name__ == '__main__':
    app.run(debug=True)

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Donor(db.Model):
    __tablename__ = 'donors'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    donations = db.relationship('Donation', backref='donor', lazy='dynamic')

class Charity(db.Model):
    __tablename__ = 'charities'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(128), unique=True, nullable=False)
    description = db.Column(db.Text)
    needed_donation = db.Column(db.Float)
    donations = db.relationship('Donation', backref='charity', lazy='dynamic')
    stories = db.relationship('Story', backref='charity', lazy='dynamic')
    beneficiaries = db.relationship('Beneficiary', backref='charity', lazy='dynamic')
    inventories = db.relationship('Inventory', backref='charity', lazy='dynamic')

class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

class CharityApplication(db.Model):
    __tablename__ = 'charity_applications'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending') 
    submission_date = db.Column(db.DateTime, default=datetime.now)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admins.id'))
    review_date = db.Column(db.DateTime)

    admin = db.relationship('Admin', backref='reviewed_applications')

class Donation(db.Model):
    __tablename__ = 'donations'
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    is_anonymous = db.Column(db.Boolean, default=False)
    is_recurring = db.Column(db.Boolean, default=False)
    recurring_frequency = db.Column(db.String(20)) 
    next_donation_date = db.Column(db.DateTime)

class Story(db.Model):
    __tablename__ = 'stories'
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.now)

class Beneficiary(db.Model):
    __tablename__ = 'beneficiaries'
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)

class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    item_name = db.Column(db.String(128), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date_updated = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
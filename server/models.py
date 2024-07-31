from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db, bcrypt
from datetime import datetime
import re


#db = SQLAlchemy()

class Donor(db.Model):
    __tablename__ = 'donors'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    donations = db.relationship('Donation', backref='donor', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
    # Ensure _password_hash is a bytes object (if retrieved from database)
        if isinstance(self._password_hash, str):
            self._password_hash = self._password_hash.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_name(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} cannot be empty")
        return value.strip()

    @validates('email')
    def validate_email(self, key, value):
        if value:
            pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            if not re.match(pattern, value):
                raise ValueError("Invalid email format")
        return value


    def __repr__(self):
        return f"<Donor {self.id}: {self.username}>"


class Charity(db.Model):
    __tablename__ = 'charities'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(128), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    description = db.Column(db.Text)
    needed_donation = db.Column(db.Float)
    donations = db.relationship('Donation', backref='charity', lazy='dynamic')
    stories = db.relationship('Story', backref='charity', lazy='dynamic')
    beneficiaries = db.relationship('Beneficiary', backref='charity', lazy='dynamic')
    inventories = db.relationship('Inventory', backref='charity', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
    # Ensure _password_hash is a bytes object (if retrieved from database)
        if isinstance(self._password_hash, str):
            self._password_hash = self._password_hash.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_name(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} cannot be empty")
        return value.strip()

    @validates('email')
    def validate_email(self, key, value):
        if value:
            pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            if not re.match(pattern, value):
                raise ValueError("Invalid email format")
        return value


    def __repr__(self):
        return f"<Charity {self.id}: {self.username}>"

class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, default='admingivestream')
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String, default='admingivestream')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        if self._password_hash is None:
            return False
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f"<Admin {self.id}: {self.username}>"

class CharityApplication(db.Model):
    __tablename__ = 'charity_applications'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending') 
    submission_date = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admins.id'))
    review_date = db.Column(db.DateTime)

    admin = db.relationship('Admin', backref='reviewed_applications')

class Donation(db.Model, SerializerMixin):
    __tablename__ = 'donations'
    serialize_rules = ('-donor', '-charity')
    serialize_only = ('id', 'donor_id', 'charity_id', 'amount', 'date', 'is_anonymous', 'is_recurring', 'recurring_frequency', 'next_donation_date')

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
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

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

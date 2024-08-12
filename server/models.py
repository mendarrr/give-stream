from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db, bcrypt
from datetime import datetime
import re

# Model Definitions

class Donor(db.Model, SerializerMixin):
    __tablename__ = 'donors'
    serialize_rules = ('-donations.donor', '-_password_hash', '-payment_method.donors')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    is_anonymous = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(20), default='donor')
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.id'))
    donations = db.relationship('Donation', backref='donor', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
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

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_anonymous': self.is_anonymous
        }

    def __repr__(self):
        return f"<Donor {self.id}: {self.username}>"

class Charity(db.Model, SerializerMixin):
    __tablename__ = 'charities'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(128), unique=True, nullable=False)
    _password_hash = db.Column(db.String, default="charities")
    description = db.Column(db.Text)
    needed_donation = db.Column(db.Float)
    raised_amount = db.Column(db.Float, default=0.0)
    goal_amount = db.Column(db.Float)
    donation_count = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))
    organizer = db.Column(db.String(128))
    role = db.Column(db.String(20), default='charity')
    donations = db.relationship('Donation', backref='charity', lazy='dynamic', cascade='all, delete-orphan')
    stories = db.relationship('Story', backref='charity', lazy='dynamic')
    beneficiaries = db.relationship('Beneficiary', back_populates='charity', cascade='all, delete-orphan')
    inventories = db.relationship('Inventory', backref='charity', lazy='dynamic')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        if isinstance(self._password_hash, str):
            self._password_hash = self._password_hash.encode('utf-8')
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, value):
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

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'description': self.description,
            'neededDonation': self.needed_donation,
            'raisedAmount': self.raised_amount,
            'goalAmount': self.goal_amount,
            'donationCount': self.donation_count,
            'imageUrl': self.image_url,
            'organizer': self.organizer
        }
    
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
            'goal_amount': self.goal_amount,
            'neededDonation': self.needed_donation
    }


    def __repr__(self):
        return f"<Charity {self.id}: {self.username}>"
    
class CharityApplication(db.Model, SerializerMixin):
    __tablename__ = 'charity_applications'
    serialize_rules = ('-admin',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')
    submission_date = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admins.id'))
    review_date = db.Column(db.DateTime)
    country = db.Column(db.String(100))
    city = db.Column(db.String(100))
    zipcode = db.Column(db.String(20))
    fundraising_category = db.Column(db.String(100))
    username = db.Column(db.String(256))
    target_amount = db.Column(db.Float)
    image = db.Column(db.String(255), nullable=True)
    admin = db.relationship('Admin', backref='reviewed_applications')

    def to_dict(self):
     return {
        'id': self.id,
        'name': self.name,
        'email': self.email,
        'description': self.description,
        'status': self.status,
        'submission_date': self.submission_date.isoformat() if self.submission_date else None.isoformat() if self.submission_date else None,
        'reviewed_by': self.reviewed_by,
        'review_date': self.review_date.isoformat() if self.review_date else None.isoformat() if self.review_date else None,
        'country': self.country,
        'city': self.city,
        'zipcode': self.zipcode,
        'fundraising_category': self.fundraising_category,
        'username': self.username,
        'target_amount': self.target_amount,
            'image': self.image
    }

    

class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, default='admingivestream')
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String, default='admingivestream')
    role = db.Column(db.String(20), default='admin')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        if self._password_hash is None:
            return False
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }

    def __repr__(self):
        return f"<Admin {self.id}: {self.username}>"


class Donation(db.Model, SerializerMixin):
    __tablename__ = 'donations'
    serialize_rules = ('-donor', '-charity', '-payment_method')
    serialize_only = ('id', 'donor_id', 'charity_id', 'payment_method_id', 'amount', 'date', 'is_anonymous', 'is_recurring', 'recurring_frequency', 'next_donation_date')

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id', ondelete='CASCADE'), nullable=False)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    is_anonymous = db.Column(db.Boolean, default=False)
    is_recurring = db.Column(db.Boolean, default=False)
    recurring_frequency = db.Column(db.String(20))
    next_donation_date = db.Column(db.DateTime)

    payment_method = db.relationship('PaymentMethod', back_populates='donations')

    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'charity_id': self.charity_id,
            'payment_method_id': self.payment_method_id,
            'amount': self.amount,
            'date': self.date.isoformat() if self.date else None,
            'is_anonymous': self.is_anonymous,
            'is_recurring': self.is_recurring,
            'recurring_frequency': self.recurring_frequency,
            'next_donation_date': self.next_donation_date.isoformat() if self.next_donation_date else None
        }


class Story(db.Model):
    __tablename__ = 'stories'
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'charity_id': self.charity_id,
            'title': self.title,
            'content': self.content,
            'date_posted': self.date_posted
        }

class Beneficiary(db.Model, SerializerMixin):
    __tablename__ = 'beneficiaries'
    serialize_rules = ('-charity',)
    serialize_only = ('id', 'charity_id', 'name', 'description')

    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)

    charity = db.relationship('Charity', back_populates='beneficiaries')

    def to_dict(self):
        return {
            'id': self.id,
            'charity_id': self.charity_id,
            'name': self.name,
            'description': self.description
        }

from datetime import datetime

class Inventory(db.Model):
    __tablename__ = 'inventories'
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    item_name = db.Column(db.String(128), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'charity_id': self.charity_id,
            'item_name': self.item_name,
            'quantity': self.quantity,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }


class PaymentMethod(db.Model, SerializerMixin):
    __tablename__ = 'payment_methods'
    serialize_rules = ('-donors', '-donations')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))

    donors = db.relationship('Donor', backref='payment_method', lazy=True)
    donations = db.relationship('Donation', back_populates='payment_method')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    is_answered = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Message {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'content': self.content,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'is_answered': self.is_answered
        }
class Community(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    members = db.Column(db.Integer, nullable=False)
    impact_stories = db.Column(db.Text, nullable=False)
    events = db.Column(db.Text, nullable=False)
    banner = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False, default='General')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "members": self.members,
            "impactStories": self.impact_stories.replace(';', '').split(';;') if self.impact_stories else [],
            "events": self.events.replace(';', '').split(';;') if self.events else [],
            "banner": self.banner,
            "category": self.category
        }



class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    transaction_id = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'phone_number': self.phone_number,
            'transaction_id': self.transaction_id,
            'status': self.status,
            'user_id': self.user_id,
            'timestamp': self.timestamp.isoformat()
        }    


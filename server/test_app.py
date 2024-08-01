import pytest
from app import app, db
from models import Donor, Charity, Admin, CharityApplication, Donation, Story, Beneficiary, Inventory
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test_secret_key'
    client = app.test_client()

    with app.app_context():
        db.create_all()

    yield client

    with app.app_context():
        db.drop_all()

@pytest.fixture
def auth_headers(client):
    with app.app_context():
        access_token = create_access_token(identity={'id': 1, 'role': 'admin'})
    return {'Authorization': f'Bearer {access_token}'}

@pytest.fixture
def admin_headers(client):
    with app.app_context():
        access_token = create_access_token(identity={'id': 1, 'role': 'admin'})
    return {'Authorization': f'Bearer {access_token}'}

@pytest.fixture
def charity_headers(client):
    with app.app_context():
        access_token = create_access_token(identity={'id': 1, 'role': 'charity'})
    return {'Authorization': f'Bearer {access_token}'}

@pytest.fixture
def donor_headers(client):
    with app.app_context():
        access_token = create_access_token(identity={'id': 1, 'role': 'donor'})
    return {'Authorization': f'Bearer {access_token}'}

def test_login(client):
    with app.app_context():
        donor = Donor(username='testuser', email='test@example.com')
        donor.password_hash = 'testpassword'  
        db.session.add(donor)
        db.session.commit()

    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401

def test_get_charities(client):
    with app.app_context():
        charity1 = Charity(username='charity1', email='charity1@example.com', name='Charity One')
        charity2 = Charity(username='charity2', email='charity2@example.com', name='Charity Two')
        db.session.add(charity1)
        db.session.add(charity2)
        db.session.commit()

    response = client.get('/charities')
    assert response.status_code == 200
    assert len(response.json) == 2
    assert response.json[0]['name'] == 'Charity One'
    assert response.json[1]['name'] == 'Charity Two'

def test_post_charity(client, auth_headers):
    response = client.post('/charities', json={
        'username': 'newcharity',
        'email': 'new@charity.org',
        'name': 'New Charity',
        'description': 'A new charity',
        'password': 'password123'
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json['name'] == 'New Charity'

def test_get_charity_applications(client, admin_headers):
    with app.app_context():
        application = CharityApplication(name='Test Charity', email='test@charity.org', description='Test description')
        db.session.add(application)
        db.session.commit()

    response = client.get('/charity-applications', headers=admin_headers)
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'Test Charity'

def test_post_charity_application(client):
    response = client.post('/charity-applications', json={
        'name': 'New Charity',
        'email': 'new@charity.org',
        'description': 'A new charity application'
    })
    assert response.status_code == 201
    assert response.json['name'] == 'New Charity'
def test_update_charity_application(client, admin_headers):
    with app.app_context():
        application = CharityApplication(name='Test Charity', email='test@charity.org', description='Test description')
        db.session.add(application)
        db.session.commit()

     
        db.session.refresh(application)

        response = client.put(f'/charity-applications/{application.id}', json={
            'status': 'approved'
        }, headers=admin_headers)

    assert response.status_code == 200
    assert response.json['status'] == 'approved'

def test_get_admin_dashboard(client, admin_headers):
    response = client.get('/admin-dashboard', headers=admin_headers)
    assert response.status_code == 200
    assert 'total_donations' in response.json
    assert 'charity_count' in response.json
    assert 'donor_count' in response.json




def test_get_donations(client):
    with app.app_context():
        donor = Donor(username='testdonor', email='donor@example.com')
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(donor)
        db.session.add(charity)
        db.session.commit()

        donation = Donation(donor_id=donor.id, charity_id=charity.id, amount=100.00)
        db.session.add(donation)
        db.session.commit()

    response = client.get('/donations')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['amount'] == 100.00




def test_post_donation(client, auth_headers):
    with app.app_context():
        donor = Donor(username='testdonor', email='donor@example.com')
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(donor)
        db.session.add(charity)
        db.session.commit()

    response = client.post('/donations', json={
        'donor_id': 1,
        'charity_id': 1,
        'amount': 50.00,
        'date': '2023-08-01',
        'is_anonymous': False,
        'is_recurring': False,
        'recurring_frequency': None
    }, headers=auth_headers)
    assert response.status_code == 200
    assert response.json['amount'] == 50.00




def test_get_stories(client):
    with app.app_context():
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(charity)
        db.session.commit()

        story = Story(charity_id=charity.id, title='Test Story', content='This is a test story')
        db.session.add(story)
        db.session.commit()

    response = client.get('/stories')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == 'Test Story'




def test_post_story(client, auth_headers):
    with app.app_context():
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(charity)
        db.session.commit()

    response = client.post('/stories', json={
        'title': 'New Story',
        'content': 'This is a new story',
        'charity_id': 1
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json['title'] == 'New Story'



def test_get_beneficiaries(client):
    with app.app_context():
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(charity)
        db.session.commit()

        beneficiary = Beneficiary(charity_id=charity.id, name='Test Beneficiary', description='Test description')
        db.session.add(beneficiary)
        db.session.commit()

    response = client.get('/beneficiaries')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'Test Beneficiary'




def test_post_beneficiary(client, charity_headers):
    with app.app_context():
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(charity)
        db.session.commit()

    response = client.post('/beneficiaries', json={
        'name': 'New Beneficiary',
        'description': 'This is a new beneficiary',
        'charity_id': 1
    }, headers=charity_headers)
    assert response.status_code == 201
    assert response.json['name'] == 'New Beneficiary'




def test_get_donors(client):
    with app.app_context():
        donor1 = Donor(username='donor1', email='donor1@example.com')
        donor2 = Donor(username='donor2', email='donor2@example.com')
        db.session.add(donor1)
        db.session.add(donor2)
        db.session.commit()

    response = client.get('/donors')
    assert response.status_code == 200
    assert len(response.json) == 2
    assert response.json[0]['username'] == 'donor1'
    assert response.json[1]['username'] == 'donor2'




def test_get_donation_by_donor(client, donor_headers):
    with app.app_context():
        donor = Donor(username='testdonor', email='donor@example.com')
        charity = Charity(username='testcharity', email='charity@example.com', name='Test Charity')
        db.session.add(donor)
        db.session.add(charity)
        db.session.commit()

        donation = Donation(donor_id=donor.id, charity_id=charity.id, amount=100.00)
        db.session.add(donation)
        db.session.commit()

    response = client.get('/donations/donor/1', headers=donor_headers)
    assert response.status_code == 200
    assert len(response.json['donations']) == 1 
    assert response.json['donations'][0]['amount'] == 100.00
    assert response.json['total_amount'] == 100.00




    #pytest test_app.py -v
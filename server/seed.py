from models import db, Donor, Charity, Admin, CharityApplication, Donation, Story, Beneficiary, Inventory
from datetime import datetime, timedelta
from random import randint, choice, uniform
from app import app 

def seed_data():
    db.drop_all()
    db.create_all()

    #Donors
    donors = [
        Donor(username=f"donor{i}", email=f"donor{i}@example.com")
        for i in range(1, 6)
    ]
    db.session.add_all(donors)

    #Charities
    charities = [
        Charity(username=f"charity{i}", email=f"charity{i}@example.com", name=f"Charity {i}", 
                description=f"Description for Charity {i}", needed_donation=randint(1000, 10000))
        for i in range(1, 4)
    ]
    db.session.add_all(charities)
    db.session.commit() 

    #Admins
    admins = [
        Admin(username="abby", email="abby@example.com"),
        Admin(username="maurine", email="maurine@example.com"),
        Admin(username="kevin", email="kevin@example.com"),
        Admin(username="erustus", email="erustus@example.com"),
        Admin(username="mark", email="mark@example.com"),
        Admin(username="samuel", email="samuel@example.com")
    ]
    db.session.add_all(admins)

    #CharityApplications
    applications = [
        CharityApplication(name=f"New Charity {i}", email=f"newcharity{i}@example.com", 
                           description=f"Application for New Charity {i}", 
                           status=choice(['pending', 'approved', 'rejected']),
                           submission_date=datetime.now() - timedelta(days=randint(1, 30)),
                           reviewed_by=choice(admins).id if randint(0, 1) else None)
        for i in range(1, 5)
    ]
    db.session.add_all(applications)

    #Donations
    donations = [
        Donation(donor_id=choice(donors).id, charity_id=choice(charities).id,
                 amount=uniform(10, 1000), date=datetime.now() - timedelta(days=randint(1, 365)),
                 is_anonymous=choice([True, False]), is_recurring=choice([True, False]),
                 recurring_frequency=choice(['weekly', 'monthly', 'yearly']) if choice([True, False]) else None,
                 next_donation_date=datetime.now() + timedelta(days=randint(1, 30)) if choice([True, False]) else None)
        for _ in range(20)
    ]
    db.session.add_all(donations)

    #Stories
    stories = [
        Story(charity_id=choice(charities).id, title=f"Story {i}", 
              content=f"Content for Story {i}", date_posted=datetime.now() - timedelta(days=randint(1, 180)))
        for i in range(1, 11)
    ]
    db.session.add_all(stories)

    #Beneficiaries
    beneficiaries = [
        Beneficiary(charity_id=choice(charities).id, name=f"Beneficiary {i}", 
                    description=f"Description for Beneficiary {i}")
        for i in range(1, 16)
    ]
    db.session.add_all(beneficiaries)

    #Inventory
    inventory_items = [
        Inventory(charity_id=choice(charities).id, item_name=f"Item {i}", 
                  quantity=randint(1, 100), date_updated=datetime.now() - timedelta(days=randint(1, 30)))
        for i in range(1, 21)
    ]
    db.session.add_all(inventory_items)

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        seed_data()

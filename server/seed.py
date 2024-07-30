from app import app 
from models import db, Donor, Charity, Admin, CharityApplication, Donation, Story, Beneficiary, Inventory

def seed_data():
    with app.app_context():
        # Drop all tables and create them again
        db.drop_all()
        db.create_all()

        # Create sample admins
        admin1 = Admin(username='admin1', email='admin1@example.com')
        admin2 = Admin(username='admin2', email='admin2@example.com')
        db.session.add(admin1)
        db.session.add(admin2)
        
        # Create sample donors
        donor1 = Donor(username='donor1', email='donor1@example.com')
        donor2 = Donor(username='donor2', email='donor2@example.com')
        db.session.add(donor1)
        db.session.add(donor2)
        
        # Create sample charities
        charity1 = Charity(
            username='charity1',
            email='contact@charity1.org',
            name='Charity One',
            description='Charity One description.',
            needed_donation=10000.00
        )
        charity2 = Charity(
            username='charity2',
            email='contact@charity2.org',
            name='Charity Two',
            description='Charity Two description.',
            needed_donation=15000.00
        )
        db.session.add(charity1)
        db.session.add(charity2)
        
        # Create sample charity applications
        application1 = CharityApplication(
            name='Future Charity',
            email='future@charity.org',
            description='First donation division Tanzania',
            status='pending'
        )
        application2 = CharityApplication(
            name='Helping Hands',
            email='hands@help.org',
            description='First charity division Kenya.',
            status='pending'
        )
        db.session.add(application1)
        db.session.add(application2)
        
        # Commit to get the IDs assigned
        db.session.commit()

        # Create sample donations
        donation1 = Donation(
            donor_id=donor1.id,
            charity_id=charity2.id,
            amount=1000.00,
            is_anonymous=False
        )
        donation2 = Donation(
            donor_id=donor2.id,
            charity_id=charity1.id,
            amount=2000.00,
            is_anonymous=True
        )
        db.session.add(donation1)
        db.session.add(donation2)

        # Create sample stories
        story1 = Story(
            charity_id=charity1.id,
            title='Impact Story 1',
            content='Donation from Donor 1 to Charity One.'
        )
        story2 = Story(
            charity_id=charity2.id,
            title='Impact Story 2',
            content='Donation from Donor 2 to Charity Two.'
        )
        db.session.add(story1)
        db.session.add(story2)
        
        # Create sample beneficiaries
        beneficiary1 = Beneficiary(
            charity_id=charity1.id,
            name='Beneficiary One',
            description='Beneficiary description.'
        )
        beneficiary2 = Beneficiary(
            charity_id=charity2.id,
            name='Beneficiary Two',
            description='Beneficiary description.'
        )
        db.session.add(beneficiary1)
        db.session.add(beneficiary2)
        
        # Create sample inventory items
        inventory_item1 = Inventory(
            charity_id=charity1.id,
            item_name='T-shirt',
            quantity=1000
        )
        inventory_item2 = Inventory(
            charity_id=charity2.id,
            item_name='Shoes',
            quantity=500
        )
        db.session.add(inventory_item1)
        db.session.add(inventory_item2)

        # Commit all changes
        db.session.commit()
        print('Seed data successfully added.')

if __name__ == '__main__':
    seed_data()

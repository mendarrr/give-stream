from app import app
from models import db, Donor, Charity, Admin, CharityApplication, Donation, Story, Beneficiary, Inventory, PaymentMethod, Community
from datetime import datetime

def seed_data():
    with app.app_context():
        # Drop all tables and create them again
        db.drop_all()
        db.create_all()

       # Create admin with default values
        admin = Admin(username='admingivestream', email='admin@example.com')  # Add an email here
        admin.password_hash = 'admingivestream'
        db.session.add(admin)

        # Create sample donors
        donor1 = Donor(username='donor1', email='donor1@example.com')
        donor2 = Donor(username='donor2', email='donor2@example.com')
        db.session.add(donor1)
        db.session.add(donor2)
        
        # Create sample charities
        charities = [
            Charity(
                username='kilimanjaro_aid', 
                email='contact@charity1.org', 
                name='Kilimanjaro Aid Foundation', 
                description='Providing support to communities around Mount Kilimanjaro.', 
                needed_donation=10000.00,
                raised_amount=5000.00,
                goal_amount=20000.00,
                donation_count=50,
                image_url='https://images.pexels.com/photos/9324330/pexels-photo-9324330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                organizer='John Doe'
            ),
            Charity(
                username='nairobi_youth_empower', 
                email='contact@charity2.org', 
                name='Nairobi Youth Empowerment', 
                description='Empowering youth in Nairobi through education and skills training.', 
                needed_donation=15000.00,
                raised_amount=7000.00,
                goal_amount=25000.00,
                donation_count=75,
                image_url='https://images.pexels.com/photos/6963622/pexels-photo-6963622.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
                organizer='Jane Smith'
            ),
            Charity(
                username='global_education', 
                email='contact@charity21.org', 
                name='Global Education Fund', 
                description='Providing educational resources to underprivileged children worldwide.', 
                needed_donation=25000.00,
                raised_amount=12000.00,
                goal_amount=50000.00,
                donation_count=100,
                image_url='https://images.pexels.com/photos/6472487/pexels-photo-6472487.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
                organizer='Anna Lee'
            ),
            Charity(
                username='save_the_oceans', 
                email='contact@charity22.org', 
                name='Save The Oceans', 
                description='Protecting marine life and cleaning the oceans.', 
                needed_donation=30000.00,
                raised_amount=15000.00,
                goal_amount=60000.00,
                donation_count=80,
                image_url='https://images.pexels.com/photos/7048023/pexels-photo-7048023.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
                organizer='Mark Green'
            ),
            Charity(
                username='animal_rescue', 
                email='contact@charity23.org', 
                name='Animal Rescue League', 
                description='Rescuing and rehabilitating abandoned animals.', 
                needed_donation=20000.00,
                raised_amount=8000.00,
                goal_amount=40000.00,
                donation_count=90,
                image_url='https://images.pexels.com/photos/7772006/pexels-photo-7772006.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                organizer='Linda Patel'
            ),
            Charity(
                username='food_for_all', 
                email='contact@charity24.org', 
                name='Food For All', 
                description='Providing meals and food supplies to the hungry.', 
                needed_donation=15000.00,
                raised_amount=5000.00,
                goal_amount=30000.00,
                donation_count=60,
                image_url='https://images.unsplash.com/photo-1504674900247-0877dfd6d9a0',
                organizer='Robert Brown'
            ),
            Charity(
                username='medical_research', 
                email='contact@charity25.org', 
                name='Medical Research Foundation', 
                description='Funding research to find cures for diseases.', 
                needed_donation=40000.00,
                raised_amount=20000.00,
                goal_amount=80000.00,
                donation_count=70,
                image_url='https://images.unsplash.com/photo-1568155147-870f3e3e4f7d',
                organizer='Sara Jones'
            ),
            Charity(
                username='clean_energy', 
                email='contact@charity26.org', 
                name='Clean Energy Initiative', 
                description='Promoting and implementing renewable energy solutions.', 
                needed_donation=35000.00,
                raised_amount=18000.00,
                goal_amount=70000.00,
                donation_count=65,
                image_url='https://images.unsplash.com/photo-1506748686214e9df14f1',
                organizer='Carlos Martinez'
            ),
            Charity(
                username='disaster_relief', 
                email='contact@charity27.org', 
                name='Disaster Relief Fund', 
                description='Providing aid to communities affected by natural disasters.', 
                needed_donation=50000.00,
                raised_amount=25000.00,
                goal_amount=100000.00,
                donation_count=85,
                image_url='https://images.unsplash.com/photo-1486210931844-26e8da774b8b',
                organizer='Natalie King'
            ),
            Charity(
                username='mental_health_support', 
                email='contact@charity28.org', 
                name='Mental Health Support', 
                description='Offering support and resources for mental health issues.', 
                needed_donation=20000.00,
                raised_amount=9000.00,
                goal_amount=40000.00,
                donation_count=50,
                image_url='https://images.unsplash.com/photo-1506748686214-e9df14f1d8d4',
                organizer='George White'
            ),
            Charity(
                username='clean_water', 
                email='contact@charity29.org', 
                name='Clean Water Project', 
                description='Providing access to clean and safe drinking water.', 
                needed_donation=25000.00,
                raised_amount=13000.00,
                goal_amount=50000.00,
                donation_count=55,
                image_url='https://images.unsplash.com/photo-1574158622682-015e3d611c5d',
                organizer='Emily Clark'
            ),
            Charity(
                username='youth_entrepreneurship', 
                email='contact@charity30.org', 
                name='Youth Entrepreneurship Program', 
                description='Supporting young entrepreneurs with resources and mentorship.', 
                needed_donation=22000.00,
                raised_amount=11000.00,
                goal_amount=44000.00,
                donation_count=60,
                image_url='https://images.unsplash.com/photo-1566245032-7d3e8e07d1f3',
                organizer='Jason Adams'
            ),
            Charity(
                username='rural_healthcare', 
                email='contact@charity31.org', 
                name='Rural Healthcare Initiative', 
                description='Improving healthcare services in rural areas.', 
                needed_donation=18000.00,
                raised_amount=8000.00,
                goal_amount=36000.00,
                donation_count=45,
                image_url='https://images.unsplash.com/photo-1536234885652-4b3aa05a278d',
                organizer='Sophia Green'
            ),
            Charity(
                username='literacy_programs', 
                email='contact@charity32.org', 
                name='Literacy Programs', 
                description='Providing education and literacy programs to underserved populations.', 
                needed_donation=16000.00,
                raised_amount=7000.00,
                goal_amount=32000.00,
                donation_count=70,
                image_url='https://images.unsplash.com/photo-1526747768572-1d0632b0d124',
                organizer='Owen Lewis'
            ),
            Charity(
                username='community_development', 
                email='contact@charity33.org', 
                name='Community Development Fund', 
                description='Supporting community development projects and initiatives.', 
                needed_donation=30000.00,
                raised_amount=15000.00,
                goal_amount=60000.00,
                donation_count=90,
                image_url='https://images.pexels.com/photos/9324322/pexels-photo-9324322.jpeg?auto=compress&cs=tinysrgb&w=400',
                organizer='Isabella Robinson'
            ),
            Charity(
                username='refugee_aid', 
                email='contact@charity34.org', 
                name='Refugee Aid Network', 
                description='Providing support and resources to refugees.', 
                needed_donation=28000.00,
                raised_amount=14000.00,
                goal_amount=56000.00,
                donation_count=65,
                image_url='https://images.unsplash.com/photo-1567008510-b9d6657b6182',
                organizer='Ethan Walker'
            ),
            Charity(
                username='elderly_care', 
                email='contact@charity35.org', 
                name='Elderly Care Foundation', 
                description='Offering care and support to elderly individuals.', 
                needed_donation=22000.00,
                raised_amount=10000.00,
                goal_amount=44000.00,
                donation_count=75,
                image_url='https://images.unsplash.com/photo-1565208040-8d2d8a4bfc07',
                organizer='Ava Young'
            ),
            Charity(
                username='environmental_protection', 
                email='contact@charity36.org', 
                name='Environmental Protection Agency', 
                description='Protecting the environment through various initiatives.', 
                needed_donation=35000.00,
                raised_amount=20000.00,
                goal_amount=70000.00,
                donation_count=80,
                image_url='https://images.unsplash.com/photo-1524397595383-3b6b5c0c50d1',
                organizer='Liam Harris'
            ),
            Charity(
                username='sports_for_all', 
                email='contact@charity37.org', 
                name='Sports For All', 
                description='Promoting sports and physical activities for all ages.', 
                needed_donation=20000.00,
                raised_amount=9500.00,
                goal_amount=40000.00,
                donation_count=50,
                image_url='https://images.pexels.com/photos/8060427/pexels-photo-8060427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                organizer='Mia Turner'
            ),
            Charity(
                username='arts_education', 
                email='contact@charity38.org', 
                name='Arts Education Foundation', 
                description='Providing arts education and opportunities to children and youth.', 
                needed_donation=18000.00,
                raised_amount=8500.00,
                goal_amount=36000.00,
                donation_count=60,
                image_url='https://images.unsplash.com/photo-1515376792582-00f1b08f8b5d',
                organizer='James Scott'
            ),
            Charity(
                username='child_safety', 
                email='contact@charity39.org', 
                name='Child Safety Initiative', 
                description='Enhancing safety and protection for children.', 
                needed_donation=22000.00,
                raised_amount=12000.00,
                goal_amount=44000.00,
                donation_count=70,
                image_url='https://images.pexels.com/photos/6565756/pexels-photo-6565756.jpeg?auto=compress&cs=tinysrgb&w=600',
                organizer='Olivia Evans'
            ),
            Charity(
                username='digital_literacy', 
                email='contact@charity40.org', 
                name='Digital Literacy Program', 
                description='Promoting digital literacy and skills among underserved communities.', 
                needed_donation=25000.00,
                raised_amount=13000.00,
                goal_amount=50000.00,
                donation_count=85,
                image_url='https://images.pexels.com/photos/8369770/pexels-photo-8369770.jpeg?auto=compress&cs=tinysrgb&w=600',
                organizer='Henry Lee'
            )
            
        ]
        db.session.add_all(charities)
        
        #  sample charity applications
        applications = [
            CharityApplication(
                name='Future Charity', 
                email='future@charity.org', 
                description='First donation division Tanzania', 
                status='pending',
                review_date=datetime.strptime('2024-08-15', '%Y-%m-%d'),
                image='https://example.com/images/future_charity.jpg' 
            ),
            CharityApplication(
                name='Helping Hands', 
                email='hands@help.org', 
                description='First charity division Kenya.', 
                status='pending',
                review_date=datetime.strptime('2024-08-16', '%Y-%m-%d'),
                image='https://example.com/images/helping_hands.jpg'  
            )
        ]
        db.session.add_all(applications)
        
        
        payment_methods = [
            PaymentMethod(name='Credit Card', description='Payment via credit card'),
            PaymentMethod(name='PayPal', description='Payment via PayPal account'),
            PaymentMethod(name='Bank Transfer', description='Direct bank transfer payment'),
            PaymentMethod(name='Cash', description='Cash payment')
        ]
        db.session.add_all(payment_methods)
        db.session.commit()

        # Create sample donations
        donations = [
            Donation(donor_id=donor1.id, charity_id=charities[1].id, payment_method_id=payment_methods[0].id, amount=1000.00, is_anonymous=False),
            Donation(donor_id=donor2.id, charity_id=charities[0].id, payment_method_id=payment_methods[1].id, amount=2000.00, is_anonymous=True)
        ]
        db.session.add_all(donations)

        # Create sample stories
        stories = [
            Story(charity_id=charities[0].id, title='Impact Story 1', content='Donation from Donor 1 to Kilimanjaro Aid Foundation.'),
            Story(charity_id=charities[1].id, title='Impact Story 2', content='Donation from Donor 2 to Nairobi Youth Empowerment.')
        ]
        db.session.add_all(stories)
        
        # Create sample beneficiaries
        beneficiaries = [
            Beneficiary(charity_id=charities[0].id, name='Beneficiary One', description='Beneficiary description.'),
            Beneficiary(charity_id=charities[1].id, name='Beneficiary Two', description='Beneficiary description.')
        ]
        db.session.add_all(beneficiaries)
        
        # Create sample inventory items
        inventory_items = [
            Inventory(charity_id=charities[0].id, item_name='T-shirt', quantity=1000),
            Inventory(charity_id=charities[1].id, item_name='Shoes', quantity=500)
        ]
        db.session.add_all(inventory_items)

        communities = [
            Community( 
                name='Local Heroes', 
                description='Recognizing and supporting local community heroes.', 
                members=1000,
                impact_stories='Honored local volunteers;Provided grants to community leaders',
                events='Local Heroes Awards;Volunteer Recognition Day',
                banner='https://i.pinimg.com/564x/82/d1/19/82d119adba8bf922485f199e4d1d4603.jpg',
                category='local causes'
            ),
            Community(
                name='Neighborhood Watch', 
                description='A community-based safety initiative to keep neighborhoods safe.', 
                members=900,
                impact_stories='Installed neighborhood security cameras;Hosted a self-defense class',
                events='Community Safety Day;Self-Defense Workshop',
                banner='https://i.pinimg.com/564x/2u/2u/2u/2u2u2u2u2u2u2u2u.jpg',
                category='local causes'
            ),
            Community(
                name='Local Business Boosters', 
                description='Supporting local businesses and encouraging community shopping.', 
                members=800,
                impact_stories='Launched a shop local campaign;Provided free marketing workshops for small businesses',
                events='Small Business Expo;Shop Local Saturday',
                banner='https://i.pinimg.com/564x/b0/00/0c/b0000cd9721bb3ca65dbda2466084a84.jpg',
                category='local causes'
            ),
            Community(
                name='Community Gardeners', 
                description='Bringing neighbors together through community gardening.', 
                members=700,
                impact_stories='Started a community garden;Donated fresh produce to local food banks',
                events='Garden Workshop;Harvest Festival',
                banner='https://i.pinimg.com/564x/37/de/20/37de20e0147104867a51ba207ac771f5.jpg',
                category='local causes'
            ),
            Community(
                name='Youth Mentors', 
                description='Providing mentorship and support to local youth.', 
                members=600,
                impact_stories='Matched 100 youth with mentors;Held a youth leadership camp',
                events='Youth Leadership Camp;Mentorship Workshop',
                banner='https://i.pinimg.com/564x/8f/18/23/8f18233c6daec69a1468f0ec2abfcd7b.jpg',
                category='local causes'
            ),
            Community(
                name='Emergency Responders', 
                description='Supporting local emergency responders and disaster relief efforts.', 
                members=500,
                impact_stories='Organized a disaster preparedness drill;Raised funds for local fire department',
                events='Disaster Preparedness Workshop;Emergency Response Drill',
                banner='https://i.pinimg.com/564x/0e/4b/30/0e4b30b3174f6d68cf895027bf93c106.jpg',
                category='local causes'
            ),
            Community(
                name='Senior Support Network', 
                description='Providing resources and support to senior citizens in the community.', 
                members=400,
                impact_stories='Organized a senior transportation program;Provided home care services',
                events='Senior Health Fair;Home Care Workshop',
                banner='https://i.pinimg.com/736x/9d/4e/b6/9d4eb6217a93a36f6c41f61d47aa5045.jpg',
                category='local causes'
            ),
                Community(
                name='Animal Rescue Team', 
                description='Rescuing and rehabilitating animals in need.', 
                members=300,
                impact_stories='Rescued 100 animals from hoarding situation;Found forever homes for 50 pets',
                events='Pet Adoption Fair;Animal Rescue Workshop',
                banner='https://i.pinimg.com/564x/9f/24/fd/9f24fd7d2ed8f3c3014355c68ea3bd68.jpg',
                category='animal welfare'
            ),
            Community(
                name='Environmental Activists', 
                description='Promoting sustainability and protecting the environment.', 
                members=200,
                impact_stories='Organized beach cleanup;Advocated for renewable energy policies',
                events='Earth Day Celebration;Sustainability Workshop',
                banner='https://i.pinimg.com/564x/bf/48/2b/bf482b9bdb5dc29aee76b678b05b9105.jpg',
                category='environmental causes'
            ),
            Community(
                name='Mental Health Advocates', 
                description='Raising awareness and supporting mental health initiatives.', 
                members=100,
                impact_stories='Hosted mental health awareness event;Provided resources for mental health support',
                events='Mental Health Awareness Month;Self-Care Workshop',
                banner='https://i.pinimg.com/564x/a6/07/24/a6072475d585129ec6972ca995284024.jpg',
                category='health and wellness'
        )
        ]

        db.session.add_all(communities)

        # Commit all changes
        db.session.commit()
        print('Seed data successfully added.')

if __name__ == '__main__':
    seed_data()

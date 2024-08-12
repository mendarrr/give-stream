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
        donors = [
            Donor(
                username='john_doe', 
                email='john@example.com', 
                is_anonymous=False),
            Donor(
                username='jane_doe', 
                email='jane@example.com', 
                is_anonymous=False),
            Donor(
                username='sarah_smith', 
                email='sarah@example.com', 
                is_anonymous=False
            ),
            Donor(
                username='peter_johnson', 
                email='peter@example.com', 
                is_anonymous=False
            ),
            Donor(
                username='mike_wilson', 
                email='mike@example.com', 
                is_anonymous=False
            )
        ]
        
        db.session.add_all(donors)
        
        # Create sample charities
        charities = [
            Charity(
                username='kilimanjaro_aid', 
                email='contact@charity1.org', 
                name='Kilimanjaro Aid Foundation', 
                description='Providing support to communities around Mount Kilimanjaro.', 
                needed_donation=10000.00,
                raised_amount=20000.00,
                goal_amount=20000.00,
                donation_count=50,
                image_url='https://images.pexels.com/photos/6646778/pexels-photo-6646778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                raised_amount=30000.00,
                goal_amount=50000.00,
                donation_count=100.00,
                image_url='https://images.pexels.com/photos/6472487/pexels-photo-6472487.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
                organizer='Anna Lee'
            ),
            Charity(
                username='save_the_oceans', 
                email='contact@charity22.org', 
                name='Save The Oceans', 
                description='Protecting marine life and cleaning the oceans.', 
                needed_donation=30000.00,
                raised_amount=60000.00,
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
                raised_amount=40000.00,
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
                image_url='https://images.pexels.com/photos/6348119/pexels-photo-6348119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/7470822/pexels-photo-7470822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/7662853/pexels-photo-7662853.jpeg',
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
                image_url='https://images.pexels.com/photos/3958403/pexels-photo-3958403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/2837863/pexels-photo-2837863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                organizer='Emily Clark'
            ),
            Charity(
                username='Youth Program', 
                email='contact@charity30.org', 
                name='Youth Entrepreneurship Program', 
                description='Supporting young entrepreneurs with resources and mentorship.', 
                needed_donation=22000.00,
                raised_amount=11000.00,
                goal_amount=44000.00,
                donation_count=60,
                image_url='https://images.pexels.com/photos/770099/pexels-photo-770099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/6135340/pexels-photo-6135340.jpeg?auto=compress&cs=tinysrgb&w=600',
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
                image_url='https://images.pexels.com/photos/6463404/pexels-photo-6463404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/3044623/pexels-photo-3044623.jpeg?auto=compress&cs=tinysrgb&w=600',
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
                image_url='https://images.pexels.com/photos/16135530/pexels-photo-16135530/free-photo-of-a-prohibition-in-a-reservoir.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/2444852/pexels-photo-2444852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/159644/art-supplies-brushes-rulers-scissors-159644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/592600/pexels-photo-592600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
                image_url='https://images.pexels.com/photos/6476805/pexels-photo-6476805.jpeg?auto=compress&cs=tinysrgb&w=600',
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
            PaymentMethod(name='M-Pesa', description='Payment via Mpesa account'),
            PaymentMethod(name='Credit Card', description='Payment via credit card'),
            PaymentMethod(name='PayPal', description='Payment via PayPal account'),
            PaymentMethod(name='Bank Transfer', description='Direct bank transfer payment'),
            PaymentMethod(name='Cash', description='Cash payment')
        ]
        db.session.add_all(payment_methods)
        db.session.commit()

        # Create sample donations
        donations = [
            Donation(
                donor_id=donors[1].id, 
                charity_id=charities[0].id, 
                payment_method_id=payment_methods[0].id, 
                amount=20000.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[2].id, 
                charity_id=charities[1].id, 
                payment_method_id=payment_methods[1].id, 
                amount=25000.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[3].id, 
                charity_id=charities[2].id, 
                payment_method_id=payment_methods[2].id, 
                amount=30000.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[4].id, 
                charity_id=charities[1].id, 
                payment_method_id=payment_methods[3].id, 
                amount=25000.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[0].id, 
                charity_id=charities[4].id, 
                payment_method_id=payment_methods[0].id, 
                amount=40000.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[1].id, 
                charity_id=charities[5].id, 
                payment_method_id=payment_methods[1].id, 
                amount=40000.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[2].id, 
                charity_id=charities[3].id, 
                payment_method_id=payment_methods[2].id, 
                amount=37000.00, is_anonymous=False),
            Donation(
                donor_id=donors[3].id, 
                charity_id=charities[3].id, 
                payment_method_id=payment_methods[3].id, 
                amount=23000.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[4].id, 
                charity_id=charities[4].id, 
                payment_method_id=payment_methods[0].id, 
                amount=40000, 
                is_anonymous=False),
            Donation(
                donor_id=donors[0].id, 
                charity_id=charities[9].id, 
                payment_method_id=payment_methods[0].id, 
                amount=17500.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[1].id, 
                charity_id=charities[10].id, 
                payment_method_id=payment_methods[0].id, 
                amount=13500.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[2].id, 
                charity_id=charities[11].id, 
                payment_method_id=payment_methods[0].id, 
                amount=19250.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[3].id, 
                charity_id=charities[12].id, 
                payment_method_id=payment_methods[0].id, 
                amount=15200.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[4].id, 
                charity_id=charities[13].id, 
                payment_method_id=payment_methods[0].id, 
                amount=18100.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[1].id, 
                charity_id=charities[14].id, 
                payment_method_id=payment_methods[0].id, 
                amount=16450.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[2].id, 
                charity_id=charities[15].id, 
                payment_method_id=payment_methods[0].id, 
                amount=14250.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[3].id, 
                charity_id=charities[16].id, 
                payment_method_id=payment_methods[0].id, 
                amount=11200.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[0].id, 
                charity_id=charities[17].id, 
                payment_method_id=payment_methods[0].id, 
                amount=12000.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[1].id, 
                charity_id=charities[18].id, 
                payment_method_id=payment_methods[0].id, 
                amount=10500.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[2].id, 
                charity_id=charities[19].id, 
                payment_method_id=payment_methods[0].id, 
                amount=19500.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[3].id, 
                charity_id=charities[20].id, 
                payment_method_id=payment_methods[0].id, 
                amount=11500.00, 
                is_anonymous=True),
            Donation(
                donor_id=donors[4].id, 
                charity_id=charities[21].id, 
                payment_method_id=payment_methods[0].id, 
                amount=13250.00, 
                is_anonymous=False),
            Donation(
                donor_id=donors[0].id, 
                charity_id=charities[8].id, 
                payment_method_id=payment_methods[0].id, 
                amount=14900.00, 
                is_anonymous=True)
        ]
        db.session.add_all(donations)

        # Create sample stories

        stories = [
            Story(
                charity_id=charities[0].id, 
                title='Empowering Education in Tanzania', 
                content='Thanks to the generous donation from Donor 1, Kilimanjaro Aid was able to provide essential school supplies and scholarships to over 500 students in rural Tanzania. This support has significantly improved access to education and opened up new opportunities for these children.'),
            Story(
                charity_id=charities[1].id, 
                title='Transforming Lives in Nairobi', 
                content='With the help of Donor 2, Nairobi Youth Empowerment launched a new vocational training program that has already trained over 200 young adults in various skills, from carpentry to digital marketing, helping them secure stable jobs and a brighter future.'),
            Story(
                charity_id=charities[2].id, 
                title='Global Education Initiative in Action', 
                content='The Global Education initiative, supported by Donor 3, has successfully built new classrooms and provided textbooks to underfunded schools in India, improving the quality of education for thousands of students.'),
            Story(
                charity_id=charities[3].id, 
                title='Saving Marine Life Together', 
                content='A significant contribution from Donor 4 to Save the Oceans enabled the organization to launch a coastal cleanup project that removed over 10 tons of plastic waste from beaches in Southeast Asia, preserving marine habitats and protecting endangered species.'),
            Story(
                charity_id=charities[4].id, 
                title='Animal Rescue Success in Kenya', 
                content='Thanks to Donor 5, Animal Rescue was able to rescue and rehabilitate over 150 abused and abandoned animals in Kenya, providing them with the care they needed and finding them new loving homes.'),
            Story(
                charity_id=charities[5].id, 
                title='Feeding the Hungry Across Africa', 
                content='Food for All, with the support of Donor 6, distributed over 100,000 meals to families in need across multiple African countries during a severe drought, ensuring that no one went hungry.'),
            Story(
                charity_id=charities[6].id, 
                title='Advancing Medical Research', 
                content='A generous grant from Donor 7 enabled Medical Research to fund groundbreaking studies on rare diseases, leading to new treatments that have already improved the lives of countless patients.'),
            Story(
                charity_id=charities[7].id, 
                title='Clean Energy for Rural Communities', 
                content='With Donor 8’s support, Clean Energy installed solar panels in remote villages, providing sustainable and affordable energy to over 1,000 households and reducing the reliance on harmful fossil fuels.'),
            Story(
                charity_id=charities[8].id, 
                title='Rapid Response to Natural Disasters', 
                content='Disaster Relief, aided by Donor 9, was able to quickly deploy emergency supplies and medical teams to areas hit by a devastating earthquake, saving lives and helping communities rebuild.'),
            Story(
                charity_id=charities[9].id, 
                title='Supporting Mental Health', 
                content='Donor 10’s contribution to Mental Health Support enabled the launch of free counseling services and workshops in underserved communities, reaching over 500 individuals and providing much-needed mental health care.'),
            Story(
                charity_id=charities[10].id, 
                title='Clean Water for All', 
                content='Thanks to the funding from Donor 11, Clean Water was able to build new wells and water purification systems in villages across Sub-Saharan Africa, providing clean drinking water to thousands of people.'),
            Story(
                charity_id=charities[11].id, 
                title='Empowering Young Entrepreneurs', 
                content='Youth Entrepreneurship, with the backing of Donor 12, launched a business incubator that has already helped 50 young entrepreneurs turn their ideas into successful businesses, creating jobs and stimulating local economies.'),
            Story(
                charity_id=charities[12].id, 
                title='Improving Rural Healthcare', 
                content='Rural Healthcare, supported by Donor 13, built new clinics in remote areas, providing essential medical services to communities that previously had little to no access to healthcare.'),
            Story(
                charity_id=charities[13].id, 
                title='Literacy Programs Making a Difference', 
                content='Thanks to Donor 14, Literacy Programs was able to distribute thousands of books and set up reading centers in impoverished areas, significantly boosting literacy rates among children and adults alike.'),
            Story(
                charity_id=charities[14].id, 
                title='Building Stronger Communities', 
                content='Community Development, with the help of Donor 15, implemented infrastructure projects that improved living conditions, including building new roads, schools, and community centers in underdeveloped regions.'),
            Story(
                charity_id=charities[15].id, 
                title='Aiding Refugees in Crisis', 
                content='Refugee Aid, funded by Donor 16, provided critical support to refugees fleeing conflict, including shelter, food, and medical care, helping them rebuild their lives in safer environments.'),
            Story(
                charity_id=charities[16].id, 
                title='Caring for the Elderly', 
                content='Elderly Care, with a donation from Donor 17, expanded its home care services to reach more isolated seniors, providing them with companionship, medical assistance, and a sense of community.'),
            Story(
                charity_id=charities[17].id, 
                title='Protecting the Environment', 
                content='Environmental Protection, supported by Donor 18, launched reforestation projects in deforested areas, planting thousands of trees and restoring natural habitats.'),
            Story(
                charity_id=charities[18].id, 
                title='Promoting Sports for All', 
                content='Sports for All, thanks to Donor 19, organized community sports events and built new facilities that encouraged healthy living and provided safe spaces for children and adults to engage in physical activities.'),
            Story(
                charity_id=charities[19].id, 
                title='Nurturing the Arts', 
                content='Arts Education, with the help of Donor 20, provided art supplies and funded workshops in schools across the country, nurturing creativity and artistic expression among young students.'),
            Story(
                charity_id=charities[20].id, 
                title='Ensuring Child Safety Online', 
                content='Child Safety, supported by Donor 21, launched an online safety campaign that educated thousands of children and parents about the dangers of the internet, promoting safer online practices.'),
            Story(
                charity_id=charities[21].id, 
                title='Bridging the Digital Divide', 
                content='Digital Literacy, with the backing of Donor 22, provided computer training and internet access to underserved communities, helping individuals gain essential digital skills and access to new opportunities.')
        ]

        db.session.add_all(stories)
        
        # Create sample beneficiaries
        beneficiaries = [
            Beneficiary(
                charity_id=charities[0].id, 
                name='John M.', 
                description='John received educational support from Kilimanjaro Aid, enabling him to continue his studies and pursue a career in engineering.'),
            Beneficiary(
                charity_id=charities[1].id, 
                name='Amina K.', 
                description='Amina benefited from the vocational training provided by Nairobi Youth Empowerment, helping her start her own tailoring business.'),
            Beneficiary(
                charity_id=charities[2].id, 
                name='Priya R.', 
                description='Priya, a student in rural India, was able to stay in school thanks to the new classrooms and resources provided by Global Education.'),
            Beneficiary(
                charity_id=charities[3].id, 
                name='Lena T.', 
                description='Lena’s village was significantly cleaner and safer after Save the Oceans organized a coastal cleanup that removed tons of plastic waste.'),
            Beneficiary(
                charity_id=charities[4].id, 
                name='Kofi A.', 
                description='Kofi, a rescued dog in Kenya, found a new loving home thanks to the efforts of Animal Rescue.'),
            Beneficiary(
                charity_id=charities[5].id, 
                name='Maria P.', 
                description='Maria’s family received essential food supplies during a drought, ensuring they had enough to eat through the support of Food for All.'),
            Beneficiary(
                charity_id=charities[6].id, 
                name='David G.', 
                description='David, diagnosed with a rare disease, is now receiving better treatment options thanks to Medical Research’s advancements.'),
            Beneficiary(
                charity_id=charities[7].id, 
                name='Ruth N.', 
                description='Ruth’s village in Uganda now has reliable electricity due to the solar panels installed by Clean Energy, improving her quality of life.'),
            Beneficiary(
                charity_id=charities[8].id, 
                name='Carlos H.', 
                description='Carlos and his family received emergency relief supplies from Disaster Relief after an earthquake devastated their community.'),
            Beneficiary(
                charity_id=charities[9].id, 
                name='Sarah L.', 
                description='Sarah accessed free mental health counseling, helping her cope with depression and regain her confidence, thanks to Mental Health Support.'),
            Beneficiary(
                charity_id=charities[10].id, 
                name='Samuel B.', 
                description='Samuel’s community in Ghana now has access to clean water, drastically reducing waterborne diseases, thanks to Clean Water’s initiatives.'),
            Beneficiary(
                charity_id=charities[11].id, 
                name='Jane O.', 
                description='Jane, a young entrepreneur, started a successful catering business with the support of Youth Entrepreneurship’s training and resources.'),
            Beneficiary(
                charity_id=charities[12].id, 
                name='Ahmed Z.', 
                description='Ahmed’s remote village now has access to basic healthcare services, significantly improving health outcomes, thanks to Rural Healthcare.'),
            Beneficiary(
                charity_id=charities[13].id, 
                name='Fatima S.', 
                description='Fatima learned to read and write through Literacy Programs, opening up new opportunities for her and her family.'),
            Beneficiary(
                charity_id=charities[14].id, 
                name='Carlos M.', 
                description='Carlos’s community benefited from new infrastructure projects, including roads and schools, implemented by Community Development.'),
            Beneficiary(
                charity_id=charities[15].id, 
                name='Zara T.', 
                description='Zara, a refugee from Syria, found safety and support through Refugee Aid’s programs, helping her rebuild her life in a new country.'),
            Beneficiary(
                charity_id=charities[16].id, 
                name='George W.', 
                description='George, an elderly man living alone, received much-needed care and companionship through Elderly Care’s outreach programs.'),
            Beneficiary(
                charity_id=charities[17].id, 
                name='Emily R.', 
                description='Emily, an environmental activist, participated in reforestation efforts led by Environmental Protection, helping restore local forests.'),
            Beneficiary(
                charity_id=charities[18].id, 
                name='Kevin J.', 
                description='Kevin, a young athlete, accessed new sports facilities and joined a community team through Sports for All’s initiatives.'),
            Beneficiary(
                charity_id=charities[19].id, 
                name='Isabella P.', 
                description='Isabella, a budding artist, developed her skills in painting and sculpture thanks to workshops funded by Arts Education.'),
            Beneficiary(
                charity_id=charities[20].id, 
                name='Tommy L.', 
                description='Tommy learned about online safety through Child Safety’s campaign, helping him navigate the internet more securely.'),
            Beneficiary(
                charity_id=charities[21].id, 
                name='Rosa C.', 
                description='Rosa gained valuable digital skills through Digital Literacy’s training programs, allowing her to secure a better job and support her family.')
        ]


        db.session.add_all(beneficiaries)
        
        # Create sample inventory items
        inventory_items = [
            Inventory(
                charity_id=charities[0].id, 
                item_name='T-shirt', 
                quantity=1000),
            Inventory(
                charity_id=charities[1].id, 
                item_name='Shoes', 
                quantity=500),
            Inventory(
                charity_id=charities[2].id, 
                item_name='Backpacks', 
                quantity=700),
            Inventory(
                charity_id=charities[3].id, 
                item_name='Notebooks', 
                quantity=1200),
            Inventory(
                charity_id=charities[4].id, 
                item_name='Pencils', 
                quantity=1500),
            Inventory(
                charity_id=charities[5].id, 
                item_name='Water Bottles', 
                quantity=800),
            Inventory(
                charity_id=charities[6].id, 
                item_name='Blankets', 
                quantity=300),
            Inventory(
                charity_id=charities[7].id, 
                item_name='Socks', 
                quantity=1000),
            Inventory(
                charity_id=charities[8].id, 
                item_name='Jackets', 
                quantity=450),
            Inventory(
                charity_id=charities[9].id, 
                item_name='Hats', 
                quantity=600),
            Inventory(
                charity_id=charities[10].id, 
                item_name='Scarves', 
                quantity=700),
            Inventory(
                charity_id=charities[11].id, 
                item_name='Gloves', 
                quantity=900),
            Inventory(
                charity_id=charities[12].id, 
                item_name='Toothbrushes', 
                quantity=1100),
            Inventory(
                charity_id=charities[13].id, 
                item_name='Toothpaste', 
                quantity=1050),
            Inventory(
                charity_id=charities[14].id, 
                item_name='Soap', 
                quantity=1300),
            Inventory(
                charity_id=charities[15].id, 
                item_name='Shampoo', 
                quantity=750),
            Inventory(
                charity_id=charities[16].id, 
                item_name='Hand Sanitizers', 
                quantity=650),
            Inventory(
                charity_id=charities[17].id, 
                item_name='Face Masks', 
                quantity=2000),
            Inventory(
                charity_id=charities[18].id, 
                item_name='Sanitary Towels', 
                quantity=1600),
            Inventory(
                charity_id=charities[19].id, 
                item_name='Diapers', 
                quantity=500),
            Inventory(
                charity_id=charities[20].id, 
                item_name='Crayons', 
                quantity=1000),
            Inventory(
                charity_id=charities[21].id, 
                item_name='Pens', 
                quantity=1200)
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
                banner='https://i.pinimg.com/564x/db/e3/37/dbe337403368b52e397ef125c77784cf.jpg',
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
                category='education'
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
                category='health'
            ),
            Community(
                name='Creative Minds Collective', 
                description='Fostering creativity and collaboration among local artists.', 
                members=250,
                impact_stories='Launched a public art gallery; Hosted art therapy sessions for underprivileged youth',
                events='Annual Art Fair; Creative Workshops',
                banner='https://i.pinimg.com/564x/da/d3/81/dad381e9c115ab3b3c2b97ea70b8934a.jpg',
                category='arts'
            ),
            Community(
                name='Art for All', 
                description='Promoting access to art education and resources for all ages.', 
                members=150,
                impact_stories='Distributed free art supplies to schools; Organized art exhibitions for amateur artists',
                events='Art Supply Drive; Community Mural Project',
                banner='https://i.pinimg.com/564x/5a/cc/40/5acc4033fb31c1c6d04d5e317fa07d93.jpg',
                category='arts'
            ),
            Community(
                name='Cultural Heritage Preservers', 
                description='Preserving and promoting cultural heritage through art.', 
                members=180,
                impact_stories='Restored historical murals; Created documentaries on local traditions',
                events='Cultural Heritage Week; Traditional Art Exhibitions',
                banner='https://i.pinimg.com/564x/43/7c/f6/437cf6b355525268db8677bc97429cee.jpg',
                category='arts'
            ),
            Community(
                name='STEM for All', 
                description='Empowering students with hands-on STEM education.', 
                members=300,
                impact_stories='Launched after-school STEM programs; Provided scholarships for STEM students',
                events='STEM Summer Camp; Robotics Workshop',
                banner='https://i.pinimg.com/564x/ea/fb/00/eafb009daa25e1c15c569e673569339f.jpg',
                category='education'
            ),
            Community(
                name='Literacy Advocates', 
                description='Promoting literacy and education in underserved communities.', 
                members=200,
                impact_stories='Distributed free books to children; Launched mobile library services',
                events='Read-a-Thon; Book Donation Drive',
                banner='https://i.pinimg.com/564x/74/17/67/7417678163cbf697555fbb5331b194ce.jpg',
                category='education'
            ),
            Community(
                name='Global Learners', 
                description='Connecting students worldwide for cross-cultural learning experiences.', 
                members=350,
                impact_stories='Launched virtual exchange programs; Facilitated cultural immersion trips',
                events='International Education Week; Global Classroom Conference',
                banner='https://i.pinimg.com/564x/52/32/25/523225a1e9b979f341579228dbd51ac9.jpg',
                category='education'
            ),
            Community(
                name='Green Earth Warriors', 
                description='Fighting climate change through grassroots initiatives.', 
                members=400,
                impact_stories='Planted 10,000 trees; Organized beach clean-up drives',
                events='Earth Day Celebration; Community Tree Planting',
                banner='https://i.pinimg.com/564x/1c/ff/92/1cff92dee46d56b5913db15a927d8506.jpg',
                category='environment'
            ),
            Community(
                name='Eco Innovators', 
                description='Promoting sustainable living through innovation.', 
                members=250,
                impact_stories='Developed eco-friendly products; Hosted workshops on renewable energy',
                events='Sustainability Expo; Green Tech Hackathon',
                banner='https://i.pinimg.com/564x/e1/d9/11/e1d91166b695688ee1027d538481f39e.jpg',
                category='environment'
            ),
            Community(
                name='Wildlife Protectors', 
                description='Protecting endangered species and natural habitats.', 
                members=220,
                impact_stories='Established wildlife sanctuaries; Launched anti-poaching campaigns',
                events='Wildlife Conservation Week; Habitat Restoration Day',
                banner='https://i.pinimg.com/564x/7d/10/ca/7d10cad5bdc8802a8b3a5d24ae56ed2d.jpg',
                category='environment'
            ),
            Community(
                name='Fit Nation', 
                description='Promoting physical fitness and healthy living.', 
                members=350,
                impact_stories='Launched community fitness programs; Organized nutrition workshops',
                events='Annual Fitness Challenge; Healthy Eating Expo',
                banner='https://i.pinimg.com/564x/d4/03/04/d403042c493beaf2d36a95b6f3012628.jpg',
                category='health'
            ),
            Community(
                name='Healthy Hearts', 
                description='Raising awareness about heart health and prevention.', 
                members=180,
                impact_stories='Hosted heart health screenings; Distributed educational materials on heart disease',
                events='World Heart Day Event; Heart Health Workshop',
                banner='https://i.pinimg.com/564x/c2/cd/e0/c2cde02087cfd74de974e004f141c712.jpg',
                category='health'
            ),
            Community(
                name='Mindful Living Collective', 
                description='Promoting mental health and wellness through mindfulness.', 
                members=200,
                impact_stories='Organized mindfulness retreats; Created online mental health support groups',
                events='Mindfulness Meditation Series; Mental Wellness Week',
                banner='https://i.pinimg.com/564x/86/bd/79/86bd7940fe6c4f424bf1c8bd4e8a38e3.jpg',
                category='health'
            ),
            Community(
                name='Animal Rescue Alliance', 
                description='Rescuing and rehabilitating abused and abandoned animals.', 
                members=150,
                impact_stories='Rescued 500+ animals; Established animal adoption centers',
                events='Adopt-a-Pet Day; Animal Rescue Fundraiser',
                banner='https://i.pinimg.com/564x/5a/ac/c1/5aacc137cc4bd4b35aeaf4f754d4e2a6.jpg',
                category='animals'
            ),
            Community(
                name='Paws for a Cause', 
                description='Advocating for animal rights and welfare.', 
                members=120,
                impact_stories='Launched anti-cruelty campaigns; Provided free veterinary services',
                events='Animal Rights Awareness Week; Pet Care Workshop',
                banner='https://i.pinimg.com/564x/2a/49/aa/2a49aa8767188ffe5f5393b19357a330.jpg',
                category='animals'
            ),
            Community(
                name='Wildlife Guardians', 
                description='Protecting wildlife and their habitats from human encroachment.', 
                members=180,
                impact_stories='Protected endangered species; Restored wildlife habitats',
                events='Wildlife Protection Day; Habitat Restoration Campaign',
                banner='https://i.pinimg.com/564x/02/52/fe/0252fe07897cc0efddcd4519137ff75d.jpg',
                category='animals'
            )
    ]

        db.session.add_all(communities)

        # Commit all changes
        db.session.commit()
        print('Seed data successfully added.')

if __name__ == '__main__':
    seed_data()

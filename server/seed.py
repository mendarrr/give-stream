from app import app, db
from models import Admin

def seed_database():
    with app.app_context():
        
        default_admins = [
            {'username': 'kamau', 'email': 'kamau@gmail.com'},
            {'username': 'Mark', 'email': 'mark@gmail.com'},
            {'username': 'Abby', 'email': 'abby@gmail.com'},
            {'username': 'Kevin', 'email': 'kevin@gmail.com'},
            {'username': 'Maurine', 'email': 'maurine@gmail.com'}
        ]

        for admin_data in default_admins:
            admin = Admin(username=admin_data['username'], email=admin_data['email'])
            db.session.add(admin)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
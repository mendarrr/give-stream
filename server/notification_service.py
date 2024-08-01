from flask import current_app
from models import db, Donor, Donation
from datetime import datetime, timedelta
from sqlalchemy import and_
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(recipient, subject, body):
    sender_email = current_app.config['MAIL_USERNAME']
    sender_password = current_app.config['MAIL_PASSWORD']

    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = recipient
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT']) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)

def check_and_notify_subscriptions():
    # Get all recurring donations due in the next 24 hours
    tomorrow = datetime.utcnow() + timedelta(days=1)
    upcoming_donations = Donation.query.filter(and_(
        Donation.is_recurring == True,
        Donation.next_donation_date <= tomorrow
    )).all()

    for donation in upcoming_donations:
        donor = Donor.query.get(donation.donor_id)
        charity = donation.charity 

        # Prepare and send email
        subject = f"Upcoming Donation to {charity.name}"
        body = f"""
        Dear {donor.username},

        This is a friendly reminder that your recurring donation of ${donation.amount} to {charity.name} is scheduled for tomorrow.

        Thank you for your continued support!

        Best regards,
        Your Donation Platform Team
        """

        send_email(donor.email, subject, body)

        # Update the next donation date
        if donation.recurring_frequency == 'monthly':
            donation.next_donation_date += timedelta(days=30)
        elif donation.recurring_frequency == 'yearly':
            donation.next_donation_date += timedelta(days=365)
        
        db.session.commit()

    print(f"Processed {len(upcoming_donations)} upcoming donations.")

# This function would be called by a scheduler
def run_notification_service():
    with current_app.app_context():
        check_and_notify_subscriptions()
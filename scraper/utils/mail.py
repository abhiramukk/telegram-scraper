import smtplib, ssl
import json
import logging
logger = logging.getLogger(__name__)

config = json.load(open('config.json'))

def send_mail(message):
    port = 465  # For SSL
    
    sender_email = config["mail_sender"]
    password = config["mail_password"]
    receiver_email = config["mail_receiver"]

    # Create a secure SSL context
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
    logger.info(f"New Post Mail Sent to {receiver_email}")


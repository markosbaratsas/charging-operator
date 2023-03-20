import base64
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pathlib import Path


def send_email(
    credentials_file: Path,
    subject: str,
    from_email: str,
    to: list,
    bcc: list,
    text_content: str,
    reply_to: list,
):
    credentials = service_account.Credentials.from_service_account_file(
        credentials_file,
        scopes=['https://www.googleapis.com/auth/gmail.send']
    )
    credentials = credentials.with_subject(from_email)
    connection = build("gmail", "v1", credentials=credentials)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=from_email,
        to=to,
        bcc=bcc,
        reply_to=reply_to,
    )

    # convert it into base64 encoded string
    message = msg.message()
    # https://developers.google.com/gmail/api/guides/sending#creating_messages
    raw = base64.urlsafe_b64encode(message.as_bytes())
    raw = raw.decode()
    binary_content = {'raw': raw}

    # send
    connection.users().messages().send(userId='me', body=binary_content).execute()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from email.message import EmailMessage
import smtplib
import os

load_dotenv()

app = FastAPI(title="Portfolio Contact API")

# During local development, allow your frontend origin.
# Update this list when your frontend is deployed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://portfolio-zdv8-iyg2d1xfw-gbcodes.vercel.app",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@app.get("/")
def home():
    return {"message": "Portfolio backend is running"}


@app.post("/contact")
def send_contact(data: ContactMessage):

    email_address = os.getenv("EMAIL_ADDRESS")
    email_password = os.getenv("EMAIL_PASSWORD")

    if not email_address or not email_password:
        raise HTTPException(status_code=500, detail="Email configuration is missing.")

    email = EmailMessage()

    email["Subject"] = f"Portfolio Inquiry: {data.subject}"
    email["From"] = email_address
    email["To"] = email_address
    email["Reply-To"] = data.email

    email.set_content(
        f"""
You have received a new portfolio inquiry.

Name: {data.name}
Email: {data.email}
Subject: {data.subject}

Message:
{data.message}
"""
    )

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_address, email_password)
            server.send_message(email)

        return {"success": True, "message": "Your message has been sent successfully!"}

    except Exception as e:
        print("EMAIL ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to send your message right now."
        )

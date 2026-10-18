from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from email.message import EmailMessage
import smtplib
import os

load_dotenv()

app = FastAPI(title="Portfolio Contact API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ghous-bux-portfolio.netlify.app",
        "https://portfolio-azzxxdybq-gbcodes.vercel.app",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
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
        raise HTTPException(
            status_code=500, detail="Email configuration is missing on the server."
        )

    email = EmailMessage()
    email["Subject"] = f"Portfolio Inquiry: {data.subject}"
    email["From"] = email_address
    email["To"] = email_address
    email["Reply-To"] = str(data.email)

    email.set_content(
        f"You have received a new portfolio inquiry.\n\n"
        f"Name: {data.name}\n"
        f"Email: {data.email}\n"
        f"Subject: {data.subject}\n\n"
        f"Message:\n{data.message}"
    )

    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as server:
            server.starttls()
            server.login(email_address, email_password)
            server.send_message(email)

        return {"success": True, "message": "Your message has been sent successfully!"}

    except Exception as exc:
        print(f"EMAIL ERROR: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=500, detail="Unable to send your message right now."
        ) from exc

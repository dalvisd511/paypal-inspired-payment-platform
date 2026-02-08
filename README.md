# PayPal-Inspired Payment Platform (Full-Stack)

A full-stack PayPal-like wallet and peer-to-peer payment platform built with **Django REST Framework (JWT)** and **React (Vite)**.  
Users can register, log in, view wallet balance, add funds, send money to other users, and view transaction history.

## Tech Stack
- **Backend:** Django, Django REST Framework, SimpleJWT, SQLite
- **Frontend:** React (Vite), React Router, Axios
- **Auth:** JWT (access + refresh)
- **Security:** CORS configured for local development

## Features
- User registration + JWT login
- Protected routes (frontend)
- Wallet per user (auto-created)
- Add money (wallet top-up)
- Send money (peer-to-peer transfer)
- Transaction history (ledger-style)

## API Endpoints
Auth:
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`

Payments:
- `GET  /api/payments/wallet/`
- `POST /api/payments/wallet/add/`
- `POST /api/payments/send/`
- `GET  /api/payments/transactions/`

## Local Setup

### Backend (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

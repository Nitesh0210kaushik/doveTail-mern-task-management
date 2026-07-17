# Task Management App

## Requirements

- Node.js 20+
- MongoDB

## Run the project

### 1. Start the backend

~~~bash
cd backend
npm install
copy .env.example .env
npm run dev
~~~

Before starting, set MONGO_URI and JWT_SECRET in backend/.env.

Backend runs on http://localhost:5000.

### 2. Start the frontend

Open a new terminal:

~~~bash
cd frontend
npm install
copy .env.example .env
npm run dev
~~~

Frontend runs on the URL shown by Vite, usually http://localhost:5173.

Keep both terminals running while using the application.

## Authentication

The app uses JWT authentication with two HttpOnly cookies:

- **Access token:** short-lived token used for authenticated API requests.
- **Refresh token:** longer-lived token used to obtain a new access token when the access token expires.

Tokens are not returned in the response body and are not stored in localStorage. The frontend sends cookies automatically, refreshes expired access tokens, and redirects to login if the refresh session expires or is invalid.

## Rate limiting

API requests are rate-limited to 300 requests per 15 minutes. Register, login, and refresh requests have a stricter limit of 10 requests per 15 minutes.

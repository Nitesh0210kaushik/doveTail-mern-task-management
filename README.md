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

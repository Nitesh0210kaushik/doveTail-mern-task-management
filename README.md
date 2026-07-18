# Task Management App

Full-stack task management application built with React, TypeScript, Express, MongoDB and Mongoose.

## Requirements

- Node.js 20+
- MongoDB running locally or a MongoDB connection string

## Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend

Open another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend normally runs on `http://localhost:5173`.

## Environment variables

Backend variables are defined in `backend/.env.example`:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port; default is `5000` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random JWT signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime, for example `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime, for example `7d` |
| `CLIENT_URL` | Frontend URL allowed by CORS |
| `CSRF_COOKIE_NAME` | Name of the readable CSRF token cookie |
| `LOG_TO_FILE` | Set to `true` to write Winston logs to files |
| `LOG_DIR` | Log directory when file logging is enabled |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX` | General API request limit |
| `AUTH_RATE_LIMIT_MAX` | Authentication request limit |

Frontend `frontend/.env.example` contains:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit `.env` files or real secrets.

## Authentication

Authentication uses short-lived access and refresh JWT tokens stored in HttpOnly cookies. Tokens are not stored in localStorage or returned in the response body. The Axios client sends cookies automatically, refreshes an expired access token, and redirects to login when the refresh session is invalid.

## Security

- Passwords are hashed with bcrypt.
- Mongoose queries use authenticated user ownership filters, and search values are escaped before being used as regular expressions.
- Request bodies, query parameters and route parameters remove MongoDB operator keys such as `$` and dotted paths.
- Express validation limits input sizes and rejects HTML tags in user-visible name and task fields. React also escapes rendered text.
- Helmet, restricted CORS, HttpOnly cookies, `SameSite=Lax` cookies, rate limiting, Origin/Referer validation and a double-submit CSRF cookie/header protect browser state-changing requests.
- Production deployments must use HTTPS, a strong `JWT_SECRET`, a restricted `CLIENT_URL`, and secure cookie settings.

## API

Base URL: `http://localhost:5000/api`

### Public endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | API health check |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Log in a user |
| `GET` | `/auth/csrf` | Issue a CSRF token cookie for browser requests |
| `POST` | `/auth/refresh` | Rotate the refresh session and issue new cookies |
| `POST` | `/auth/logout` | Clear the auth cookies and revoke the session |

Registration body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "secure-password"
}
```

Login body:

```json
{
  "email": "ada@example.com",
  "password": "secure-password"
}
```

### Protected authentication endpoint

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/auth/me` | Return the current authenticated user |

### Protected task endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | List the current user's tasks |
| `GET` | `/tasks/:id` | Get one owned task |
| `PATCH` | `/tasks/:id` | Update one owned task |
| `DELETE` | `/tasks/:id` | Soft-delete one owned task |

Task body:

```json
{
  "title": "Prepare release notes",
  "description": "Review the completed work",
  "status": "Pending",
  "priority": "Medium",
  "dueDate": "2026-07-31"
}
```

Task list query parameters:

```text
search, status, priority, sortBy, sortOrder, page, limit
```

Supported values:

- Status: `Pending`, `In Progress`, `Completed`
- Priority: `Low`, `Medium`, `High`
- `sortBy`: `createdAt` or `dueDate`
- `sortOrder`: `asc` or `desc`

Example:

```text
GET /api/tasks?search=release&status=Pending&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

The list response includes tasks and flat pagination metadata:

```json
{
  "tasks": [],
  "page": 1,
  "limit": 10,
  "totalRecords": 0,
  "totalPages": 0
}
```

Validation errors return field-level details with an appropriate HTTP status. Authenticated task queries are always restricted to the current user's own records.

## Project structure

```text
backend/
  src/
    config/                 Environment, database and logger setup
    constants/              Shared task constants
    middleware/             Authentication, validation, errors and rate limits
    modules/
      auth/                 Auth routes, controller, service, repository and validation
      tasks/                Task routes, controller, service, repository and validation
      users/                User model and repository
    types/                  Express type extensions
    utils/                  API errors and async helpers
  tests/                    Backend integration tests

frontend/
  src/
    app/                    Application routes
    components/              Shared and UI components
    config/                 Axios and environment configuration
    constants/              Frontend endpoints and routes
    context/                Theme context
    features/               Auth and task feature code
    hooks/                  Reusable auth and task hooks
    pages/                  Dashboard, home and not-found pages
    services/               Axios API service functions
    store/                  Redux Toolkit store, slices and typed hooks
    styles/                 Global Tailwind styles
    utils/                  Shared frontend helpers
  tests/                    Frontend tests
```

## Useful commands

Backend:

```bash
npm run dev
npm run build
npm test
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm test
npm run preview
```

## Assumptions

- Each task belongs to exactly one user.
- Task descriptions are optional.
- Dates are submitted as valid date strings and stored by MongoDB as dates.
- Delete is implemented as a soft delete so deleted records remain in the database but are excluded from normal task queries.
- Authentication is cookie-based, so frontend and backend must use matching CORS and credential settings.

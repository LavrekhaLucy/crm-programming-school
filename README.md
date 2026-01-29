# CRM Programming School

Full‑stack CRM system for managing students and orders in a programming school.

The project consists of a **NestJS backend** and a **React + Vite frontend**. It supports authentication, role‑based access, filtering, sorting, pagination, and order management.

---

## Tech Stack

### Backend

* NestJS 11
* TypeScript
* TypeORM
* MySQL
* JWT Authentication
* Passport (local, jwt)
* Swagger
* Jest (unit tests)
* Docker Compose

### Frontend

* React 19
* TypeScript
* Vite
* Redux Toolkit
* React Router
* React Hook Form
* Axios
* Tailwind CSS

---

## Project Structure

```
crm-programming-school/
├── backend/ # Server-side (API, database, business logic)
├── frontend/ # Frontend (React) — development happens here
├── client/ # Built frontend for production
└── README.md # Project documentation
```
### Notes

- **Frontend** is developed in the `frontend/` folder and built into the `client/` folder using a bundler (Vite/Webpack/CRA).
- **Backend** serves static files from `client/` for the production version of the frontend.
- **Client** contains production-ready HTML, CSS, and JS files.

---

## Backend Setup

### Installation

```bash
cd backend
npm install
```

## Environment Variables

1. Copy the example `.env` from the project root to create your environment file:

```bash
   cp .env.example .env
```
   
2. Copy the example .env inside the frontend folder to create your frontend environment file:
  ```bash
cp frontend/.env.example frontend/.env
  ```

Open the newly created .env files and fill in your actual values (e.g., database credentials, JWT secrets, API URLs).

---


### Database

Run migrations:

```bash
npm run migration:run
```

(Optional) Seed database (creates initial admin user):

```bash
npm run seed
```

### Run backend

Development mode:

```bash
npm run start:dev
```

Backend will be available at:

```
http://localhost:3000
```

Swagger API documentation:

```
http://localhost:3000/api
```

### Run with Docker

```bash
npm run start:docker-compose
```

---

## Frontend Setup

### Installation

```bash
cd frontend
npm install
```

### Run frontend

```bash
npm run dev
```

### Build Frontend (Production)
```bash
npm run build
```

This will build the frontend into the client/ folder, which the backend serves in production.

---

## Features

* Authentication (JWT)
* Role‑based access
* Orders management
* Filtering and sorting
* Pagination with URL query params
* "Only my orders" filter
* Date range filtering
* Responsive UI

---

## Scripts

### Backend

* `npm run start:dev` — development mode
* `npm run migration:run` — run database migrations
* `npm run seed` — seed database
* `npm run test:unit` — unit tests

### Frontend

* `npm run dev` — development mode
* `npm run build` — production build

---
## Postman Collection

This project includes a Postman collection containing all available API endpoints.

### Location:

backend/postman/CRM_Programming_School.postman_collection.json


### How to use:

Open Postman

Click Import

Select the collection JSON file

(Optional) Configure environment variables (e.g. BASE_URL, ACCESS_TOKEN)

### Notes

The collection is intended for API testing and demonstration

Authentication-protected endpoints require a valid JWT token

No sensitive data is included in the collection

---
## Author

CRM Programming School — educational full‑stack project

Developed by Lavrekha Liudmila

---

## Notes

This project is intended for learning and portfolio demonstration.

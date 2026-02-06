# CRM Programming School

Full-stack CRM system for managing students and orders in a programming school.

The project consists of a **NestJS backend** and a **React + Vite frontend**.  
It supports authentication, role-based access, filtering, sorting, pagination, and order management.

---

## Getting Started

### Prerequisites

- Node.js LTS (v22 or later)  
  Download from the official website: https://nodejs.org/en

- Docker Desktop (recommended)  
  Download: https://www.docker.com/products/docker-desktop/

---

## Clone the repository

```bash
git clone https://github.com/LavrekhaLucy/crm-programming-school
cd crm-programming-school
```
---

## Tech Stack

### Backend

- TypeScript
- TypeORM
- MySQL (Aiven Cloud)
- JWT Authentication
- Passport (local, jwt)
- Swagger
- Jest (unit tests)
- Docker Compose

### Frontend

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- React Hook Form
- Axios
- Tailwind CSS

---

## Project Structure
```bash
crm-programming-school/
├── backend/      # NestJS backend (API, database, business logic)
├── frontend/     # Frontend source code (React + Vite)
├── client/       # Production build of frontend
├── docker-compose.yml
└── README.md
```

### Frontend / Production Notes

Frontend development happens in the frontend/ folder

Production frontend is built into the client/ folder

Backend serves static files from client/ in production

## Environment Variables

Copy example environment files:

### Backend
```bash
cp backend/.env.example backend/.env
```

### Frontend
```bash
cp frontend/.env.example frontend/.env
```

### Fill in required values:

- database credentials
- JWT secrets
- API URLs
- Initial admin credentials (used by the seed script for the first login)

---

## Run with Docker (Recommended)

### Start the full system:

```bash
docker compose up --build
```

- Backend will run on: http://localhost:3000


- Frontend will be served by backend at: http://localhost

#### Note:
To log in for the first time, use the credentials you defined in your .env file (these are processed by the seed script).
#### Note:
Frontend is already built into the client/ folder. No separate frontend server is needed.


## Manual Setup (Without Docker)

If you prefer not to use Docker, follow these steps to build and run the integrated system:

1. Prepare the Frontend

```bash
cd frontend
npm install
npm run build
```

This command builds the UI into the client/ folder, where the backend will serve it from.

2. Setup the Backend

```bash
cd ../backend
npm install
npm run migration:run
npm run seed
npm run start:dev
```

3. Access the Application

Main App & API: http://localhost:3000

Swagger Docs: http://localhost:3000/docs

Note: To log in for the first time, use the administrative credentials defined in your .env file (applied during the npm run seed process).

## Features

- JWT Authentication

- Role-based access control

- Orders management

- Comments system

- Filtering and sorting

- Pagination with URL query params

- "Only my orders" filter

- Date range filtering

- Responsive UI

---

## API Testing (Postman Collection)

## Location:
```bash

backend/postman/CRM_Programming_School.postman_collection.json
```


### How to use

- Open Postman

- Click Import

- Select collection JSON file

- Set variables if needed:
  - BASE_URL=http://localhost:3000
  - ACCESS_TOKEN=your_jwt_token


### Notes

Some endpoints require authentication

Use JWT access token

Collection contains no sensitive data
---

### Author

Lavrekha Liudmila
Full-stack CRM Programming School project

### Purpose

This project was created to:

- practice full-stack development

- learn NestJS architecture

- build a modern React application

- work with MySQL (Aiven Cloud)

- demonstrate real-world CRM functionality
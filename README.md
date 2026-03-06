# Recruitment Application - KTH IV1201

This project is part of the course **Design of Global Applications (IV1201)** at Kungliga Tekniska Högskolan (KTH).

## 1. Project Overview

The system is a robust, scalable web-based recruitment tool designed for an amusement park to manage seasonal staff applications. It distinguishes between two primary user roles: **Applicants** and **Recruiters**.

This document is intended as a handover guide, providing all necessary information for another team to understand the system architecture, run both the frontend and backend, and begin further development or maintenance.

---

## 2. Architecture & Tech Stack

The application is built using a modern full-stack web architecture with a separate frontend and backend, interacting via a REST API.

### Frontend (`/frontend`)
- **Framework:** React 19 bootstrapped with Vite for fast builds and HMR.
- **Language:** TypeScript.
- **Styling:** TailwindCSS 4, with Framer Motion for smooth animations and transitions.
- **State & Routing:** standard React hooks and React Router DOM.
- **Internationalization:** `react-i18next` providing robust, modular multi-language support.
- **Testing:** Vitest with React Testing Library and MSW (Mock Service Worker) for intercepting network requests in tests.

### Backend (`/backend`)
- **Framework:** Node.js > 20 with Express REST API.
- **Language:** TypeScript.
- **Database:** PostgreSQL (containerized with Docker).
- **ORM:** Drizzle ORM for type-safe database access, queries, and migrations.
- **Authentication:** JWT (JSON Web Tokens) with standard cookie-parsing and `bcrypt` for secure password hashing.
- **Validation:** `express-validator` to ensure all incoming data to the API is strictly formatted and sanitized.

---

## 3. Pre-defined Folder Layouts

The project enforces a strict separation of concerns within both the frontend and backend workspaces.

### Backend Layout (`/backend`)
The backend is structured around a typical layered REST API architecture, separating routing, business logic, data access, and schemas.
- `/src/` - The root directory for the application code.
  - `/api/` - Defines the Express routes and middleware. Handles incoming HTTP requests and response formatting.
  - `/controller/` - Orchestrates business logic, acting as the glue between the routes and the data models.
  - `/integration/` - Contains logic for integrating with external systems or databases (e.g., DAOs/Data Access Objects).
  - `/model/` - Houses TypeScript interfaces, type definitions, and DTOs representing business entities.
  - `/db/` - Contains database connection configurations, Drizzle ORM schemas, and seeding/migration scripts.
  - `/util/` - Utility scripts and shared helper functions (e.g., custom error handling, validators).
  - `server.ts` - The main entry point that configures and starts the Express application.
- `/drizzle/` - Auto-generated and manual database migration files used by Drizzle ORM.

### Frontend Layout (`/frontend`)
The frontend follows a feature-based React architecture.
- `/src/` - The root directory for the React application.
  - `/pages/` - Top-level React components representing full views/routes (e.g., `LoginPage.tsx`, `ApplicantDashboard.tsx`).
  - `/components/` - Reusable UI components (buttons, forms, layout elements) used across different pages.
  - `/contexts/` - Global React Context providers (e.g., `AuthContext`, `ApplicationContext`) for managing distributed state.
  - `/hooks/` - Custom React hooks encapsulating specific UI logic or data fetching behavior.
  - `/services/` - API client modules containing `axios` calls to communicate directly with the backend endpoints.
  - `/utils/` - General helper functions, formatters, and shared constants.
  - `/types/` - Global TypeScript type definitions and interfaces.
  - `/test/` - Unit and integration tests, along with MSW mock handlers.
  - `/assets/` - Static assets like images or global stylesheets (`index.css`).
  - `App.tsx` & `main.tsx` - Root application files setting up routing and context providers.

---

## 4. Setup & Running the Application

### Prerequisites
- Node.js >= 20.0
- Docker & Docker Compose (for the PostgreSQL database)
- Git

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Copy the example environment file. The default values are designed to work locally with the provided Docker setup.
   ```bash
   cp .env.example .env
   ```
4. **Start the Database**:
   ```bash
   npm run db:up
   ```
   This uses `docker-compose.yml` to spin up a local PostgreSQL database instance on `127.0.0.1:5433` using the credentials in `.env`.
5. **Run Migrations & Seed Data**:
   Setup the tables using Drizzle and seed it with dummy/test data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
   *(Optional) To seed recruiter/admin accounts: `npm run db:seed:admin`*
   *(Optional) To pull in legacy data from the old system: `npm run db:old:data`*
6. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The backend API will run in development mode with hot-reloading (typically on `http://localhost:3000`).

### Frontend Setup

1. **Navigate to the frontend directory** in a new terminal window:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the Frontend Server**:
   ```bash
   npm run dev
   ```
   The frontend will be accessible in your browser (typically at `http://localhost:5173`). It will automatically connect to the backend running on port 3000.

---

## 5. Testing the Application

### Frontend Tests
The frontend includes a comprehensive suite of unit and integration tests.
- To execute tests in interactive watch mode:
  ```bash
  cd frontend
  npm run test
  ```
- To execute a single test run (useful for continuous integration checks without opening the interactive watcher):
  ```bash
  cd frontend
  npx vitest run
  ```
- To view test coverage:
  ```bash
  npm run test:coverage
  ```
- To open the Vitest UI dashboard:
  ```bash
  npm run test:ui
  ```

---

## 6. Key Features & Business Logic

### For Applicants
- **Account Registration:** Quick setup with personal details and validation rules.
- **Job Application:** Create a profile including:
  - **Competence Profile:** Areas of expertise and years of experience.
  - **Availability:** Specific periods available for work.
- **Multi-language Support:** The interface is fully translated for global future-proofing.

### For Recruiters
- **Application Management:** Dedicated dashboard to review, filter, and sort submitted applications.
- **Decision Making:** Mark applications as *Accepted*, *Rejected*, or *Unhandled*.
  - *Note on Concurrency:* The system handles concurrent status updates. If two recruiters try to update the same application simultaneously, the system will prevent data overriding (often using optimistic locking or versioning).

## 7. Useful Backend Commands

- `npm run db:generate`: Use this whenever you modify the Drizzle schema files in `/backend/src/db/schema/` to generate the corresponding SQL migration files in `/backend/drizzle/`.
- `npm run db:studio`: Opens Drizzle Studio in your browser, allowing you to manually inspect and edit the database tables visually.
- `npm run db:down`: Stops the docker database instance.
- `npm run db:down:clean`: Stops the database and removes all volumes (wiping the data completely).
- `npm run db:logs`: Tail the database logs.

---

## 8. Deployment (Render)

The application is configured for deployment on **Render** (as defined in `render.yaml`).

### Backend Service (`recruitment-backend`)
- **Runtime:** Node.js
- **Build Command:** `npm ci && npm run build && npm run db:migrate && npm run db:seed && npm run db:old:data && npm run db:seed:admin`
- **Start Command:** `npm start`
- **Environment Variables:** Requires `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, and `IS_PRODUCTION=true`.

### Frontend Service (`recruitment-frontend`)
- **Runtime:** Static Site
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** Requires `VITE_API_URL` pointing to the deployed backend.

### Database (`recruitment-db`)
- **Instance:** Managed PostgreSQL on Render.

---

## 9. Further Documentation

For deeper technical dives into specific parts of the system, please refer to the files in the [`docs/`](./docs/) directory:

- **[Frontend Testing Guide](./docs/frontend/TESTING_GUIDE.md)**: Detailed explanation of the Vitest, RTL, and MSW setup.
- **[Frontend Features](./docs/frontend/features.md)**: Breakdown of implemented user flows.
- **[Backend Technical Overview](./docs/backend/backend_readme.md)**: Original technical specifications for the backend services.
- **[Drizzle ORM Guide](./docs/backend/DRIZZLEGUIDE.md)**: How to manage the database schema and migrations.
- **[Git Workflow](./docs/general/git_guide.md)**: Best practices for contributing to this repository.
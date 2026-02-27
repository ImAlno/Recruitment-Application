# Recruitment Application - Backend

This directory contains the Express.js backend for the Recruitment Application, using PostgreSQL and Drizzle ORM.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) installed (v18+ recommended).

## Setup Instructions

### 1. Install Dependencies
 Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file by copying the example file:

```bash
cp .env.example .env
# MAC/Linux
# copy .env.example .env 
# Windows Command Prompt
```

**Note:** The default configuration uses Port `5433` for the database to avoid conflicts with other local PostgreSQL instances.

### 3. Start the Database
Start the PostgreSQL container using Docker:

```bash
npm run db:up
```
*(This allows you to skip typing `docker-compose up -d`)*

## Database Migration
Once the database is running, you need to create the table structure.

### 1. Generate Migrations
Create the SQL migration files from your Drizzle schema:

```bash
npm run db:generate
```

### 2. Apply Migrations
Apply the changes to the database:

```bash
npm run db:migrate
```

### 3. Seed the Database
Populate the database with initial required data (like roles):

```bash
npm run db:seed
```
*Note: This only needs to be run once during initial setup or after resetting the database.*

## Development

### Start the Server
Run the backend in development mode (with hot-reloading):

```bash
npm run dev
```

### View Database (Drizzle Studio)
To visually inspect your tables and data, manage records, or run queries:

```bash
npm run db:studio
```
This will open Drizzle Studio in your browser at [https://local.drizzle.studio](https://local.drizzle.studio).

## Helper Commands

The `package.json` includes several helper scripts for database management:

| Command | Description |
|---------|-------------|
| `npm run db:up` | Starts the Docker container |
| `npm run db:down` | Stops and removes the Docker container |
| `npm run db:logs` | View database logs |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Populate database with default data |

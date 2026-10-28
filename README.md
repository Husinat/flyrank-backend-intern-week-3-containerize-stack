# Task CRUD API — Docker & PostgreSQL

A RESTful Task Management API built with Node.js, Express, and PostgreSQL. The application is containerized with Docker and Docker Compose, with persistent database storage.

## Features

- Create, retrieve, update, and delete tasks.
- Store task data in PostgreSQL.
- Use parameterized SQL queries through a dedicated repository layer.
- Manage application configuration through environment variables.
- Automatically initialize the database with a table and sample tasks.
- Persist database data using a Docker named volume.
- Explore API endpoints using Swagger UI.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express** — REST API framework
- **PostgreSQL** — Relational database
- **pg** — PostgreSQL client for Node.js
- **Docker & Docker Compose** — Containerization and service orchestration
- **Swagger UI** — API documentation

## Prerequisites

- Docker Desktop with the Docker Engine running
- Git, if cloning the repository

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

Replace the placeholders with your actual GitHub repository URL and project folder name.

### 2. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a template.

If you already have a `.env` file, keep your existing configuration.

The environment variables include:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`
- `PORT`

Use appropriate credentials for your environment. The example credentials are for local development only.

### 3. Build and start the application

Run:

```bash
docker compose up --build
```

Docker Compose builds the API image, starts PostgreSQL, waits for the database health check, and starts the application.

### 4. Access the API

- **API base URL:** http://localhost:5000
- **Swagger documentation:** http://localhost:5000/docs
- **Get all tasks:** http://localhost:5000/tasks

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Use Swagger UI at `/docs` to explore and test the endpoints.

## Database Persistence

PostgreSQL data is stored in a Docker named volume called `postgres_data`. This allows the database to retain its data when the containers are stopped or recreated.

Stop the containers:

```bash
docker compose down
```

Start them again:

```bash
docker compose up -d
```

The database data remains available because the named volume is preserved.

**Warning:** `docker compose down -v` removes the named volume and deletes the persisted database data.

## Project Structure

```text
.
├── database/
│   └── taskRepository.js
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── index.js
├── init.sql
├── openapi.json
├── package.json
├── package-lock.json
└── README.md
```

## Implementation Notes

- `index.js` defines the Express application and API routes.
- `database/taskRepository.js` handles database queries, separating data access from route logic.
- `init.sql` creates the tasks table and inserts initial sample records.
- `Dockerfile` defines how the API image is built.
- `docker-compose.yml` configures the API service, PostgreSQL service, health check, and persistent volume.
- `.env.example` documents the required environment variables without requiring users to share their local configuration.
- `.dockerignore` excludes files that should not be copied into the Docker build context.

## Stopping the Application

Run:

```bash
docker compose down
```

This stops and removes the containers while preserving the named database volume.

## Screenshots

### Docker Containers

The application and PostgreSQL database running in Docker Desktop.

![Docker containers running](./images/docker%20container.png)

### API Documentation

Swagger UI documentation for exploring and testing the Task API.

![Swagger UI API documentation](./images/Swagger%20docs.png)

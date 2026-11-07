# Job Portal

A full-stack job-listing application with a React and TypeScript frontend and a FastAPI backend. It supports creating, browsing, searching, sorting, editing, and deleting job listings stored in PostgreSQL.

## Features

- Dashboard and browsable job listings
- View a job's details
- Create, edit, and delete job listings
- Search by title, location, job type, and salary range
- Paginate listings and sort them by salary
- REST API with interactive OpenAPI documentation

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios, and Lucide icons
- **Backend:** Python, FastAPI, Pydantic, and SQLAlchemy
- **Database:** PostgreSQL

## Repository layout

```text
.
├── main.py                 # FastAPI app and job endpoints
├── database.py             # SQLAlchemy engine and database session dependency
├── models.py               # SQLAlchemy Job model
├── schemas.py              # Pydantic request/response schemas
└── frontend/
    ├── src/
    │   ├── components/     # Shared UI components
    │   ├── pages/          # Dashboard and job pages
    │   ├── services/       # API client
    │   └── types/          # Frontend types
    └── package.json
```

## Requirements

- Python 3.10 or later (the backend uses modern union type syntax)
- Node.js and npm
- PostgreSQL

## Getting started

### 1. Configure PostgreSQL

Create a PostgreSQL database named `job_portal`. The backend's current connection URL is defined in `database.py` and points to a local PostgreSQL instance. Update `DATABASE_URL` there to match your local username, password, host, port, and database before starting the API. Do not commit real credentials; use an environment variable or another local-only configuration for secrets.

When the backend starts, SQLAlchemy creates the `jobs` table if it does not already exist.

### 2. Install and start the backend

From the repository root, create and activate a virtual environment, then install the backend packages:

```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
# .venv\Scripts\Activate.ps1

pip install fastapi uvicorn sqlalchemy psycopg2-binary
```

Run the API from the repository root:

```bash
uvicorn main:app --reload
```

The API is available at <http://127.0.0.1:8000>. Interactive API documentation is available at <http://127.0.0.1:8000/docs> (ReDoc at <http://127.0.0.1:8000/redoc>).

### 3. Install and start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally <http://localhost:5173>). The frontend API client currently targets `http://127.0.0.1:8000`. The backend CORS configuration allows the Vite development origin on port 5173 and the localhost development origin on port 3000.

## Job data

A job listing has these fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer | Response only | Database-generated job identifier |
| `title` | string | Yes when creating | Job title |
| `company` | string | Yes when creating | Company name |
| `location` | string | No | Job location |
| `description` | string | No | Job description |
| `salary` | number | No | Salary value; must be non-negative when provided |
| `job_type` | string | No | Job type, for example full-time or contract |

## API reference

All endpoints are served from `http://127.0.0.1:8000` and use JSON unless noted.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | API welcome message |
| `POST` | `/jobs` | Create a job; provide `title` and `company`, plus optional fields |
| `GET` | `/jobs` | List all jobs |
| `GET` | `/jobs/{job_id}` | Get one job by ID; returns 404 if not found |
| `PUT` | `/jobs/{job_id}` | Replace a job's editable fields |
| `PATCH` | `/jobs/{job_id}` | Update only the supplied fields |
| `DELETE` | `/jobs/{job_id}` | Delete a job |
| `GET` | `/jobs/search` | Filter jobs by search criteria |
| `GET` | `/jobs/pagination` | List a page of jobs |
| `GET` | `/jobs/sort` | Sort jobs by salary |

### Search, pagination, and sorting

- Search accepts `title`, `location`, `job_type`, `min_salary`, and `max_salary`. Title and location are partial, case-insensitive matches; job type is an exact match. For example: `/jobs/search?title=engineer&location=Toronto&job_type=Full-time&min_salary=50000&max_salary=150000`.
- Pagination accepts `page` (default `1`) and `page_size` (default `10`), for example `/jobs/pagination?page=1&page_size=10`.
- Sorting accepts `order=asc` or `order=desc` (default `asc`), for example `/jobs/sort?order=desc`. Other values return HTTP 400.

## Frontend commands

Run these from `frontend/`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build in dist/
npm run preview  # Preview the production build
npm run lint     # Run Oxlint
```

## Notes

- The backend currently configures its database connection directly in `database.py`; configure it for your machine before running.
- This project does not currently include automated backend tests or a Python dependency lock/requirements file.
- The frontend's API base URL is currently set in `frontend/src/services/api.ts`.

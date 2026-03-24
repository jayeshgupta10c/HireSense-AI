# HireSense AI: Analytical Recruiting Engine

HireSense AI is a robust, multi-tenant SaaS platform built to tackle objective resume screening. By combining machine learning concepts with raw natural language processing, the engine programmatically evaluates, grades, and ranks candidate resumes against specific job descriptions to eliminate screening latency.

## System Architecture

The application implements a decoupled client-server topology to ensure scaling isolation:
- **Client (Frontend)**: Constructed with React and Vite. It heavily features a custom 'Neobrutalism' design system relying on strict vanilla CSS tokens, `recharts` for radar analytics, and explicit dark-mode overrides.
- **Microservice (Backend)**: Built natively on Python's FastAPI. This layer acts as the heavy computational center, executing TF-IDF vectorization, dense cosine similarity formulas, and text tokenization algorithms via Scikit-Learn and NLTK.
- **Persistence Layer**: MongoDB serves as the NoSQL storage mechanism, handling JSON-based analytics logs, JWT-secured user clusters, and asynchronous indexing.

## Core Capabilities

1. **Role-Based Access Control (RBAC)**: Securely partitions system capabilities between standard candidates (resume uploaders) and administrative personnel (dashboard viewers).
2. **Dense Vector Statistical Matching**: Bypasses simplistic keyword checking by utilizing statistical term frequency to calculate strict ATS compliance and alignment grades.
3. **Generative Assessment**: Translates raw statistical output into actionable career pivots, skill gap analyses, and automated cover letter generation.
4. **Differential ML Leaderboards**: Allows administrators to cluster historical candidate records and trigger real-time comparative rankings.

## Local Configuration Guide

### Base Dependencies
- Node.js (v18.0.0 or higher)
- Python (3.10.0 or higher)
- Active MongoDB Daemon or Atlas URI cluster

### Initializing the APIs (Backend)
Navigate into the `backend/` directory.
1. Spin up an isolated python environment: `python -m venv venv`
2. Activate the runtime: `venv\Scripts\activate` (Win) or `source venv/bin/activate` (Mac/Linux)
3. Inject the exact environment modules: `pip install -r requirements.txt`
4. Define your connection strings in a `.env` file (e.g., `MONGO_URI`, `JWT_SECRET`).
5. Boot the Uvicorn ASGI process: `uvicorn app.main:app --reload`

### Initializing the Client (Frontend)
Navigate into the `frontend/` directory.
1. Mount the node dependencies: `npm install`
2. Serve the developer build: `npm run dev`

## Deployment Strategy

The application provides a fully configured orchestration map for immediate production deployment.

```bash
docker-compose up --build -d
```
Executing this command instructs the Docker daemon to build the Alpine NGINX frontend container, the slim Python backend container, and pull the latest Mongo image, piping them together across a dedicated internal network. 

Ports configured:
- `80`: Web Application
- `8000`: FastAPI JSON Routes
- `27017`: Database Storage

## Continuous Integration
Code safety is guaranteed via the included `.github/workflows/ci.yml` pipeline. It automatically traps push and pull-request events on the `main` branch to independently validate the Node.js build constraints and the Python dependency tree.

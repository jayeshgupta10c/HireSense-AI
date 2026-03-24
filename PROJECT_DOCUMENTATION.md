# HireSense AI: The Ultimate Documentation

HireSense AI is a premium, production-ready SaaS platform that leverages Machine Learning to analyze resumes, rank candidates, and provide AI-driven career growth blueprints.

---

## 🏗 Tech Stack
- **Frontend**: React 18, Vite, Framer Motion (for animations), Lucide React (icons), Recharts (analytics).
- **Backend**: FastAPI (Python), Motor (Async MongoDB Driver).
- **Database**: MongoDB (Local or Atlas).
- **Machine Learning**: Scikit-Learn (TF-IDF Vectorization, Cosine Similarity), Pandas, NumPy.
- **Formatting**: ReportLab (PDF Generation), PyPDF2 (PDF Extraction).
- **Auth**: JWT (JSON Web Tokens), Passlib (Bcrypt hashing).

---

## 💎 Core Functionalities

### 1. Multi-Tenant Authentication System
- **Role-Based Access Control (RBAC)**: Supports `user` and `admin` roles.
- **Secure Handling**: Password hashing via Bcrypt and session persistence via encrypted JWT tokens.
- **Protected Routes**: Navigation is restricted based on authentication state.

### 2. Advanced Resume ML Engine
- **TF-IDF Matching**: Uses a sophisticated vectorization engine trained on a 240-role dataset to calculate compatibility.
- **Analysis Metrics**:
  - **Match Score**: Exact mathematical similarity to the role.
  - **ATS Score**: Probabilistic score representing how well a resume passes automated filters.
  - **Candidate Rank**: Relative ranking of the resume quality.
- **Skill Gap Analysis**: Automatically identifies "Strengths" and "Missing Skills."

### 3. Neobrutalist Admin Dashboard
- **User Management**: Real-time view of all registered platform users.
- **Resume Archive**: Global history of every scan performed on the system.
- **Multi-Resume Comparison**: Recruiters can select multiple resumes from the database and rank them against a custom Job Description (JD) using the ML engine.

### 4. AI Career Blueprints
- **MCQ Generation**: AI-generated technical quizzes based on the detected role.
- **Growth Roadmap**: Step-by-step career progression recommendations.
- **Resume Builder**: Professional PDF generation for users to instantly create improved resumes.

---

## 📂 Architecture Overview
- **`/frontend`**: 
  - `src/components`: UI primitives (Buttons, Modals, Headers).
  - `src/pages`: Main views (Dashboard, Admin, AnalysisResult).
  - `src/context`: `AuthContext` for global state management.
- **`/backend`**:
  - `app/main.py`: Entry point with global error handling and health checks.
  - `app/routes`: Modular API endpoints (Analyze, Auth, Admin, Resume).
  - `app/services/ml.py`: The core ML Matching Engine and PDF processing.
  - `app/db/mongodb.py`: Resilient database connection layer.

---

## 🚀 Deployment & Operations
- **Docker**: Included `docker-compose.yml` for unified local development.
- **Render (Backend)**: Hard-pinned to Python 3.10.13 with Pymongo/Motor compatibility.
- **Vercel (Frontend)**: Highly optimized React build with dynamic API routing.

---
*Built with visual excellence and technical precision by HireSharks.*

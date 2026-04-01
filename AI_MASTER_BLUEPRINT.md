# 🧬 HireSense AI: Master Reconstruction Blueprint

*Copy and paste this prompt into any LLM/AI to recreate the exact architecture, UI, and logic of the HireSense AI platform.*

---

### **Prompt Objective**
Create a production-ready, multi-tenant Resume Analysis SaaS called "HireSense AI." The project must feature a **premium Neobrutalist UI**, a **Modular FastAPI Backend**, and a **Hybrid ML Matching Engine**.

---

### **1. Tech Stack Requirements**
- **Frontend**: React 18 (Vite), TailwindCSS, Framer Motion (Animations), Lucide React (Icons), Recharts (Data Viz).
- **Backend**: Python 3.10+, FastAPI, Motor (Async MongoDB), Scikit-Learn.
- **Database**: MongoDB (Multi-tenant structure).
- **Security**: JWT Auth with Role-Based Access Control (User/Admin).

### **2. Project Structure**
- `root/`
  - `backend/`
    - `app/main.py` (Entry point with global error handling)
    - `app/routes/` (auth.py, analyze.py, admin.py, resume_builder.py)
    - `app/services/ml.py` (Core ML Matching Engine)
    - `app/db/mongodb.py` (Connection layer)
    - `dataset.csv` (240+ professional roles & skills)
  - `frontend/`
    - `src/components/` (Neobrutalist UI primitives)
    - `src/pages/` (Landing, Login, Dashboard, AnalysisResult, AdminPortal)
    - `src/context/` (AuthContext.jsx)
  - `docker-compose.yml`

### **3. UI Design System (Neobrutalism)**
- **Colors**: High-contrast (Black #000000, White #FFFFFF, Electric Purple/Blue accents).
- **Borders**: Heavy 4px black borders on buttons and cards.
- **Shadows**: Hard, non-blurred 4px-8px offset shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
- **Typography**: Bold, modern sans-serif (Inter/Outfit).
- **Animations**: Subtle hover scale-ups and slide-ins using Framer Motion.

### **4. Core Logic & Algorithms**
- **Hybrid Matching Engine**: 
  - Do NOT use simple keyword matching. 
  - Use `TfidfVectorizer` (Scikit-Learn) with `cosine_similarity`.
  - **The Hybrid Fix**: Calculate `Score = (TF-IDF Similarity * 0.3) + (Keyword Density * 0.7)`. If all skills match, the score MUST be >90%.
- **Admin Multi-Compare**: Allow an admin to select multiple resume IDs from MongoDB and rank them all at once against a new Job Description using the `MatchingEngine`.
- **PDF Extraction**: Use `PyPDF2` with robust error handling for images/unreadable text.
- **PDF Generation**: Use `ReportLab` to auto-generate a sleek resume based on analysis results.

### **5. Key API Endpoints**
- `POST /auth/signup` & `POST /auth/login` (JWT + Admin Role).
- `POST /analyze`: Accepts PDF + Job Title; returns Gauge metrics, Strengths, Missing Skills, and Role Comparison.
- `GET /admin/compare-resumes`: Accepts list of IDs + new JD; returns a ranked candidate matrix.
- `GET /health`: Returns service & DB status.

### **6. Deployment Rules**
- **Backend**: Optimized for Render with `WEB_CONCURRENCY=1`.
- **Frontend**: Optimized for Vercel with environment-based API URLs.
- **Resilience**: Every file must have `try/except` blocks to prevent 500 crashes.

---
*End of Blueprint. Execute with focus on "Visual Excellence" and "Robust Backend Pathing".*

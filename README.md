# HireSense AI – Analyze • Compare • Code

HireSense AI is a premium SaaS platform designed for high-end resume analysis, talent recruitment, and candidate ranking using an advanced TF-IDF ML matching engine.

## 🚀 Quick Start (Docker)

Ensure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

1.  **Clone and Enter**:
    ```bash
    git clone <your-repo-url>
    cd HireSense-AI
    ```
2.  **Environment Variables**:
    Create a `.env` in the root (or backend/frontend folders) with your keys (Groq, MongoDB, etc).
3.  **Launch**:
    ```bash
    docker-compose up --build
    ```
4.  **Access**:
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8000`

## 🛠 Features
- **Smart Resume Analysis**: Extracts text and matches against 240+ specialized roles.
- **Admin Dashboard**: Bulk resume comparison matrix for recruiters.
- **AI Career Pathing**: Growth blueprints and MCQ generation via Groq API.
- **Secure Auth**: JWT-based RBAC (Admin/User).

## 📂 Project Structure
- `/frontend`: React + Vite + Framer Motion (Neobrutalism UI).
- `/backend`: FastAPI + Motor (MongoDB) + Scikit-Learn.
- `dataset.csv`: ML baseline dataset.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ by HireSharks.*

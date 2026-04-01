import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import io, random, re
import PyPDF2

import os

# Resolve the absolute path to the dataset.csv file in the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATASET_PATH = os.path.join(BASE_DIR, "dataset.csv")

def load_dataset():
    try:
        # Resolve absolute paths for multiple environments (Local, Docker, etc)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        possible_paths = [
            os.path.join(os.getcwd(), "dataset.csv"),
            os.path.join(os.path.dirname(os.path.dirname(current_dir)), "dataset.csv"), # Root from app/services
            os.path.join(os.path.dirname(current_dir), "dataset.csv"), # Parent
            "/app/dataset.csv", # Docker standard
            "dataset.csv"
        ]

        for path in possible_paths:
            if os.path.exists(path):
                df = pd.read_csv(path)
                df.columns = [c.strip() for c in df.columns]
                print(f"RESILIENCE: Dataset found and loaded from {path}")
                return df

        print("CRITICAL: Dataset file NOT FOUND in any known location.")
        return pd.DataFrame(columns=['Resume', 'Skills', 'Job_Role'])
    except Exception as e:
        print(f"CRITICAL: Dataset load failure: {e}")
        return pd.DataFrame(columns=['Resume', 'Skills', 'Job_Role'])

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        return " ".join(page.extract_text() or "" for page in reader.pages).strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

def clean_text(text: str) -> str:
    return re.sub(r"[^\w\s]", " ", text.lower())

# --- IMPROVED SKILL EXTRACTION & SCORING --- #

TECH_SKILLS = [
    "PYTHON", "JAVA", "JAVASCRIPT", "C++", "C#", "RUBY", "GO", "RUST", "PHP", "SWIFT", "KOTLIN",
    "SQL", "MONGODB", "POSTGRESQL", "MYSQL", "REDIS", "CASSANDRA", "DYNAMODB",
    "REACT", "ANGULAR", "VUE", "NEXT.JS", "NODE.JS", "EXPRESS", "DJANGO", "FLASK", "SPRING",
    "AWS", "AZURE", "GCP", "DOCKER", "KUBERNETES", "TERRAFORM", "JENKINS", "GIT",
    "MACHINE LEARNING", "DEEP LEARNING", "PYTORCH", "TENSORFLOW", "SCIKIT-LEARN", "PANDAS", "NUMPY",
    "DATA SCIENCE", "DATA ANALYSIS", "NLP", "COMPUTER VISION", "TABLEAU", "POWER BI",
    "AGILE", "SCRUM", "REST API", "GRAPHQL", "MICROSERVICES", "CI/CD", "UNIT TESTING",
    "HTML", "CSS", "SASS", "TAILWIND", "BOOTSTRAP", "TYPESCRIPT", "UI/UX", "FIGMA"
]

def extract_skills_robust(text: str) -> list[str]:
    """Identify skills from a text using a predefined dictionary."""
    found = []
    text_upper = text.upper()
    for skill in TECH_SKILLS:
        # Use word boundaries to avoid partial matches (e.g., 'Go' in 'Google')
        pattern = rf"\b{re.escape(skill)}\b"
        if re.search(pattern, text_upper):
            found.append(skill)
    return found

def calculate_ats_quality(text: str) -> dict:
    """Heuristic assessment of resume formatting and content."""
    score = 0
    details = []
    
    # 1. Contact Info check
    has_email = bool(re.search(r"[\w\.-]+@[\w\.-]+", text))
    has_phone = bool(re.search(r"(\+?\d{1,3}[-.\s]?)?\d{10}", text))
    has_url = "linkedin.com" in text.lower() or "github.com" in text.lower()
    
    if has_email: score += 10
    if has_phone: score += 10
    if has_url: score += 10
    
    # 2. Section Headings check
    sections = ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "SUMMARY", "CERTIFICATIONS", "LANGUAGES"]
    found_sections = [s for s in sections if s in text.upper()]
    score += (len(found_sections) / len(sections)) * 40
    
    # 3. Word Count (Goldilocks zone: 400-800 words)
    word_count = len(text.split())
    if 400 <= word_count <= 800:
        score += 30
    elif 200 <= word_count < 400 or 800 < word_count <= 1200:
        score += 15
    else:
        score += 5

    return {
        "score": round(score, 2),
        "found_sections": found_sections,
        "contact_info": {"email": has_email, "phone": has_phone, "links": has_url},
        "word_count": word_count
    }

class MatchingEngine:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
        self.vectors = None

        if not data.empty:
            resume_col = next((c for c in data.columns if "resume" in c.lower()), None)
            skill_col  = next((c for c in data.columns if "skill" in c.lower()), None)
            role_col   = next((c for c in data.columns if "role" in c.lower() or "job" in c.lower()), None)

            self._resume_col = resume_col or data.columns[0]
            self._skill_col  = skill_col  or data.columns[1]
            self._role_col   = role_col   or data.columns[2]

            corpus = data[self._resume_col].fillna("").astype(str)
            self.vectors = self.vectorizer.fit_transform(corpus)
            print(f"Premium Engine ready")

    def match(self, resume_text: str, job_desc: str) -> dict:
        # --- PHASE 1: SEMANTIC CONTEXT (TF-IDF) ---
        input_vec = self.vectorizer.transform([resume_text + " " + job_desc])
        similarities = cosine_similarity(input_vec, self.vectors).flatten()
        best_idx = int(np.argmax(similarities))
        semantic_score = float(similarities[best_idx]) * 100
        
        # --- PHASE 2: DIRECT SKILL MATCHING ---
        resume_skills = set(extract_skills_robust(resume_text))
        jd_skills     = set(extract_skills_robust(job_desc))
        
        # Fallback: if JD has no recognized skills, use the JD text's most common words or best match row
        if not jd_skills:
             best_row = self.data.iloc[best_idx]
             jd_skills = set(s.strip().upper() for s in str(best_row.get(self._skill_col, "")).split("|") if s.strip())

        matched = list(resume_skills.intersection(jd_skills))
        missing = list(jd_skills.difference(resume_skills))
        
        # --- PHASE 3: ATS QUALITY CHECK ---
        ats_data = calculate_ats_quality(resume_text)
        
        # --- PHASE 4: FINAL BLENDING ---
        # Match Score: 50% Skill Alignment + 50% Semantic Context
        skill_align_score = (len(matched) / len(jd_skills) * 100) if jd_skills else 50
        match_score = (skill_align_score * 0.6) + (semantic_score * 0.4)
        
        # Ensure premium feel with realistic scaling
        match_score = min(max(match_score, 15), 98)
        
        # ATS Score refinement
        ats_score = ats_data["score"]
        
        role = str(self.data.iloc[best_idx].get(self._role_col, "Software Professional"))

        summary = (
            f"ANALYSIS COMPLETE: YOUR RESUME YIELDS A {round(match_score, 1)}% ALIGNMENT WITH THE TARGET REQUIREMENTS. "
            f"CRITICAL MATCHES: {', '.join(matched[:4]).upper()}. "
            f"{'IMMEDIATE GAP DETECTED: ' + ', '.join(missing[:3]).upper() + '.' if missing else ''}"
        ).strip()

        return {
            "score":     round(match_score, 2),
            "ats_score": round(ats_score, 2),
            "rank":      max(round(100 - match_score, 1), 0.5),
            "role":      role,
            "summary":   summary,
            "skills": {
                "match":   matched[:12],
                "missing": missing[:12]
            },
            "traits": build_traits(matched, missing, match_score),
            "pivots": suggest_pivots(role),
            "ats_details": ats_data
        }

def build_traits(matched: list, missing: list, base_score: float) -> list:
    traits = []
    for s in matched[:5]:
        traits.append({"label": s, "you": min(int(base_score) + random.randint(5, 15), 98), "req": 90})
    for s in missing[:5]:
        traits.append({"label": s, "you": random.randint(10, 30), "req": 90})
    return traits

def suggest_pivots(role: str) -> list[str]:
    ALL = ["DATA SCIENTIST", "SOFTWARE ENGINEER", "SOLUTIONS ARCHITECT", "DEVOPS", "PRODUCT MANAGER"]
    return [p for p in ALL if p != role.upper()][:4]

df_global = load_dataset()
engine = MatchingEngine(df_global)

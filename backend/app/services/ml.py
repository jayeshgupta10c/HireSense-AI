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
            print(f"Engine ready — resume='{self._resume_col}' skills='{self._skill_col}' role='{self._role_col}'")

    def _parse_skills(self, raw: str) -> list[str]:
        sep = "|" if "|" in raw else ","
        return [s.strip().upper() for s in raw.split(sep) if s.strip()]

    def match(self, resume_text: str, job_desc: str) -> dict:
        if self.data.empty or self.vectors is None:
            return {"error": "Dataset not loaded"}

        input_text   = resume_text + " " + job_desc
        input_vec    = self.vectorizer.transform([input_text])
        similarities = cosine_similarity(input_vec, self.vectors).flatten()

        best_idx      = int(np.argmax(similarities))
        raw_score     = float(similarities[best_idx]) * 100
        best_row      = self.data.iloc[best_idx]

        raw_skills    = str(best_row.get(self._skill_col, ""))
        all_skills    = self._parse_skills(raw_skills)

        resume_lower  = clean_text(resume_text)

        matched  = [s for s in all_skills if clean_text(s) in resume_lower]
        missing  = [s for s in all_skills if clean_text(s) not in resume_lower]

        if not matched:
            for s in all_skills:
                for word in clean_text(s).split():
                    if len(word) > 3 and word in resume_lower:
                        matched.append(s)
                        break

        matched = list(dict.fromkeys(matched))[:12]
        missing = [s for s in missing if s not in matched][:12]

        ats_score = min(raw_score + random.uniform(5, 18), 98)
        rank      = max(round(100 - raw_score, 1), 0.1)
        role      = str(best_row.get(self._role_col, "Software Professional"))

        summary = (
            f"YOUR RESUME SHOWS A {round(raw_score, 2)}% MATCH FOR THE {role.upper()} ROLE. "
            f"{'YOU HAVE STRENGTHS IN ' + ', '.join(matched[:3]).upper() + '.' if matched else 'NO DIRECT SKILL MATCHES FOUND.'} "
            f"{'FOCUS ON IMPROVING ' + ', '.join(missing[:3]).upper() + '.' if missing else ''}"
        ).strip()

        return {
            "score":    round(raw_score, 2),
            "ats_score":round(ats_score,  2),
            "rank":     rank,
            "role":     role,
            "summary":  summary,
            "skills": {
                "match":   matched,
                "missing": missing
            },
            "traits": build_traits(matched, missing, raw_score),
            "pivots": suggest_pivots(role)
        }

def build_traits(matched: list, missing: list, base_score: float) -> list:
    traits = []
    for i, s in enumerate(matched[:8]):
        traits.append({"label": s[:10], "you": min(int(base_score) + random.randint(5, 20), 95), "req": 90})
    for i, s in enumerate(missing[:8]):
        traits.append({"label": s[:10], "you": random.randint(5, 25), "req": 90})
    return traits

def suggest_pivots(role: str) -> list[str]:
    ALL = ["DATA SCIENTIST", "SOFTWARE ENGINEER", "BUSINESS ANALYST",
           "DEVOPS ENGINEER", "CLOUD ARCHITECT", "ML ENGINEER",
           "FULL STACK DEVELOPER", "DATA ENGINEER"]
    upper = role.upper()
    return [p for p in ALL if p != upper][:5]

df_global = load_dataset()
engine = MatchingEngine(df_global)

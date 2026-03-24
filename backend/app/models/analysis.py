from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SectionScore(BaseModel):
    label: str
    score: float

class AnalysisResult(BaseModel):
    user_id: str
    name: Optional[str] = "Unknown"
    email: str
    job_role: str
    match_score: float
    grade: str
    sections: List[SectionScore]
    created_at: datetime = Field(default_factory=datetime.utcnow)

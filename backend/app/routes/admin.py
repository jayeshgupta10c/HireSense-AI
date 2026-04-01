from fastapi import APIRouter, HTTPException, Depends
from app.db import mongodb
from typing import List, Optional
from bson import ObjectId
from pydantic import BaseModel

from app.core.dependencies import get_admin_user
from app.services.ml import engine

router = APIRouter(prefix="/admin", tags=["admin"])

class CompareRequest(BaseModel):
    resume_ids: List[str]
    job_description: str

@router.get("/users")
async def get_all_users(admin: dict = Depends(get_admin_user)):
    """Fetch all registered users for admin dashboard."""
    users = []
    async for user in mongodb.db.users.find({}, {"hashed_password": 0}).sort("created_at", -1):
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

@router.get("/resumes")
async def get_all_resumes(admin: dict = Depends(get_admin_user)):
    """Fetch all resume analyses across all users."""
    resumes = []
    async for doc in mongodb.db.analysis_results.find().sort("created_at", -1):
        doc["_id"] = str(doc["_id"])
        resumes.append(doc)
    return resumes

@router.post("/compare-resumes")
async def compare_resumes(req: CompareRequest, admin: dict = Depends(get_admin_user)):
    """Multi-resume ML vector comparison against a new target Job Description."""
    candidates = []
    
    for rid in req.resume_ids:
        try:
            res_doc = await mongodb.db.analysis_results.find_one({"_id": ObjectId(rid)})
        except:
             continue # Invalid ObjectId handling
            
        if res_doc and "resume_text" in res_doc:
            text = res_doc["resume_text"]
            
            # Recalculate match score dynamically against the new job description
            ml_result = engine.match(text, req.job_description)
            
            if "error" not in ml_result:
                candidates.append({
                    "id": str(res_doc["_id"]),
                    "analysis_id": res_doc.get("analysis_id"),
                    "name": res_doc.get("name", "Unknown Candidate"),
                    "email": res_doc.get("email", "N/A"),
                    "filename": res_doc.get("filename", "Unknown.pdf"),
                    "score": ml_result.get("score", 0),
                    "ats_score": ml_result.get("ats_score", 0),
                    "matched_skills": ml_result.get("skills", {}).get("match", []),
                    "missing_skills": ml_result.get("skills", {}).get("missing", [])
                })
    
    if not candidates:
        raise HTTPException(status_code=404, detail="No valid resumes found, or PDFs lacked extractable text.")
    
    # Sort highest score first
    candidates.sort(key=lambda x: x["score"], reverse=True)
    winner = candidates[0]
    
    return {
        "target_job": req.job_description,
        "winner": winner,
        "all_candidates": candidates
    }

@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, admin: dict = Depends(get_admin_user)):
    """Permanently delete a resume analysis record from the database."""
    try:
        oid = ObjectId(resume_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid Resume Registry ID.")
        
    result = await mongodb.db.analysis_results.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Artifact not found in registry.")
        
    return {"status": "SUCCESS", "message": f"Artifact {resume_id} has been purged."}

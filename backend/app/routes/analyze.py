from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Header
from typing import Optional
import random
from datetime import datetime
from jose import jwt, JWTError

from app.db import mongodb
from app.services.ml import engine, extract_text_from_pdf
from app.core.dependencies import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.post("")
async def analyze_full(
    file: UploadFile = File(...),
    job_description: str = Form("Data Scientist"),
    authorization: Optional[str] = Header(None)
):
    # 1. Validate File Type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        # 2. Extract Text with Fallback
        resume_text = extract_text_from_pdf(contents)
        if not resume_text or len(resume_text) < 20:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract enough text from the PDF. Please ensure it is not an image-only PDF or encrypted."
            )

        # 3. Match using Engine
        result = engine.match(resume_text, job_description)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis Failure: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    # Result mapping
    result["id"] = "anlyz_" + str(random.randint(1000, 9999))
    result["filename"] = file.filename
    result["job_description"] = job_description
    
    # Identify user if token present
    user_email = "guest@hiresense.ai"
    user_role = "guest"
    user_name = "Guest User"
    
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload.get("sub", user_email)
            user_role = payload.get("role", user_role)
            user_name = payload.get("sub", user_name)  # Email fallback
        except JWTError:
            pass
            
    # Archive entire analysis run context into MongoDB (Critical for admin views)
    record = {
        "analysis_id": result["id"],
        "email": user_email,
        "name": user_name,
        "role": user_role,
        "filename": file.filename,
        "job_description": job_description,
        "resume_text": resume_text,
        "match_score": result.get("score"),
        "ats_score": result.get("ats_score"),
        "skills": result.get("skills"),
        "result_data": result,
        "created_at": datetime.utcnow()
    }
    
    await mongodb.db.analysis_results.insert_one(record)
    return result

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors

router = APIRouter(prefix="/generate-resume", tags=["resume"])

class ResumeRequest(BaseModel):
    name: str
    email: str
    phone: str

def build_pdf(data: ResumeRequest) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = [Paragraph(data.name.upper(), styles["Heading1"]), Spacer(1, 6)]
    doc.build(story)
    return buffer.getvalue()

@router.post("")
async def generate_resume_endpoint(data: ResumeRequest):
    pdf_bytes = build_pdf(data)
    return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf")

"""
AI Copilot Router: ATS Resume Matcher, Interactive Mock Interviewer & Salary Intelligence
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import (
    ResumeAnalysisRequest, ResumeAnalysisResponse,
    MockInterviewStartRequest, MockInterviewStartResponse,
    MockInterviewAnswerRequest, MockInterviewAnswerFeedback,
    CoverLetterGenerateRequest, CoverLetterResponse,
    SalaryBenchmarkRequest, SalaryBenchmarkResponse
)
from app.services.ai_engine import (
    analyze_resume_fit, start_mock_interview, evaluate_mock_answer,
    generate_cover_letter, get_salary_benchmark
)
from app.models.models import Job

router = APIRouter(prefix="/ai", tags=["AI Copilot"])


@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume(req: ResumeAnalysisRequest, db: Session = Depends(get_db)):
    """Analyze candidate resume text against job requirements and generate ATS score + breakdown"""
    if not req.resume_text or len(req.resume_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Please provide a valid resume text (at least 20 characters)")

    return analyze_resume_fit(
        resume_text=req.resume_text,
        job_description=req.job_description or "",
        target_role=req.target_role or ""
    )


@router.post("/mock-interview/start", response_model=MockInterviewStartResponse)
def init_mock_interview(req: MockInterviewStartRequest, db: Session = Depends(get_db)):
    """Start an interactive AI Mock Interview session tailored to the specific role and company"""
    job_title = req.job_title
    company_name = req.company_name

    if req.job_id:
        job = db.query(Job).filter(Job.id == req.job_id).first()
        if job:
            job_title = job.title
            company_name = job.company

    return start_mock_interview(
        job_title=job_title,
        company_name=company_name or "Tech Innovator",
        seniority=req.seniority
    )


@router.post("/mock-interview/submit-answer", response_model=MockInterviewAnswerFeedback)
def submit_mock_interview_answer(req: MockInterviewAnswerRequest):
    """Evaluate candidate answer in real-time with STAR analysis, score, and constructive feedback"""
    if not req.user_answer or len(req.user_answer.strip()) < 10:
        raise HTTPException(status_code=400, detail="Answer is too short. Please provide a more detailed answer.")

    return evaluate_mock_answer(
        question=req.question,
        category=req.category,
        user_answer=req.user_answer
    )


@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
def create_cover_letter(req: CoverLetterGenerateRequest):
    """Generate tailored cover letter and cold outreach DM for recruiters"""
    return generate_cover_letter(
        job_title=req.job_title,
        company_name=req.company_name,
        job_description=req.job_description,
        candidate_skills=req.candidate_skills,
        candidate_experience=req.candidate_experience,
        tone=req.tone
    )


@router.post("/salary-benchmark", response_model=SalaryBenchmarkResponse)
def get_salary_insights(req: SalaryBenchmarkRequest):
    """Calculate market salary distributions (p25, median, p75, p90) and negotiation counter scripts"""
    return get_salary_benchmark(
        role_title=req.role_title,
        experience_years=req.experience_years,
        location=req.location,
        tech_stack=req.tech_stack
    )

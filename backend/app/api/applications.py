"""
Applications Router: Kanban Pipeline, Application Tracking & Recruiter Review
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.models import Application, Job, User
from app.schemas.schemas import ApplicationResponse, ApplicationCreate, ApplicationStatusUpdate
from app.api.deps import get_current_user
from app.api.jobs import parse_job_model
from app.api.auth import format_user_response

router = APIRouter(prefix="/applications", tags=["Applications"])


def format_application_response(app: Application, db: Session) -> ApplicationResponse:
    """Format Application model with linked Job and User responses"""
    job_model = db.query(Job).filter(Job.id == app.job_id).first()
    user_model = db.query(User).filter(User.id == app.user_id).first()

    return ApplicationResponse(
        id=app.id,
        job_id=app.job_id,
        user_id=app.user_id,
        status=app.status,
        match_score=app.match_score,
        resume_text=app.resume_text or "",
        cover_letter=app.cover_letter or "",
        candidate_notes=app.candidate_notes or "",
        interview_date=app.interview_date,
        salary_offered=app.salary_offered or 0,
        recruiter_feedback=app.recruiter_feedback or "",
        applied_at=app.applied_at,
        updated_at=app.updated_at,
        job=parse_job_model(job_model) if job_model else None,
        user=format_user_response(user_model) if user_model else None
    )


@router.get("/my-pipeline", response_model=List[ApplicationResponse])
def get_my_pipeline(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve all job applications in the user's personal Kanban pipeline"""
    apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(desc(Application.updated_at)).all()
    return [format_application_response(a, db) for a in apps]


@router.post("/apply", response_model=ApplicationResponse)
def apply_to_job(app_in: ApplicationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Submit an application to a job"""
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(Application).filter(Application.job_id == app_in.job_id, Application.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied or saved this job in your tracker")

    # Increment job application count
    job.applications_count += 1

    # Calculate match score
    match_score = 85
    if current_user.resume_text or app_in.resume_text:
        match_score = 90

    new_app = Application(
        job_id=app_in.job_id,
        user_id=current_user.id,
        status="applied",
        match_score=match_score,
        resume_text=app_in.resume_text or current_user.resume_text or "",
        cover_letter=app_in.cover_letter or "",
        candidate_notes=app_in.candidate_notes or "",
        applied_at=datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return format_application_response(new_app, db)


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update pipeline column status, notes, interview date, or recruiter feedback"""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Ensure applicant or recruiter owns it
    job = db.query(Job).filter(Job.id == app.job_id).first()
    if app.user_id != current_user.id and (not job or job.recruiter_id != current_user.id):
        raise HTTPException(status_code=403, detail="Permission denied")

    app.status = status_update.status
    if status_update.candidate_notes is not None:
        app.candidate_notes = status_update.candidate_notes
    if status_update.interview_date is not None:
        app.interview_date = status_update.interview_date
    if status_update.salary_offered is not None:
        app.salary_offered = status_update.salary_offered
    if status_update.recruiter_feedback is not None:
        app.recruiter_feedback = status_update.recruiter_feedback

    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)

    return format_application_response(app, db)


@router.get("/job/{job_id}/applicants", response_model=List[ApplicationResponse])
def get_job_applicants(job_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Recruiter portal: View all applicants for a posted job, ranked by AI match score"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    apps = db.query(Application).filter(Application.job_id == job_id).order_by(desc(Application.match_score)).all()
    return [format_application_response(a, db) for a in apps]

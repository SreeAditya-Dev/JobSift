"""
Jobs API Router: Search, Filtering, Job Details, AI Match Calculation, Recruiter Posting
"""
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.core.database import get_db
from app.models.models import Job, User, SavedJob, CommunityPost, ReferralListing
from app.schemas.schemas import JobResponse, JobCreate, PostResponse, ReferralListingResponse
from app.api.deps import get_current_user, get_optional_current_user, require_recruiter
from app.services.ai_engine import extract_skills_from_text

router = APIRouter(prefix="/jobs", tags=["Jobs"])


def parse_job_model(job: Job, current_user: Optional[User] = None, is_saved: bool = False) -> JobResponse:
    """Parse JSON text columns in Job to Python lists for JobResponse"""
    reqs = json.loads(job.requirements) if job.requirements else []
    resps = json.loads(job.responsibilities) if job.responsibilities else []
    bens = json.loads(job.benefits) if job.benefits else []
    tech = json.loads(job.tech_stack) if job.tech_stack else []

    # Calculate real-time AI Match Score if user is logged in
    match_score = None
    if current_user and current_user.skills:
        user_skills = json.loads(current_user.skills) if current_user.skills else []
        if user_skills and tech:
            user_s_lower = {s.lower() for s in user_skills}
            tech_s_lower = {t.lower() for t in tech}
            overlap = len(user_s_lower.intersection(tech_s_lower))
            match_score = min(99, max(45, int((overlap / max(len(tech), 1)) * 50) + 48))

    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        company_logo=job.company_logo or "",
        location=job.location,
        workplace_type=job.workplace_type,
        employment_type=job.employment_type,
        experience_level=job.experience_level,
        department=job.department,
        salary_min=job.salary_min,
        salary_max=job.salary_max,
        salary_currency=job.salary_currency,
        description=job.description,
        requirements=reqs,
        responsibilities=resps,
        benefits=bens,
        tech_stack=tech,
        recruiter_id=job.recruiter_id,
        views_count=job.views_count,
        applications_count=job.applications_count,
        is_active=job.is_active,
        is_featured=job.is_featured,
        created_at=job.created_at,
        is_saved=is_saved,
        ai_match_score=match_score
    )


@router.get("", response_model=List[JobResponse])
def get_jobs(
    q: Optional[str] = Query(None, description="Search keyword in title, company, description, or tech stack"),
    location: Optional[str] = None,
    workplace_type: Optional[str] = None,  # Remote, Hybrid, Onsite
    experience_level: Optional[str] = None,  # Entry-level, Mid-level, Senior, Staff
    department: Optional[str] = None,
    min_salary: Optional[int] = None,
    sort_by: Optional[str] = "recent",  # recent, salary, popular
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Search and filter job opportunities"""
    query = db.query(Job).filter(Job.is_active == True)

    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Job.title.ilike(search_pattern),
                Job.company.ilike(search_pattern),
                Job.description.ilike(search_pattern),
                Job.tech_stack.ilike(search_pattern),
                Job.department.ilike(search_pattern)
            )
        )

    if location and location != "All":
        query = query.filter(Job.location.ilike(f"%{location}%"))

    if workplace_type and workplace_type != "All":
        query = query.filter(Job.workplace_type == workplace_type)

    if experience_level and experience_level != "All":
        query = query.filter(Job.experience_level == experience_level)

    if department and department != "All":
        query = query.filter(Job.department.ilike(f"%{department}%"))

    if min_salary:
        query = query.filter(Job.salary_max >= min_salary)

    if sort_by == "salary":
        query = query.order_by(desc(Job.salary_max))
    elif sort_by == "popular":
        query = query.order_by(desc(Job.views_count), desc(Job.applications_count))
    else:
        query = query.order_by(desc(Job.is_featured), desc(Job.created_at))

    jobs = query.all()

    # Check saved status
    saved_job_ids = set()
    if current_user:
        saved = db.query(SavedJob.job_id).filter(SavedJob.user_id == current_user.id).all()
        saved_job_ids = {s[0] for s in saved}

    return [parse_job_model(j, current_user, j.id in saved_job_ids) for j in jobs]


@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieve full job details by ID and increment view count"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.views_count += 1
    db.commit()

    is_saved = False
    if current_user:
        is_saved = db.query(SavedJob).filter(SavedJob.user_id == current_user.id, SavedJob.job_id == job_id).first() is not None

    return parse_job_model(job, current_user, is_saved)


@router.get("/{job_id}/insider-intelligence")
def get_job_insider_intelligence(job_id: int, db: Session = Depends(get_db)):
    """
    Unified Job Canvas: Returns linked company discussions, debriefs, and available referrers
    specifically connected to this job and its company.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 1. Fetch community posts mentioning this company or linked directly
    posts = db.query(CommunityPost).filter(
        or_(
            CommunityPost.linked_job_id == job.id,
            CommunityPost.linked_company.ilike(f"%{job.company}%"),
            CommunityPost.content.ilike(f"%{job.company}%")
        )
    ).order_by(desc(CommunityPost.upvotes)).limit(5).all()

    formatted_posts = []
    for p in posts:
        author = db.query(User).filter(User.id == p.author_id).first()
        formatted_posts.append({
            "id": p.id,
            "title": p.title,
            "channel": p.channel,
            "content": p.content[:240] + "..." if len(p.content) > 240 else p.content,
            "upvotes": p.upvotes,
            "author_name": "Anonymous Insider" if p.is_anonymous else (author.full_name if author else "Member"),
            "author_headline": "" if p.is_anonymous else (author.headline if author else ""),
            "author_avatar": "" if p.is_anonymous else (author.avatar_url if author else ""),
            "created_at": p.created_at
        })

    # 2. Fetch available verified referrers at this company
    referrers = db.query(ReferralListing).filter(
        ReferralListing.company.ilike(f"%{job.company}%"),
        ReferralListing.is_active == True
    ).all()

    formatted_referrers = []
    for r in referrers:
        emp = db.query(User).filter(User.id == r.employee_id).first()
        formatted_referrers.append({
            "id": r.id,
            "employee_id": r.employee_id,
            "company": r.company,
            "role_category": r.role_category,
            "description": r.description,
            "requirements_summary": r.requirements_summary,
            "employee_name": emp.full_name if emp else "Verified Employee",
            "employee_avatar": emp.avatar_url if emp else "",
            "employee_headline": emp.headline if emp else "",
            "successful_referrals": r.successful_referrals
        })

    return {
        "job_id": job.id,
        "company": job.company,
        "insider_discussions": formatted_posts,
        "available_referrers": formatted_referrers,
        "culture_snapshot": {
            "overall_rating": 4.8 if "Stripe" in job.company or "Google" in job.company else 4.6,
            "work_life_balance": 4.5,
            "engineering_craft": 4.9,
            "compensation_rating": 4.8,
            "interview_difficulty": "Challenging (Strong System Design & Practical Craft focus)"
        }
    }


@router.post("", response_model=JobResponse)
def create_job(job_in: JobCreate, current_user: User = Depends(require_recruiter), db: Session = Depends(get_db)):
    """Post a new job opening (RBAC: Recruiter only)"""
    new_job = Job(
        title=job_in.title,
        company=job_in.company or current_user.company or "Tech Company",
        company_logo=job_in.company_logo or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        location=job_in.location,
        workplace_type=job_in.workplace_type,
        employment_type=job_in.employment_type,
        experience_level=job_in.experience_level,
        department=job_in.department,
        salary_min=job_in.salary_min,
        salary_max=job_in.salary_max,
        salary_currency=job_in.salary_currency,
        description=job_in.description,
        requirements=json.dumps(job_in.requirements or []),
        responsibilities=json.dumps(job_in.responsibilities or []),
        benefits=json.dumps(job_in.benefits or []),
        tech_stack=json.dumps(job_in.tech_stack or extract_skills_from_text(job_in.description)),
        recruiter_id=current_user.id,
        is_featured=job_in.is_featured or False,
        is_active=True
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return parse_job_model(new_job, current_user, False)


@router.post("/{job_id}/save")
def toggle_save_job(job_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Bookmark or unbookmark a job"""
    existing = db.query(SavedJob).filter(SavedJob.user_id == current_user.id, SavedJob.job_id == job_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Job removed from bookmarks"}
    else:
        saved = SavedJob(user_id=current_user.id, job_id=job_id)
        db.add(saved)
        db.commit()
        return {"saved": True, "message": "Job bookmarked successfully"}

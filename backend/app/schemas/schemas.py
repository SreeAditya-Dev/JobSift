"""
Pydantic Schemas for JobSift API Request/Response Validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "candidate"  # 'candidate', 'recruiter', 'employee'
    avatar_url: Optional[str] = ""
    headline: Optional[str] = ""
    bio: Optional[str] = ""
    location: Optional[str] = ""
    target_role: Optional[str] = ""
    years_of_experience: Optional[float] = 0.0
    skills: Optional[List[str]] = []
    company: Optional[str] = ""
    is_verified_employee: Optional[bool] = False
    portfolio_url: Optional[str] = ""
    github_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    target_role: Optional[str] = None
    years_of_experience: Optional[float] = None
    skills: Optional[List[str]] = None
    resume_text: Optional[str] = None
    portfolio_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    company: Optional[str] = None


class UserResponse(UserBase):
    id: int
    karma_points: int
    resume_text: Optional[str] = ""
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Job Schemas
class JobBase(BaseModel):
    title: str
    company: str
    company_logo: Optional[str] = ""
    location: str
    workplace_type: str = "Remote"  # Remote, Hybrid, Onsite
    employment_type: str = "Full-time"  # Full-time, Contract, Internship
    experience_level: str = "Mid-level"  # Entry-level, Mid-level, Senior, Lead, Staff
    department: str = "Engineering"
    salary_min: int = 0
    salary_max: int = 0
    salary_currency: str = "USD"
    description: str
    requirements: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []
    benefits: Optional[List[str]] = []
    tech_stack: Optional[List[str]] = []
    is_featured: Optional[bool] = False


class JobCreate(JobBase):
    pass


class JobResponse(JobBase):
    id: int
    recruiter_id: Optional[int] = None
    views_count: int
    applications_count: int
    is_active: bool
    created_at: datetime
    is_saved: Optional[bool] = False
    ai_match_score: Optional[int] = None

    class Config:
        from_attributes = True


# Application Schemas
class ApplicationCreate(BaseModel):
    job_id: int
    resume_text: Optional[str] = ""
    cover_letter: Optional[str] = ""
    candidate_notes: Optional[str] = ""


class ApplicationStatusUpdate(BaseModel):
    status: str  # 'bookmarked', 'applied', 'screening', 'interview', 'offer', 'rejected'
    candidate_notes: Optional[str] = None
    interview_date: Optional[datetime] = None
    salary_offered: Optional[int] = None
    recruiter_feedback: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    status: str
    match_score: int
    resume_text: Optional[str] = ""
    cover_letter: Optional[str] = ""
    candidate_notes: Optional[str] = ""
    interview_date: Optional[datetime] = None
    salary_offered: int = 0
    recruiter_feedback: Optional[str] = ""
    applied_at: datetime
    updated_at: datetime
    job: Optional[JobResponse] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Community Schemas
class PostCreate(BaseModel):
    channel: str = "general"
    title: str
    content: str
    tags: Optional[List[str]] = []
    is_anonymous: bool = False
    linked_company: Optional[str] = ""
    linked_job_id: Optional[int] = None


class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None
    is_anonymous: bool = False


class CommentResponse(BaseModel):
    id: int
    post_id: int
    author_id: int
    parent_id: Optional[int] = None
    content: str
    upvotes: int
    is_anonymous: bool
    created_at: datetime
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    author_headline: Optional[str] = None
    author_company: Optional[str] = None
    replies: Optional[List["CommentResponse"]] = []

    class Config:
        from_attributes = True


class PostResponse(BaseModel):
    id: int
    author_id: int
    channel: str
    title: str
    content: str
    tags: List[str] = []
    is_anonymous: bool
    upvotes: int
    downvotes: int
    views_count: int
    linked_company: Optional[str] = ""
    linked_job_id: Optional[int] = None
    is_solved: bool
    created_at: datetime
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    author_headline: Optional[str] = None
    author_company: Optional[str] = None
    comments_count: int = 0
    has_upvoted: Optional[bool] = False

    class Config:
        from_attributes = True


# Referral Schemas
class ReferralListingCreate(BaseModel):
    company: str
    company_logo: Optional[str] = ""
    role_category: str = "Engineering"
    description: str
    requirements_summary: Optional[str] = ""
    max_referrals_per_month: int = 5


class ReferralListingResponse(BaseModel):
    id: int
    employee_id: int
    company: str
    company_logo: Optional[str] = ""
    role_category: str
    description: str
    requirements_summary: Optional[str] = ""
    max_referrals_per_month: int
    successful_referrals: int
    is_active: bool
    created_at: datetime
    employee_name: Optional[str] = None
    employee_avatar: Optional[str] = None
    employee_headline: Optional[str] = None

    class Config:
        from_attributes = True


class ReferralRequestCreate(BaseModel):
    listing_id: int
    target_job_url: Optional[str] = ""
    target_role_title: str
    pitch: str
    portfolio_url: Optional[str] = ""
    resume_snippet: Optional[str] = ""


class ReferralRequestResponse(BaseModel):
    id: int
    listing_id: int
    candidate_id: int
    target_job_url: Optional[str] = ""
    target_role_title: str
    pitch: str
    portfolio_url: Optional[str] = ""
    resume_snippet: Optional[str] = ""
    match_score: int
    status: str
    reviewer_note: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    listing: Optional[ReferralListingResponse] = None
    candidate: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# AI Copilot Schemas
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""
    target_role: Optional[str] = ""


class SkillMatchItem(BaseModel):
    skill: str
    status: str  # 'matched', 'missing', 'partial'
    importance: str  # 'critical', 'recommended', 'bonus'


class ResumeAnalysisResponse(BaseModel):
    overall_score: int
    ats_compatibility_score: int
    skills_match_score: int
    experience_impact_score: int
    brevity_formatting_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    skill_breakdown: List[SkillMatchItem]
    strengths: List[str]
    areas_for_improvement: List[str]
    tailored_bullet_suggestions: List[dict]
    recommended_keywords: List[str]
    summary_verdict: str


class MockInterviewStartRequest(BaseModel):
    job_id: Optional[int] = None
    job_title: str
    company_name: Optional[str] = ""
    seniority: str = "Mid-level"
    focus_area: str = "General (Behavioral + System Design + Technical)"


class InterviewQuestion(BaseModel):
    id: int
    category: str  # Behavioral, Technical, Architecture, Problem Solving
    question: str
    context: str
    rubric_hints: List[str]


class MockInterviewStartResponse(BaseModel):
    session_id: str
    job_title: str
    company_name: str
    total_questions: int
    questions: List[InterviewQuestion]


class MockInterviewAnswerRequest(BaseModel):
    session_id: str
    question_id: int
    question: str
    category: str
    user_answer: str


class MockInterviewAnswerFeedback(BaseModel):
    score: int  # 0-100
    star_method_analysis: dict  # {situation, task, action, result} feedback
    strengths: List[str]
    critiques: List[str]
    ideal_sample_response: str
    key_takeaways: str


class CoverLetterGenerateRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: str
    candidate_skills: List[str]
    candidate_experience: str
    tone: str = "Confident & Enthusiastic"


class CoverLetterResponse(BaseModel):
    cover_letter: str
    key_selling_points: List[str]
    cold_outreach_dm: str


class SalaryBenchmarkRequest(BaseModel):
    role_title: str
    experience_years: float
    location: str
    tech_stack: List[str] = []


class SalaryBenchmarkResponse(BaseModel):
    role_title: str
    location: str
    p25_salary: int
    median_salary: int
    p75_salary: int
    p90_salary: int
    currency: str = "USD"
    equity_range_percent: str
    top_paying_skills: List[str]
    negotiation_leverage_tips: List[str]
    counter_offer_script: str

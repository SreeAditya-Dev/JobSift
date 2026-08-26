"""
SQLAlchemy Data Models for CareerBrew
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="candidate")  # 'candidate', 'recruiter', 'employee'
    avatar_url = Column(String(512), default="")
    headline = Column(String(255), default="")
    bio = Column(Text, default="")
    location = Column(String(255), default="")
    target_role = Column(String(255), default="")
    years_of_experience = Column(Float, default=0.0)
    skills = Column(Text, default="[]")  # JSON string of skills array: ["React", "TypeScript", ...]
    education = Column(Text, default="[]")  # JSON array
    experience_history = Column(Text, default="[]")  # JSON array
    resume_text = Column(Text, default="")
    portfolio_url = Column(String(512), default="")
    github_url = Column(String(512), default="")
    linkedin_url = Column(String(512), default="")
    karma_points = Column(Integer, default=100)
    company = Column(String(255), default="")  # For verified employees & recruiters
    is_verified_employee = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    jobs_posted = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    community_posts = relationship("CommunityPost", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("PostComment", back_populates="author", cascade="all, delete-orphan")
    referrals_offered = relationship("ReferralListing", back_populates="employee", cascade="all, delete-orphan")
    referral_requests = relationship("ReferralRequest", back_populates="candidate", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    company = Column(String(255), index=True, nullable=False)
    company_logo = Column(String(512), default="")
    location = Column(String(255), nullable=False)
    workplace_type = Column(String(50), default="Remote")  # 'Remote', 'Hybrid', 'Onsite'
    employment_type = Column(String(50), default="Full-time")  # 'Full-time', 'Contract', 'Internship'
    experience_level = Column(String(50), default="Mid-level")  # 'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Staff'
    department = Column(String(100), default="Engineering")
    salary_min = Column(Integer, default=0)
    salary_max = Column(Integer, default=0)
    salary_currency = Column(String(10), default="USD")
    description = Column(Text, nullable=False)
    requirements = Column(Text, default="[]")  # JSON array
    responsibilities = Column(Text, default="[]")  # JSON array
    benefits = Column(Text, default="[]")  # JSON array
    tech_stack = Column(Text, default="[]")  # JSON array: ["React", "Go", "Kubernetes"]
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    recruiter = relationship("User", back_populates="jobs_posted")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="applied")  # 'bookmarked', 'applied', 'screening', 'interview', 'offer', 'rejected'
    match_score = Column(Integer, default=75)  # AI Match Score 0-100%
    resume_text = Column(Text, default="")
    cover_letter = Column(Text, default="")
    candidate_notes = Column(Text, default="")
    interview_date = Column(DateTime, nullable=True)
    salary_offered = Column(Integer, default=0)
    recruiter_feedback = Column(Text, default="")
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="applications")
    user = relationship("User", back_populates="applications")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="saved_by")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    channel = Column(String(50), default="general", index=True)  # 'general', 'interview-prep', 'salary-talk', 'referrals', 'resume-review', 'company-culture'
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(Text, default="[]")  # JSON array
    is_anonymous = Column(Boolean, default=False)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    linked_company = Column(String(255), default="", index=True)
    linked_job_id = Column(Integer, nullable=True)
    is_solved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User", back_populates="community_posts")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")


class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("post_comments.id"), nullable=True)
    content = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("CommunityPost", back_populates="comments")
    author = relationship("User", back_populates="comments")
    replies = relationship("PostComment", backref="parent", remote_side=[id], cascade="all, delete-orphan")


class ReferralListing(Base):
    __tablename__ = "referral_listings"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String(255), nullable=False, index=True)
    company_logo = Column(String(512), default="")
    role_category = Column(String(100), default="Engineering")  # 'Engineering', 'Product', 'Design', 'Sales'
    description = Column(Text, nullable=False)
    requirements_summary = Column(Text, default="")
    max_referrals_per_month = Column(Integer, default=5)
    successful_referrals = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("User", back_populates="referrals_offered")
    requests = relationship("ReferralRequest", back_populates="listing", cascade="all, delete-orphan")


class ReferralRequest(Base):
    __tablename__ = "referral_requests"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("referral_listings.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_job_url = Column(String(512), default="")
    target_role_title = Column(String(255), default="")
    pitch = Column(Text, nullable=False)
    portfolio_url = Column(String(512), default="")
    resume_snippet = Column(Text, default="")
    match_score = Column(Integer, default=80)
    status = Column(String(50), default="pending")  # 'pending', 'accepted', 'submitted', 'declined'
    reviewer_note = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    listing = relationship("ReferralListing", back_populates="requests")
    candidate = relationship("User", back_populates="referral_requests")


class SalaryReport(Base):
    __tablename__ = "salary_reports"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(255), index=True, nullable=False)
    title = Column(String(255), index=True, nullable=False)
    level = Column(String(100), default="L4 / Mid-Level")
    base_salary = Column(Integer, nullable=False)
    bonus = Column(Integer, default=0)
    equity = Column(Integer, default=0)
    total_comp = Column(Integer, nullable=False)
    location = Column(String(255), default="San Francisco, CA")
    years_of_experience = Column(Float, default=3.0)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

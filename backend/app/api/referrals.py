"""
Referrals API Router: Verified Referral Exchange & Request Pipeline
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.models import ReferralListing, ReferralRequest, User
from app.schemas.schemas import (
    ReferralListingResponse, ReferralListingCreate,
    ReferralRequestResponse, ReferralRequestCreate
)
from app.api.deps import get_current_user
from app.api.auth import format_user_response

router = APIRouter(prefix="/referrals", tags=["Referrals"])


def format_listing_response(listing: ReferralListing, db: Session) -> ReferralListingResponse:
    """Format ReferralListing with employee details"""
    emp = db.query(User).filter(User.id == listing.employee_id).first()
    return ReferralListingResponse(
        id=listing.id,
        employee_id=listing.employee_id,
        company=listing.company,
        company_logo=listing.company_logo or "",
        role_category=listing.role_category,
        description=listing.description,
        requirements_summary=listing.requirements_summary or "",
        max_referrals_per_month=listing.max_referrals_per_month,
        successful_referrals=listing.successful_referrals,
        is_active=listing.is_active,
        created_at=listing.created_at,
        employee_name=emp.full_name if emp else "Verified Employee",
        employee_avatar=emp.avatar_url if emp else "",
        employee_headline=emp.headline if emp else ""
    )


def format_request_response(req: ReferralRequest, db: Session) -> ReferralRequestResponse:
    """Format ReferralRequest with linked Listing and Candidate responses"""
    listing = db.query(ReferralListing).filter(ReferralListing.id == req.listing_id).first()
    candidate = db.query(User).filter(User.id == req.candidate_id).first()

    return ReferralRequestResponse(
        id=req.id,
        listing_id=req.listing_id,
        candidate_id=req.candidate_id,
        target_job_url=req.target_job_url or "",
        target_role_title=req.target_role_title,
        pitch=req.pitch,
        portfolio_url=req.portfolio_url or "",
        resume_snippet=req.resume_snippet or "",
        match_score=req.match_score,
        status=req.status,
        reviewer_note=req.reviewer_note or "",
        created_at=req.created_at,
        updated_at=req.updated_at,
        listing=format_listing_response(listing, db) if listing else None,
        candidate=format_user_response(candidate) if candidate else None
    )


@router.get("/listings", response_model=List[ReferralListingResponse])
def get_referral_listings(
    company: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Browse active verified employee referral offers"""
    query = db.query(ReferralListing).filter(ReferralListing.is_active == True)
    if company:
        query = query.filter(ReferralListing.company.ilike(f"%{company}%"))
    if category and category != "All":
        query = query.filter(ReferralListing.role_category.ilike(f"%{category}%"))

    listings = query.order_by(desc(ReferralListing.successful_referrals)).all()
    return [format_listing_response(l, db) for l in listings]


@router.post("/listings", response_model=ReferralListingResponse)
def create_referral_listing(
    listing_in: ReferralListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Offer referrals at your company (for verified employees)"""
    new_listing = ReferralListing(
        employee_id=current_user.id,
        company=listing_in.company or current_user.company or "Tech Company",
        company_logo=listing_in.company_logo or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        role_category=listing_in.role_category,
        description=listing_in.description,
        requirements_summary=listing_in.requirements_summary or "",
        max_referrals_per_month=listing_in.max_referrals_per_month,
        is_active=True
    )
    db.add(new_listing)
    current_user.karma_points = (current_user.karma_points or 0) + 30
    db.commit()
    db.refresh(new_listing)

    return format_listing_response(new_listing, db)


@router.post("/requests", response_model=ReferralRequestResponse)
def request_referral(
    req_in: ReferralRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request a referral from a verified employee with your pitch & profile"""
    listing = db.query(ReferralListing).filter(ReferralListing.id == req_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Referral listing not found")

    new_req = ReferralRequest(
        listing_id=req_in.listing_id,
        candidate_id=current_user.id,
        target_job_url=req_in.target_job_url or "",
        target_role_title=req_in.target_role_title,
        pitch=req_in.pitch,
        portfolio_url=req_in.portfolio_url or current_user.portfolio_url or "",
        resume_snippet=req_in.resume_snippet or current_user.resume_text[:300] if current_user.resume_text else "",
        match_score=88,
        status="pending"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)

    return format_request_response(new_req, db)


@router.get("/my-requests", response_model=List[ReferralRequestResponse])
def get_my_referral_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve referral requests submitted by current candidate"""
    reqs = db.query(ReferralRequest).filter(ReferralRequest.candidate_id == current_user.id).order_by(desc(ReferralRequest.created_at)).all()
    return [format_request_response(r, db) for r in reqs]


@router.get("/incoming-requests", response_model=List[ReferralRequestResponse])
def get_incoming_referral_requests(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Employee portal: View candidate referral requests received for your listings"""
    my_listings = db.query(ReferralListing.id).filter(ReferralListing.employee_id == current_user.id).all()
    listing_ids = [l[0] for l in my_listings]

    reqs = db.query(ReferralRequest).filter(ReferralRequest.listing_id.in_(listing_ids)).order_by(desc(ReferralRequest.created_at)).all()
    return [format_request_response(r, db) for r in reqs]


@router.patch("/requests/{request_id}/review", response_model=ReferralRequestResponse)
def review_referral_request(
    request_id: int,
    status: str,  # 'accepted', 'submitted', 'declined'
    reviewer_note: Optional[str] = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Employee reviews referral request (Approve, Submit into internal portal, or Decline)"""
    req = db.query(ReferralRequest).filter(ReferralRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = status
    req.reviewer_note = reviewer_note or ""
    req.updated_at = datetime.utcnow()

    if status == "submitted":
        listing = db.query(ReferralListing).filter(ReferralListing.id == req.listing_id).first()
        if listing:
            listing.successful_referrals += 1
            current_user.karma_points = (current_user.karma_points or 0) + 50

    db.commit()
    db.refresh(req)
    return format_request_response(req, db)

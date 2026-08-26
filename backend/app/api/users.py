"""
Users & Profiles API Router
"""
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse, UserUpdate
from app.api.deps import get_current_user
from app.api.auth import format_user_response

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Get public profile of any user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return format_user_response(user)


@router.patch("/profile", response_model=UserResponse)
def update_profile(
    profile_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile details of currently logged-in user"""
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.role is not None:
        current_user.role = profile_in.role
    if profile_in.avatar_url is not None:
        current_user.avatar_url = profile_in.avatar_url
    if profile_in.headline is not None:
        current_user.headline = profile_in.headline
    if profile_in.bio is not None:
        current_user.bio = profile_in.bio
    if profile_in.location is not None:
        current_user.location = profile_in.location
    if profile_in.target_role is not None:
        current_user.target_role = profile_in.target_role
    if profile_in.years_of_experience is not None:
        current_user.years_of_experience = profile_in.years_of_experience
    if profile_in.skills is not None:
        current_user.skills = json.dumps(profile_in.skills)
    if profile_in.resume_text is not None:
        current_user.resume_text = profile_in.resume_text
    if profile_in.portfolio_url is not None:
        current_user.portfolio_url = profile_in.portfolio_url
    if profile_in.github_url is not None:
        current_user.github_url = profile_in.github_url
    if profile_in.linkedin_url is not None:
        current_user.linkedin_url = profile_in.linkedin_url
    if profile_in.company is not None:
        current_user.company = profile_in.company

    db.commit()
    db.refresh(current_user)
    return format_user_response(current_user)

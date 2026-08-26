"""
Authentication Router: Register, Login, Me, Demo Switcher
"""
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, Token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


def format_user_response(user: User) -> UserResponse:
    """Format User model into UserResponse with parsed JSON skills"""
    skills_list = []
    if user.skills:
        try:
            skills_list = json.loads(user.skills)
        except Exception:
            skills_list = [s.strip() for s in user.skills.split(",") if s.strip()]

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        avatar_url=user.avatar_url or "",
        headline=user.headline or "",
        bio=user.bio or "",
        location=user.location or "",
        target_role=user.target_role or "",
        years_of_experience=user.years_of_experience or 0.0,
        skills=skills_list,
        company=user.company or "",
        is_verified_employee=user.is_verified_employee or False,
        portfolio_url=user.portfolio_url or "",
        github_url=user.github_url or "",
        linkedin_url=user.linkedin_url or "",
        karma_points=user.karma_points or 100,
        resume_text=user.resume_text or "",
        created_at=user.created_at
    )


@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account"""
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    skills_json = json.dumps(user_in.skills or [])
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        avatar_url=user_in.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.full_name}",
        headline=user_in.headline or "",
        bio=user_in.bio or "",
        location=user_in.location or "",
        target_role=user_in.target_role or "",
        years_of_experience=user_in.years_of_experience or 0.0,
        skills=skills_json,
        company=user_in.company or "",
        is_verified_employee=bool(user_in.company and user_in.role in ["employee", "recruiter"]),
        portfolio_url=user_in.portfolio_url or "",
        github_url=user_in.github_url or "",
        linkedin_url=user_in.linkedin_url or "",
        resume_text=user_in.resume_text or "",
        karma_points=100
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id)
    return Token(access_token=token, token_type="bearer", user=format_user_response(new_user))


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Log in with email and password"""
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=format_user_response(user))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get profile of currently logged-in user"""
    return format_user_response(current_user)


@router.post("/switch-demo-persona", response_model=Token)
def switch_demo_persona(role: str, db: Session = Depends(get_db)):
    """1-Click persona switcher for evaluators and judges ('candidate', 'recruiter', 'employee')"""
    target_email = "alex.rivera@example.com"
    if role == "recruiter":
        target_email = "sarah.chen@stripe.com"
    elif role == "employee":
        target_email = "david.kim@google.com"

    user = db.query(User).filter(User.email == target_email).first()
    if not user:
        # Fallback to any user matching role
        user = db.query(User).filter(User.role == role).first()
        if not user:
            user = db.query(User).first()

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=format_user_response(user))

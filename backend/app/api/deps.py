"""
FastAPI Dependencies: Database sessions and Authentication handlers
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import User

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Retrieve and authenticate current logged-in user from Bearer JWT token"""
    if not credentials:
        # Default fallback to candidate persona (Alex Rivera) for seamless testing if no header is supplied
        user = db.query(User).filter(User.email == "alex.rivera@example.com").first()
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Retrieve current user if token present, else None without raising error"""
    if not credentials:
        return None
    payload = decode_token(credentials.credentials)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


# ==============================================================================
# Role-Based Access Control (RBAC) Dependency Injectors
# ==============================================================================
class RequireRole:
    """FastAPI dependency to enforce specific user role requirements on routes"""
    def __init__(self, *allowed_roles: str):
        self.allowed_roles = [r.lower() for r in allowed_roles]

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        user_role = (current_user.role or "").lower()
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: User role '{current_user.role}' is not authorized to access this resource. Allowed roles: {self.allowed_roles}",
            )
        return current_user


# Reusable RBAC role dependencies
require_candidate = RequireRole("candidate")
require_recruiter = RequireRole("recruiter")
require_employee = RequireRole("employee")
require_candidate_or_employee = RequireRole("candidate", "employee")
require_employee_or_recruiter = RequireRole("employee", "recruiter")
require_any_authenticated = RequireRole("candidate", "recruiter", "employee")


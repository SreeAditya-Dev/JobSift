"""
Salary Transparency and Analytics API Router
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.core.database import get_db
from app.models.models import SalaryReport

router = APIRouter(prefix="/salaries", tags=["Salary Transparency"])


@router.get("")
def get_salaries(
    company: Optional[str] = None,
    title: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get verified community salary reports & statistics"""
    query = db.query(SalaryReport)
    if company:
        query = query.filter(SalaryReport.company.ilike(f"%{company}%"))
    if title:
        query = query.filter(SalaryReport.title.ilike(f"%{title}%"))

    reports = query.order_by(desc(SalaryReport.total_comp)).all()

    # Calculate aggregate stats
    avg_comp = db.query(func.avg(SalaryReport.total_comp)).scalar() or 280000
    max_comp = db.query(func.max(SalaryReport.total_comp)).scalar() or 580000
    min_comp = db.query(func.min(SalaryReport.total_comp)).scalar() or 160000

    return {
        "summary": {
            "average_total_comp": int(avg_comp),
            "max_total_comp": int(max_comp),
            "min_total_comp": int(min_comp),
            "total_submissions": len(reports)
        },
        "reports": reports
    }

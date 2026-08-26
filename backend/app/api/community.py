"""
Community Hub API Router: Discussions, Channels, Threaded Comments & Upvotes
"""
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.core.database import get_db
from app.models.models import CommunityPost, PostComment, User
from app.schemas.schemas import PostResponse, PostCreate, CommentResponse, CommentCreate
from app.api.deps import get_current_user, get_optional_current_user

router = APIRouter(prefix="/community", tags=["Community"])


def format_comment_tree(comment: PostComment, db: Session) -> CommentResponse:
    """Format single comment and recursively format replies"""
    author = db.query(User).filter(User.id == comment.author_id).first()
    
    # Fetch direct replies
    replies_models = db.query(PostComment).filter(PostComment.parent_id == comment.id).order_by(PostComment.created_at).all()
    replies_formatted = [format_comment_tree(r, db) for r in replies_models]

    return CommentResponse(
        id=comment.id,
        post_id=comment.post_id,
        author_id=comment.author_id,
        parent_id=comment.parent_id,
        content=comment.content,
        upvotes=comment.upvotes,
        is_anonymous=comment.is_anonymous,
        created_at=comment.created_at,
        author_name="Anonymous Insider" if comment.is_anonymous else (author.full_name if author else "Member"),
        author_avatar="" if comment.is_anonymous else (author.avatar_url if author else ""),
        author_headline="" if comment.is_anonymous else (author.headline if author else ""),
        author_company="" if comment.is_anonymous else (author.company if author else ""),
        replies=replies_formatted
    )


def format_post_response(post: CommunityPost, db: Session) -> PostResponse:
    """Format CommunityPost into PostResponse"""
    author = db.query(User).filter(User.id == post.author_id).first()
    comments_count = db.query(PostComment).filter(PostComment.post_id == post.id).count()

    tags_list = []
    if post.tags:
        try:
            tags_list = json.loads(post.tags)
        except Exception:
            tags_list = [t.strip() for t in post.tags.split(",") if t.strip()]

    return PostResponse(
        id=post.id,
        author_id=post.author_id,
        channel=post.channel,
        title=post.title,
        content=post.content,
        tags=tags_list,
        is_anonymous=post.is_anonymous,
        upvotes=post.upvotes,
        downvotes=post.downvotes,
        views_count=post.views_count,
        linked_company=post.linked_company or "",
        linked_job_id=post.linked_job_id,
        is_solved=post.is_solved,
        created_at=post.created_at,
        author_name="Anonymous Insider" if post.is_anonymous else (author.full_name if author else "Member"),
        author_avatar="" if post.is_anonymous else (author.avatar_url if author else ""),
        author_headline="" if post.is_anonymous else (author.headline if author else ""),
        author_company="" if post.is_anonymous else (author.company if author else ""),
        comments_count=comments_count
    )


@router.get("/posts", response_model=List[PostResponse])
def get_posts(
    channel: Optional[str] = None,
    company: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "hot",  # hot, top, new
    db: Session = Depends(get_db)
):
    """Retrieve community feed posts with channel, company, and tag filters"""
    query = db.query(CommunityPost)

    if channel and channel != "all":
        query = query.filter(CommunityPost.channel == channel)

    if company and company != "all":
        query = query.filter(CommunityPost.linked_company.ilike(f"%{company}%"))

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                CommunityPost.title.ilike(pattern),
                CommunityPost.content.ilike(pattern),
                CommunityPost.tags.ilike(pattern),
                CommunityPost.linked_company.ilike(pattern)
            )
        )

    if sort_by == "top":
        query = query.order_by(desc(CommunityPost.upvotes))
    elif sort_by == "new":
        query = query.order_by(desc(CommunityPost.created_at))
    else:  # hot
        query = query.order_by(desc(CommunityPost.upvotes * 2 + CommunityPost.views_count))

    posts = query.all()
    return [format_post_response(p, db) for p in posts]


@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post_detail(post_id: int, db: Session = Depends(get_db)):
    """Retrieve single post details and increment views"""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.views_count += 1
    db.commit()
    return format_post_response(post, db)


@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
def get_post_comments(post_id: int, db: Session = Depends(get_db)):
    """Retrieve top-level comments and nested reply trees for a post"""
    top_comments = db.query(PostComment).filter(
        PostComment.post_id == post_id,
        PostComment.parent_id == None
    ).order_by(desc(PostComment.upvotes), PostComment.created_at).all()

    return [format_comment_tree(c, db) for c in top_comments]


@router.post("/posts", response_model=PostResponse)
def create_post(post_in: PostCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new community discussion thread"""
    new_post = CommunityPost(
        author_id=current_user.id,
        channel=post_in.channel,
        title=post_in.title,
        content=post_in.content,
        tags=json.dumps(post_in.tags or []),
        is_anonymous=post_in.is_anonymous,
        linked_company=post_in.linked_company or "",
        linked_job_id=post_in.linked_job_id,
        upvotes=1
    )
    db.add(new_post)
    # Give user karma points for contributing
    current_user.karma_points = (current_user.karma_points or 0) + 15
    db.commit()
    db.refresh(new_post)

    return format_post_response(new_post, db)


@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
def add_comment(
    post_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a comment or nested reply to a post"""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = PostComment(
        post_id=post_id,
        author_id=current_user.id,
        parent_id=comment_in.parent_id,
        content=comment_in.content,
        is_anonymous=comment_in.is_anonymous,
        upvotes=1
    )
    db.add(new_comment)
    current_user.karma_points = (current_user.karma_points or 0) + 5
    db.commit()
    db.refresh(new_comment)

    return format_comment_tree(new_comment, db)


@router.post("/posts/{post_id}/upvote")
def upvote_post(post_id: int, db: Session = Depends(get_db)):
    """Upvote a community post"""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.upvotes += 1
    db.commit()
    return {"id": post.id, "upvotes": post.upvotes}

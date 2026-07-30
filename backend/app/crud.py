from sqlalchemy.orm import Session

from app.models import Video, Comment


# -----------------------------
# VIDEO CRUD
# -----------------------------
def get_video_by_youtube_id(db: Session, youtube_video_id: str):
    return (
        db.query(Video)
        .filter(Video.youtube_video_id == youtube_video_id)
        .first()
    )


def create_video(
    db: Session,
    youtube_video_id: str,
    title: str,
    channel_name: str,
):
    existing_video = get_video_by_youtube_id(db, youtube_video_id)

    if existing_video:
        return existing_video

    video = Video(
        youtube_video_id=youtube_video_id,
        title=title,
        channel_name=channel_name,
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    return video


# -----------------------------
# COMMENT CRUD
# -----------------------------
def get_comment_by_comment_id(db: Session, comment_id: str):
    return (
        db.query(Comment)
        .filter(Comment.comment_id == comment_id)
        .first()
    )


def create_comment(
    db: Session,
    video_id: int,
    comment_id: str,
    author_name: str,
    comment_text: str,
    likes: int,
    published_at: str,
):
    existing_comment = get_comment_by_comment_id(db, comment_id)

    if existing_comment:
        return existing_comment

    comment = Comment(
        video_id=video_id,
        comment_id=comment_id,
        author_name=author_name,
        comment_text=comment_text,
        likes=likes,
        published_at=published_at,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment
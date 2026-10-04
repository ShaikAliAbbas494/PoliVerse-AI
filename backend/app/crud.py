from sqlalchemy.orm import Session
from app import models


# -----------------------------------------
# VIDEO CRUD
# -----------------------------------------

def get_video_by_youtube_id(
    db: Session,
    youtube_video_id: str
):
    return (
        db.query(models.Video)
        .filter(
            models.Video.youtube_video_id == youtube_video_id
        )
        .first()
    )


def create_video(
    db: Session,
    youtube_video_id: str,
    title: str,
    channel_name: str
):
    existing_video = get_video_by_youtube_id(
        db,
        youtube_video_id
    )

    if existing_video:
        return existing_video

    video = models.Video(
        youtube_video_id=youtube_video_id,
        title=title,
        channel_name=channel_name
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    return video


# -----------------------------------------
# COMMENT CRUD
# -----------------------------------------

def get_comment_by_comment_id(
    db: Session,
    comment_id: str
):
    return (
        db.query(models.Comment)
        .filter(
            models.Comment.comment_id == comment_id
        )
        .first()
    )


def create_comment(
    db: Session,
    video_id: int,
    comment_id: str,
    author_name: str,
    comment_text: str,
    language: str = "unknown",
    is_emoji_only: bool = False,
    likes: int = 0,
    published_at=None
):
    existing_comment = get_comment_by_comment_id(
        db,
        comment_id
    )

    if existing_comment:
        return existing_comment

    comment = models.Comment(
        video_id=video_id,
        comment_id=comment_id,
        author_name=author_name,
        comment_text=comment_text,
        language=language,
        is_emoji_only=is_emoji_only,
        likes=likes,
        published_at=published_at
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


# -----------------------------------------
# SENTIMENT CRUD
# -----------------------------------------

def get_sentiment_by_comment_and_target(
    db: Session,
    comment_id: int,
    stance_target: str
):
    return (
        db.query(models.Sentiment)
        .filter(
            models.Sentiment.comment_id == comment_id,
            models.Sentiment.stance_target == stance_target
        )
        .first()
    )


def create_sentiment(
    db: Session,
    comment_id: int,
    prediction: str,
    confidence: float,
    stance: str = None,
    stance_confidence: float = None,
    stance_target: str = None,
    model_name: str = None
):
    existing_sentiment = (
        get_sentiment_by_comment_and_target(
            db=db,
            comment_id=comment_id,
            stance_target=stance_target
        )
    )

    if existing_sentiment:
        return existing_sentiment

    sentiment = models.Sentiment(
        comment_id=comment_id,

        # -------------------------------------
        # GENERAL SENTIMENT
        # -------------------------------------

        prediction=prediction,
        confidence=str(confidence),

        # -------------------------------------
        # TARGET-AWARE POLITICAL STANCE
        # -------------------------------------

        stance_target=stance_target,
        stance=stance,

        stance_confidence=(
            str(stance_confidence)
            if stance_confidence is not None
            else None
        ),

        # -------------------------------------
        # MODEL INFORMATION
        # -------------------------------------

        model_name=model_name
    )

    db.add(sentiment)
    db.commit()
    db.refresh(sentiment)

    return sentiment
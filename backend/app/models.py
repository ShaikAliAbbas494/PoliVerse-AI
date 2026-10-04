from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    TIMESTAMP,
    ForeignKey,
    Boolean
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


# -----------------------------------------
# VIDEO MODEL
# -----------------------------------------
class Video(Base):
    __tablename__ = "videos"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    youtube_video_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    title = Column(
        Text,
        nullable=False
    )

    channel_name = Column(
        Text,
        nullable=False
    )

    published_at = Column(
        TIMESTAMP
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    comments = relationship(
        "Comment",
        back_populates="video",
        cascade="all, delete-orphan"
    )


# -----------------------------------------
# COMMENT MODEL
# -----------------------------------------
class Comment(Base):
    __tablename__ = "comments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    video_id = Column(
        Integer,
        ForeignKey("videos.id"),
        nullable=False
    )

    comment_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    author_name = Column(
        Text
    )

    comment_text = Column(
        Text
    )

    # Detected language
    language = Column(
        String(30)
    )

    # Whether the comment contains only emojis/symbols
    is_emoji_only = Column(
        Boolean,
        default=False
    )

    # General sentiment stored here for compatibility
    sentiment = Column(
        String(20)
    )

    likes = Column(
        Integer,
        default=0
    )

    published_at = Column(
        TIMESTAMP
    )

    video = relationship(
        "Video",
        back_populates="comments"
    )


# -----------------------------------------
# YOUTUBE JOB MODEL
# -----------------------------------------
class YouTubeJob(Base):
    __tablename__ = "youtube_jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    youtube_video_id = Column(
        String(100),
        index=True
    )

    youtube_url = Column(
        Text
    )

    video_title = Column(
        Text
    )

    channel_name = Column(
        Text
    )

    fetch_status = Column(
        String(20)
    )

    comments_fetched = Column(
        Integer
    )

    started_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    completed_at = Column(
        TIMESTAMP
    )

    error_message = Column(
        Text
    )


# -----------------------------------------
# SENTIMENT MODEL
# -----------------------------------------
class Sentiment(Base):
    __tablename__ = "sentiments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    comment_id = Column(
        Integer,
        ForeignKey("comments.id"),
        nullable=False
    )

    # -------------------------------------
    # GENERAL SENTIMENT
    # -------------------------------------

    prediction = Column(
        String(20)
    )

    confidence = Column(
        String(20)
    )

    # -------------------------------------
    # TARGET-AWARE POLITICAL STANCE
    # -------------------------------------

    # Political leader or party selected
    # by the user for analysis.
    #
    # Examples:
    # Revanth Reddy
    # KCR
    # BJP
    # Congress

    stance_target = Column(
        String(100)
    )

    stance = Column(
        String(30)
    )

    stance_confidence = Column(
        String(20)
    )

    # -------------------------------------
    # MODEL INFORMATION
    # -------------------------------------

    model_name = Column(
        String(100)
    )

    analyzed_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
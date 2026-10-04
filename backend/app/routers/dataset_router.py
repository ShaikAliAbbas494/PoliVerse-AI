from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import csv
import io

from app.database import get_db
from app import models


router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"]
)


@router.get("/export-csv")
def export_dataset(
    db: Session = Depends(get_db)
):
    # -----------------------------------------
    # Get comments with video and sentiment data
    # -----------------------------------------

    rows = (
        db.query(
            models.Video.youtube_video_id,
            models.Video.title,
            models.Video.channel_name,
            models.Comment.comment_id,
            models.Comment.author_name,
            models.Comment.comment_text,
            models.Comment.language,
            models.Comment.likes,
            models.Comment.published_at,
            models.Sentiment.prediction,
            models.Sentiment.confidence,
            models.Sentiment.model_name,
            models.Sentiment.analyzed_at
        )
        .join(
            models.Comment,
            models.Comment.video_id == models.Video.id
        )
        .outerjoin(
            models.Sentiment,
            models.Sentiment.comment_id == models.Comment.id
        )
        .order_by(
            models.Comment.published_at.desc()
        )
        .all()
    )

    # -----------------------------------------
    # Create CSV in memory
    # -----------------------------------------

    output = io.StringIO()

    writer = csv.writer(output)

    # CSV header
    writer.writerow([
        "youtube_video_id",
        "video_title",
        "channel_name",
        "comment_id",
        "author_name",
        "comment_text",
        "language",
        "likes",
        "published_at",
        "sentiment",
        "confidence",
        "model_name",
        "analyzed_at"
    ])

    # -----------------------------------------
    # Write dataset rows
    # -----------------------------------------

    for row in rows:
        writer.writerow([
            row.youtube_video_id,
            row.title,
            row.channel_name,
            row.comment_id,
            row.author_name,
            row.comment_text,
            row.language,
            row.likes,
            row.published_at,
            row.prediction,
            row.confidence,
            row.model_name,
            row.analyzed_at
        ])

    # Move cursor to beginning
    output.seek(0)

    # -----------------------------------------
    # Return CSV file
    # -----------------------------------------

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                "attachment; filename=poliverse_dataset.csv"
            )
        }
    )
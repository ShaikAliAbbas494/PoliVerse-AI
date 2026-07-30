from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas import YouTubeURL
from app.utils.youtube_utils import extract_video_id
from app.services.youtube_service import (
    get_video_comments,
    get_video_details
)
from app.database import get_db
from app.crud import create_video, create_comment

router = APIRouter(
    prefix="/youtube",
    tags=["YouTube"]
)


@router.post("/fetch-comments")
def fetch_comments(
    request: YouTubeURL,
    db: Session = Depends(get_db)
):
    # Extract Video ID
    video_id = extract_video_id(request.url)

    if not video_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL"
        )

    # Get Video Details
    video = get_video_details(video_id)

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    # Save Video into Database
    saved_video = create_video(
        db=db,
        youtube_video_id=video["video_id"],
        title=video["title"],
        channel_name=video["channel_name"]
    )

    # Fetch Comments
    comments = get_video_comments(video_id)

    # Save Comments into Database
    for comment in comments:
        create_comment(
            db=db,
            video_id=saved_video.id,
            comment_id=comment["comment_id"],
            author_name=comment["author"],
            comment_text=comment["comment"],
            likes=comment["likes"],
            published_at=comment["published_at"]
        )

    return {
        "message": "Video and comments saved successfully",
        "video": {
            "id": saved_video.id,
            "youtube_video_id": saved_video.youtube_video_id,
            "title": saved_video.title,
            "channel_name": saved_video.channel_name
        },
        "total_comments": len(comments),
        "comments": comments
    }
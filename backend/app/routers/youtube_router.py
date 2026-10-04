from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas import YouTubeURL

from app.utils.youtube_utils import extract_video_id

from app.services.youtube_service import (
    get_video_comments,
    get_video_details
)

from app.services.preprocessing_service import (
    preprocess_comment
)

from app.services.sentiment_service import (
    analyze_sentiment
)

from app.services.stance_service import (
    analyze_stance
)

from app.database import get_db

from app.crud import (
    create_video,
    create_comment,
    create_sentiment,
    get_sentiment_by_comment_and_target
)


router = APIRouter(
    prefix="/youtube",
    tags=["YouTube"]
)


@router.post("/fetch-comments")
def fetch_comments(
    request: YouTubeURL,
    db: Session = Depends(get_db)
):

    # -----------------------------------------
    # 1. VALIDATE TARGET
    # -----------------------------------------

    target = request.target.strip()

    if not target:
        raise HTTPException(
            status_code=400,
            detail="Target leader or party is required"
        )


    # -----------------------------------------
    # 2. EXTRACT VIDEO ID
    # -----------------------------------------

    video_id = extract_video_id(request.url)

    if not video_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL"
        )


    # -----------------------------------------
    # 3. GET VIDEO DETAILS
    # -----------------------------------------

    video = get_video_details(video_id)

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )


    # -----------------------------------------
    # 4. SAVE VIDEO
    # -----------------------------------------

    saved_video = create_video(
        db=db,
        youtube_video_id=video["video_id"],
        title=video["title"],
        channel_name=video["channel_name"]
    )


    # -----------------------------------------
    # 5. FETCH COMMENTS
    # -----------------------------------------

    comments = get_video_comments(video_id)

    analyzed_comments = []

    new_comments_analyzed = 0
    existing_comments = 0


    # -----------------------------------------
    # 6. PROCESS COMMENTS
    # -----------------------------------------

    for comment in comments:

        # -------------------------------------
        # PREPROCESSING
        # -------------------------------------

        preprocessing_result = preprocess_comment(
            comment["comment"]
        )

        language = preprocessing_result["language"]

        is_emoji_only = preprocessing_result[
            "is_emoji_only"
        ]

        cleaned_text = preprocessing_result[
            "cleaned_text"
        ]


        # -------------------------------------
        # SAVE COMMENT
        # -------------------------------------

        saved_comment = create_comment(
            db=db,
            video_id=saved_video.id,
            comment_id=comment["comment_id"],
            author_name=comment["author"],
            comment_text=comment["comment"],
            language=language,
            is_emoji_only=is_emoji_only,
            likes=comment["likes"],
            published_at=comment["published_at"]
        )


        # -------------------------------------
        # CHECK EXISTING ANALYSIS
        # -------------------------------------

        existing_sentiment = (
            get_sentiment_by_comment_and_target(
                db=db,
                comment_id=saved_comment.id,
                stance_target=target
            )
        )


        # -------------------------------------
        # ANALYZE COMMENT
        # -------------------------------------

        if existing_sentiment:

            saved_sentiment = existing_sentiment

            existing_comments += 1

        else:

            # ---------------------------------
            # GENERAL SENTIMENT
            # ---------------------------------

            sentiment_result = analyze_sentiment(
                cleaned_text
            )


            # ---------------------------------
            # TARGET-AWARE POLITICAL STANCE
            # ---------------------------------

            stance_result = analyze_stance(
                cleaned_text,
                target=target
            )


            # ---------------------------------
            # SAVE ANALYSIS
            # ---------------------------------

            saved_sentiment = create_sentiment(
                db=db,
                comment_id=saved_comment.id,

                prediction=sentiment_result[
                    "sentiment"
                ],

                confidence=sentiment_result[
                    "confidence"
                ],

                stance=stance_result[
                    "stance"
                ],

                stance_confidence=stance_result[
                    "confidence"
                ],

                stance_target=target,

                model_name=(
                    "cardiffnlp/"
                    "twitter-roberta-base-sentiment-latest"
                )
            )

            new_comments_analyzed += 1


        # -------------------------------------
        # RESPONSE
        # -------------------------------------

        analyzed_comments.append({

            "comment_id": comment["comment_id"],

            "author": comment["author"],

            "comment": comment["comment"],

            "cleaned_text": cleaned_text,

            "language": language,

            "is_emoji_only": is_emoji_only,

            "likes": comment["likes"],

            "published_at": comment["published_at"],

            "sentiment": saved_sentiment.prediction,

            "confidence": float(
                saved_sentiment.confidence
            ),

            "stance_target": (
                saved_sentiment.stance_target
            ),

            "stance": saved_sentiment.stance,

            "stance_confidence": (
                float(
                    saved_sentiment.stance_confidence
                )
                if saved_sentiment.stance_confidence
                else None
            )
        })


    # -----------------------------------------
    # 7. FINAL RESPONSE
    # -----------------------------------------

    return {

        "message": (
            "Video, comments, preprocessing, "
            "sentiment and target-aware stance "
            "analysis completed successfully"
        ),

        "target": target,

        "video": {

            "id": saved_video.id,

            "youtube_video_id": (
                saved_video.youtube_video_id
            ),

            "title": saved_video.title,

            "channel_name": (
                saved_video.channel_name
            )
        },

        "total_comments": len(
            analyzed_comments
        ),

        "new_comments_analyzed": (
            new_comments_analyzed
        ),

        "existing_comments": (
            existing_comments
        ),

        "comments": analyzed_comments
    }
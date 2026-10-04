from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models


router = APIRouter(
    prefix="/sentiment",
    tags=["Sentiment"]
)


# -----------------------------------------
# SENTIMENT SUMMARY
# -----------------------------------------

@router.get("/summary")
def get_sentiment_summary(
    target: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    target = target.strip()

    positive = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.prediction == "Positive",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    neutral = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.prediction == "Neutral",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    negative = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.prediction == "Negative",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    total = (
        positive
        + neutral
        + negative
    )

    return {
        "target": target,
        "total_analyzed": total,
        "positive": positive,
        "neutral": neutral,
        "negative": negative
    }


# -----------------------------------------
# STANCE SUMMARY
# -----------------------------------------

@router.get("/stance-summary")
def get_stance_summary(
    target: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    target = target.strip()

    support = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.stance == "Support",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    oppose = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.stance == "Oppose",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    neutral = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.stance == "Neutral",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    uncertain = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.stance == "Uncertain",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    no_political_stance = (
        db.query(func.count(models.Sentiment.id))
        .filter(
            models.Sentiment.stance == "No Political Stance",
            models.Sentiment.stance_target == target
        )
        .scalar()
    )

    total = (
        support
        + oppose
        + neutral
        + uncertain
        + no_political_stance
    )

    return {
        "target": target,
        "total_analyzed": total,
        "support": support,
        "oppose": oppose,
        "neutral": neutral,
        "uncertain": uncertain,
        "no_political_stance": no_political_stance
    }
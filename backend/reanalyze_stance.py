from app.database import SessionLocal
from app import models
from app.services.stance_service import analyze_stance


db = SessionLocal()

try:
    rows = (
        db.query(
            models.Comment,
            models.Sentiment
        )
        .join(
            models.Sentiment,
            models.Sentiment.comment_id == models.Comment.id
        )
        .all()
    )

    print(f"Found {len(rows)} comments to re-analyze.\n")

    updated = 0

    for comment, sentiment in rows:

        result = analyze_stance(
            comment.comment_text,
            target="Revanth Reddy"
        )

        sentiment.stance = result["stance"]
        sentiment.stance_confidence = str(
            result["confidence"]
        )

        updated += 1

        print(
            f"Comment: {comment.comment_text[:60]}"
        )
        print(
            f"Stance: {result['stance']}"
        )
        print(
            f"Confidence: {result['confidence']}"
        )
        print("-" * 60)

    db.commit()

    print("\n===================================")
    print("STANCE RE-ANALYSIS COMPLETED")
    print("===================================")
    print(f"Rows updated: {updated}")

except Exception as e:
    db.rollback()
    print("\nERROR:")
    print(e)

finally:
    db.close()
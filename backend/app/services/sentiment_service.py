from transformers import pipeline


# Load the transformer sentiment model once
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)


def analyze_sentiment(text: str):
    """
    Analyze the sentiment of a YouTube comment.

    Returns:
        sentiment: Positive / Neutral / Negative
        confidence: Model confidence score
    """

    # Handle empty comments
    if not text or not text.strip():
        return {
            "sentiment": "Neutral",
            "confidence": 0.0
        }

    # Let the tokenizer handle token limits.
    # This is safer than slicing characters with text[:512].
    result = sentiment_pipeline(
        text,
        truncation=True,
        max_length=512
    )[0]

    label = result["label"].lower()
    confidence = float(result["score"])

    if "positive" in label:
        sentiment = "Positive"

    elif "negative" in label:
        sentiment = "Negative"

    else:
        sentiment = "Neutral"

    return {
        "sentiment": sentiment,
        "confidence": confidence
    }
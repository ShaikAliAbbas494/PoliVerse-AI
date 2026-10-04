import re
from langdetect import detect, DetectorFactory


# Make language detection reproducible
DetectorFactory.seed = 0


def detect_language(text: str) -> str:
    """
    Detect the language of a comment.

    Returns:
        en = English
        te = Telugu
        other = Other/Unknown
    """

    if not text or not text.strip():
        return "unknown"

    try:
        language = detect(text)

        if language == "en":
            return "en"

        if language == "te":
            return "te"

        return "other"

    except Exception:
        return "unknown"


def is_emoji_only(text: str) -> bool:
    """
    Check whether a comment contains only emojis,
    symbols, spaces, or punctuation.
    """

    if not text or not text.strip():
        return True

    # Keep letters and numbers.
    # If nothing remains, treat it as emoji/symbol-only.
    text_without_symbols = re.sub(
        r"[^\w\s]",
        "",
        text,
        flags=re.UNICODE
    )

    return not text_without_symbols.strip()


def clean_text(text: str) -> str:
    """
    Basic text preprocessing.

    Preserves Telugu and English characters.
    Removes unnecessary whitespace.
    """

    if not text:
        return ""

    # Remove URLs
    text = re.sub(
        r"https?://\S+|www\.\S+",
        "",
        text
    )

    # Normalize multiple spaces
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def preprocess_comment(text: str) -> dict:
    """
    Complete preprocessing pipeline for one comment.
    """

    if not text or not text.strip():
        return {
            "original_text": text,
            "cleaned_text": "",
            "language": "unknown",
            "is_emoji_only": True
        }

    language = detect_language(text)

    emoji_only = is_emoji_only(text)

    cleaned = clean_text(text)

    return {
        "original_text": text,
        "cleaned_text": cleaned,
        "language": language,
        "is_emoji_only": emoji_only
    }
import re


# -----------------------------------------
# POLITICAL STANCE CATEGORIES
# -----------------------------------------

SUPPORT = "Support"
OPPOSE = "Oppose"
NEUTRAL = "Neutral"
NO_POLITICAL_STANCE = "No Political Stance"
UNCERTAIN = "Uncertain"


# -----------------------------------------
# KNOWN TARGET ALIASES
# -----------------------------------------

TARGET_ALIASES = {

    "revanth reddy": [
        "revanth reddy",
        "revanth",
        "రేవంత్ రెడ్డి",
        "రేవంత్",
        "రేవంతన్న",
        "రేవంత్ అన్న"
    ],

    "kcr": [
        "kcr",
        "k chandrasekhar rao",
        "chandrasekhar rao",
        "కేసీఆర్",
        "కెసిఆర్",
        "కెసిఆర్",
        "జై కేసీఆర్"
    ],

    "bjp": [
        "bjp",
        "bharatiya janata party",
        "భారతీయ జనతా పార్టీ"
    ],

    "congress": [
        "congress",
        "indian national congress",
        "కాంగ్రెస్"
    ],

    "brs": [
        "brs",
        "bharat rashtra samithi",
        "bharat rastra samithi",
        "బీఆర్ఎస్",
        "బిఆర్ఎస్"
    ]
}


# -----------------------------------------
# OTHER POLITICAL TERMS
# -----------------------------------------

GENERAL_POLITICAL_TERMS = [
    "government",
    "minister",
    "chief minister",
    "cm",
    "party",
    "election",
    "politics",
    "political",
    "leader",
    "congress",
    "bjp",
    "brs",
    "kcr",
    "revanth",
    "revanth reddy",
    "రాజకీయ",
    "ప్రభుత్వం",
    "ఎన్నికలు",
    "పార్టీ"
]


# -----------------------------------------
# SUPPORT KEYWORDS
# -----------------------------------------

SUPPORT_TERMS = [
    "support",
    "supporting",
    "supports",
    "fully support",
    "i support",
    "good",
    "great",
    "best",
    "excellent",
    "love",
    "like",
    "liked",
    "proud",
    "jai",
    "జై",
    "మద్దతు",
    "మంచి",
    "చాలా మంచి",
    "అభినందనలు",
    "విజయం"
]


# -----------------------------------------
# OPPOSITION KEYWORDS
# -----------------------------------------

OPPOSE_TERMS = [
    "oppose",
    "opposing",
    "opposes",
    "against",
    "i oppose",
    "worst",
    "bad",
    "failed",
    "failure",
    "hate",
    "dislike",
    "useless",
    "waste",
    "cheated",
    "fraud",
    "lie",
    "lies",
    "liar",
    "వ్యతిరేకం",
    "వ్యతిరేకంగా",
    "విఫలమైంది",
    "చెత్త",
    "మోసం",
    "అబద్ధం",
    "అబద్ధాలే"
]


# -----------------------------------------
# NON-POLITICAL / NO-STANCE PHRASES
# -----------------------------------------

NO_STANCE_TERMS = [
    "i don't support any party",
    "i do not support any party",
    "no comments",
    "i don't know",
    "i do not know",
    "not interested in politics"
]


# -----------------------------------------
# TEXT NORMALIZATION
# -----------------------------------------

def normalize_text(text: str) -> str:

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# -----------------------------------------
# GET TARGET ALIASES
# -----------------------------------------

def get_target_terms(target: str):

    normalized_target = normalize_text(target)

    # Check known target aliases
    for key, aliases in TARGET_ALIASES.items():

        if (
            normalized_target == key
            or normalized_target in aliases
        ):
            return aliases

    # Unknown target:
    # use the target itself
    return [normalized_target]


# -----------------------------------------
# TARGET DETECTION
# -----------------------------------------

def mentions_target(
    text: str,
    target: str
) -> bool:

    normalized = normalize_text(text)

    target_terms = get_target_terms(target)

    for term in target_terms:

        if term and term in normalized:
            return True

    return False


# -----------------------------------------
# OTHER POLITICAL FIGURE DETECTION
# -----------------------------------------

def mentions_other_politician(
    text: str,
    target: str
) -> bool:

    normalized = normalize_text(text)

    target_terms = get_target_terms(target)

    for key, aliases in TARGET_ALIASES.items():

        # Skip current target
        if any(
            alias in target_terms
            for alias in aliases
        ):
            continue

        for alias in aliases:

            if alias in normalized:
                return True

    return False


# -----------------------------------------
# NO POLITICAL STANCE DETECTION
# -----------------------------------------

def is_no_political_stance(text: str) -> bool:

    normalized = normalize_text(text)

    for phrase in NO_STANCE_TERMS:

        if phrase in normalized:
            return True

    return False


# -----------------------------------------
# EMOJI / SYMBOL CHECK
# -----------------------------------------

def is_symbol_only(text: str) -> bool:

    if not text or not text.strip():
        return True

    return not re.search(
        r"\w",
        text,
        re.UNICODE
    )


# -----------------------------------------
# KEYWORD DETECTION
# -----------------------------------------

def contains_support_keyword(text: str) -> bool:

    normalized = normalize_text(text)

    return any(
        term in normalized
        for term in SUPPORT_TERMS
    )


def contains_oppose_keyword(text: str) -> bool:

    normalized = normalize_text(text)

    return any(
        term in normalized
        for term in OPPOSE_TERMS
    )


# -----------------------------------------
# STANCE ANALYSIS
# -----------------------------------------

def analyze_stance(
    text: str,
    target: str = "Revanth Reddy"
) -> dict:

    # -------------------------------------
    # 1. EMPTY COMMENT
    # -------------------------------------

    if not text or not text.strip():

        return {
            "stance": NO_POLITICAL_STANCE,
            "confidence": 1.0,
            "reason": "Empty comment"
        }


    normalized = normalize_text(text)


    # -------------------------------------
    # 2. EXPLICIT NO-STANCE
    # -------------------------------------

    if is_no_political_stance(normalized):

        return {
            "stance": NO_POLITICAL_STANCE,
            "confidence": 0.95,
            "reason": "Explicitly no political stance"
        }


    # -------------------------------------
    # 3. EMOJI / SYMBOL ONLY
    # -------------------------------------

    if is_symbol_only(normalized):

        return {
            "stance": NO_POLITICAL_STANCE,
            "confidence": 0.95,
            "reason": "Emoji or symbol only"
        }


    # -------------------------------------
    # 4. TARGET MENTION CHECK
    # -------------------------------------

    target_found = mentions_target(
        normalized,
        target
    )


    # -------------------------------------
    # 5. TARGET IS EXPLICITLY MENTIONED
    # -------------------------------------

    if target_found:

        support_found = contains_support_keyword(
            normalized
        )

        oppose_found = contains_oppose_keyword(
            normalized
        )


        # Conflicting indicators
        if support_found and oppose_found:

            return {
                "stance": UNCERTAIN,
                "confidence": 0.40,
                "reason": (
                    "Conflicting support and "
                    "opposition indicators"
                )
            }


        # Explicit support
        if support_found:

            return {
                "stance": SUPPORT,
                "confidence": 0.85,
                "reason": (
                    "Target explicitly mentioned "
                    "with support indicators"
                )
            }


        # Explicit opposition
        if oppose_found:

            return {
                "stance": OPPOSE,
                "confidence": 0.85,
                "reason": (
                    "Target explicitly mentioned "
                    "with opposition indicators"
                )
            }


        # Target mentioned but no clear opinion
        return {
            "stance": NEUTRAL,
            "confidence": 0.60,
            "reason": (
                "Target mentioned without "
                "clear support or opposition"
            )
        }


    # -------------------------------------
    # 6. ANOTHER POLITICAL TARGET MENTIONED
    # -------------------------------------

    if mentions_other_politician(
        normalized,
        target
    ):

        return {
            "stance": UNCERTAIN,
            "confidence": 0.45,
            "reason": (
                "Another political figure or "
                "party mentioned; target relationship "
                "is uncertain"
            )
        }


    # -------------------------------------
    # 7. GENERAL POLITICAL CONTEXT
    # -------------------------------------

    has_political_term = any(
        term in normalized
        for term in GENERAL_POLITICAL_TERMS
    )


    if has_political_term:

        return {
            "stance": UNCERTAIN,
            "confidence": 0.40,
            "reason": (
                "Political context detected but "
                "target stance is unclear"
            )
        }


    # -------------------------------------
    # 8. NO POLITICAL STANCE
    # -------------------------------------

    return {
        "stance": NO_POLITICAL_STANCE,
        "confidence": 0.70,
        "reason": (
            "No clear political stance "
            "toward the target detected"
        )
    }
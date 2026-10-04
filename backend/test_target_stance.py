from transformers import pipeline


MODEL_NAME = "MoritzLaurer/mDeBERTa-v3-base-mnli-xnli"

classifier = pipeline(
    "zero-shot-classification",
    model=MODEL_NAME
)


target = "Revanth Reddy"


comments = [

    # -----------------------------
    # CLEAR SUPPORT
    # -----------------------------
    "Revanth Reddy is doing a great job",
    "Great CM Revanth Reddy",
    "I fully support Revanth Reddy",
    "రేవంత్ రెడ్డి చాలా మంచి ముఖ్యమంత్రి",
    "రేవంత్ అన్నకు మా పూర్తి మద్దతు",


    # -----------------------------
    # CLEAR OPPOSITION
    # -----------------------------
    "Revanth Reddy is the worst CM",
    "I strongly oppose Revanth Reddy",
    "Revanth Reddy has failed the people",
    "రేవంత్ రెడ్డి ప్రభుత్వం విఫలమైంది",
    "రేవంత్ రెడ్డికి వ్యతిరేకం",


    # -----------------------------
    # SUPPORT FOR ANOTHER POLITICAL FIGURE
    # -----------------------------
    "Jai KCR ❤️",
    "I support KCR",
    "KCR is the best leader",
    "జై కేసీఆర్ ❤️",
    "కేసీఆర్ కు మా మద్దతు",


    # -----------------------------
    # NEUTRAL / NO POLITICAL STANCE
    # -----------------------------
    "I don't support any party",
    "No comments",
    "I don't know anything about Revanth Reddy",
    "This is a political meeting",
    "He spoke about development today"
]


candidate_labels = [
    f"supports {target}",
    f"opposes {target}",
    f"is neutral toward {target}",
    "does not express a political stance"
]


for comment in comments:

    result = classifier(
        comment,
        candidate_labels,
        multi_label=False
    )

    print("\n--------------------------------")
    print("Comment:", comment)
    print("Prediction:", result["labels"][0])
    print("Confidence:", round(result["scores"][0], 4))
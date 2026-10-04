import os

from dotenv import load_dotenv
from googleapiclient.discovery import build


# -----------------------------------------
# LOAD ENVIRONMENT VARIABLES
# -----------------------------------------

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")


# -----------------------------------------
# YOUTUBE API CLIENT
# -----------------------------------------

youtube = build(
    "youtube",
    "v3",
    developerKey=API_KEY
)


# -----------------------------------------
# GET VIDEO DETAILS
# -----------------------------------------

def get_video_details(video_id):

    request = youtube.videos().list(
        part="snippet",
        id=video_id
    )

    response = request.execute()

    if not response["items"]:
        return None

    snippet = response["items"][0]["snippet"]

    return {
        "video_id": video_id,
        "title": snippet["title"],
        "channel_name": snippet["channelTitle"]
    }


# -----------------------------------------
# GET VIDEO COMMENTS WITH PAGINATION
# -----------------------------------------

def get_video_comments(
    video_id,
    max_comments=3000
):

    comments = []

    next_page_token = None

    while len(comments) < max_comments:

        remaining = max_comments - len(comments)

        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=min(100, remaining),
            pageToken=next_page_token,
            textFormat="plainText"
        )

        response = request.execute()

        for item in response.get("items", []):

            comment = item["snippet"]["topLevelComment"]
            snippet = comment["snippet"]

            comments.append({
                "comment_id": comment["id"],
                "author": snippet.get(
                    "authorDisplayName",
                    "Unknown"
                ),
                "comment": snippet.get(
                    "textDisplay",
                    ""
                ),
                "likes": snippet.get(
                    "likeCount",
                    0
                ),
                "published_at": snippet.get(
                    "publishedAt"
                )
            })

            if len(comments) >= max_comments:
                break

        next_page_token = response.get(
            "nextPageToken"
        )

        # Stop if YouTube has no more pages
        if not next_page_token:
            break

    return comments
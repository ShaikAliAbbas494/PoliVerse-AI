import os
from dotenv import load_dotenv
from googleapiclient.discovery import build

# Load environment variables
load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")

# Create YouTube API client
youtube = build(
    "youtube",
    "v3",
    developerKey=API_KEY
)


# ------------------------------------------
# Fetch Video Details
# ------------------------------------------
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


# ------------------------------------------
# Fetch Video Comments
# ------------------------------------------
def get_video_comments(video_id, max_results=20):
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=max_results,
        textFormat="plainText"
    )

    response = request.execute()

    comments = []

    for item in response["items"]:
        comment = item["snippet"]["topLevelComment"]
        snippet = comment["snippet"]

        comments.append({
            "comment_id": comment["id"],
            "author": snippet["authorDisplayName"],
            "comment": snippet["textDisplay"],
            "likes": snippet["likeCount"],
            "published_at": snippet["publishedAt"]
        })

    return comments
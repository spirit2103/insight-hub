from fastapi import APIRouter
from google.api_core.exceptions import NotFound
from app.config.firebase import db
from datetime import datetime
import re

router = APIRouter()

STOPWORDS = {
    "the", "and", "for", "with", "that", "this", "from", "you", "your", "are",
    "was", "were", "have", "has", "had", "but", "not", "they", "their", "them",
    "will", "would", "can", "could", "should", "about", "into", "over", "under",
    "also", "than", "then", "such", "these", "those", "our", "out", "its", "it's",
    "we", "he", "she", "his", "her", "who", "what", "when", "where", "why", "how",
    "all", "any", "each", "few", "more", "most", "other", "some", "no", "nor",
    "only", "own", "same", "so", "too", "very", "a", "an", "in", "on", "of", "to",
    "is", "it", "as", "at", "by", "be", "or", "if", "up", "down", "off", "per",
}

def _tokenize(text: str):
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())
    return [w for w in words if w not in STOPWORDS]

@router.get("/charts")
def charts():
    try:
        chunks_stream = db.collection("chunks").stream()
        word_counts = {}
        chunk_count = 0
        for chunk_doc in chunks_stream:
            data = chunk_doc.to_dict() or {}
            text = data.get("text", "")
            for word in _tokenize(text):
                word_counts[word] = word_counts.get(word, 0) + 1
            chunk_count += 1
            if chunk_count >= 2000:
                break

        keyword_frequency = [
            {"keyword": k, "count": v}
            for k, v in sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        ]

        docs_stream = db.collection("documents").stream()
        mentions_by_year = {}
        for doc in docs_stream:
            data = doc.to_dict() or {}
            created_at = data.get("created_at")
            if created_at:
                try:
                    year = datetime.fromisoformat(created_at).year
                except ValueError:
                    year = datetime.utcnow().year
            else:
                year = datetime.utcnow().year
            mentions_by_year[year] = mentions_by_year.get(year, 0) + 1

        mentions_over_time = [
            {"year": year, "mentions": count}
            for year, count in sorted(mentions_by_year.items())
        ]

        return {
            "keywordFrequency": keyword_frequency,
            "mentionsOverTime": mentions_over_time,
        }
    except NotFound:
        # Firestore not initialized for this project yet
        return {"keywordFrequency": [], "mentionsOverTime": []}

from fastapi import APIRouter, HTTPException
from typing import Dict
from app.config.firebase import db
from google.api_core.exceptions import NotFound

# ----------------------------
# Router setup
# ----------------------------
router = APIRouter(
    prefix="/metadata",
    tags=["Metadata"]
)

# ----------------------------
# Health Check
# ----------------------------
@router.get("/")
def metadata_health():
    return {
        "status": "ok",
        "service": "Insight-Hub Metadata API"
    }

# ----------------------------
# Create / Update Metadata
# ----------------------------
@router.post("/create/{filename}")
def create_metadata(filename: str):
    try:
        doc = db.collection("documents").document(filename).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        return {
            "message": "Metadata already exists",
            "metadata": doc.to_dict(),
        }
    except NotFound:
        raise HTTPException(status_code=500, detail="Firestore database not initialized.")

# ----------------------------
# Read Metadata
# ----------------------------
@router.get("/{filename}", response_model=Dict)
def get_metadata(filename: str):
    try:
        doc = db.collection("documents").document(filename).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Metadata not found")
        return doc.to_dict()
    except NotFound:
        raise HTTPException(status_code=500, detail="Firestore database not initialized.")

# ----------------------------
# Mark Document as Processed
# ----------------------------
@router.put("/processed/{filename}")
def mark_processed(filename: str):
    try:
        db.collection("documents").document(filename).set({
            "processed": True,
        }, merge=True)
        doc = db.collection("documents").document(filename).get()
        return {
            "message": "Metadata updated",
            "metadata": doc.to_dict() if doc.exists else {},
        }
    except NotFound:
        raise HTTPException(status_code=500, detail="Firestore database not initialized.")

# ----------------------------
# List All Metadata
# ----------------------------
@router.get("/list/all")
def list_all_metadata():
    try:
        docs = db.collection("documents").stream()
        return [doc.to_dict() for doc in docs]
    except NotFound:
        return []

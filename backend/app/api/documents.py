from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from typing import List, Dict, Any
import os
import shutil
import uuid
from datetime import datetime
from app.processing.pipeline import process_document
from app.auth.verify_token import verify_firebase_token
from app.vector_store.faiss_index import remove_document
from app.config.firebase import db
from google.cloud.firestore_v1 import FieldFilter
from google.api_core.exceptions import NotFound
import logging

# ----------------------------
# Router setup
# ----------------------------
router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

logger = logging.getLogger("uvicorn.error")

# ----------------------------
# Local storage configuration
# ----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# ----------------------------
# Background processing
# ----------------------------
def _process_document_task(filename: str, file_path: str) -> None:
    logger.info("Background processing started for %s", filename)
    try:
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext in {".pdf", ".docx", ".doc"}:
            process_document(filename, file_path)
            db.collection("documents").document(filename).set({
                "status": "completed",
                "processed": True,
                "updated_at": datetime.utcnow().isoformat(),
            }, merge=True)
        else:
            db.collection("documents").document(filename).set({
                "status": "completed",
                "processed": False,
                "note": "Processing skipped for unsupported file type",
                "updated_at": datetime.utcnow().isoformat(),
            }, merge=True)
    except Exception as e:
        logger.exception("Background processing failed for %s", filename)
        db.collection("documents").document(filename).set({
            "status": "failed",
            "processed": False,
            "error": str(e),
            "updated_at": datetime.utcnow().isoformat(),
        }, merge=True)

# ----------------------------
# Health Check
# ----------------------------
@router.get("/")
def documents_health():
    return {
        "status": "ok",
        "service": "Insight-Hub Documents API"
    }

# ----------------------------
# Upload Document
# ----------------------------
@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Depends(verify_firebase_token),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_ext = os.path.splitext(file.filename)[1].lower()
    allowed_extensions = {".pdf", ".txt", ".md", ".docx", ".doc"}

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, TXT, and MD files are supported"
        )

    unique_name = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        logger.exception("Failed to save upload to disk")
        raise HTTPException(status_code=500, detail=f"Local save failed: {e}")

    metadata = {
        "filename": unique_name,
        "original_filename": file.filename,
        "size_bytes": os.path.getsize(file_path),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
        "processed": False,
        "status": "processing",
        "storage_path": f"local:{file_path}",
        "owner_id": user_id,
    }
    try:
        db.collection("documents").document(unique_name).set(metadata, merge=True)
    except NotFound:
        logger.exception("Firestore database not initialized")
        raise HTTPException(status_code=500, detail="Firestore database not initialized.")
    except Exception as e:
        logger.exception("Failed to write Firestore metadata")
        raise HTTPException(status_code=500, detail=f"Firestore write failed: {e}")

    background_tasks.add_task(_process_document_task, unique_name, file_path)

    return {
        "message": "File uploaded successfully",
        "original_filename": file.filename,
        "stored_filename": unique_name
    }

# ----------------------------
# List Uploaded Documents
# ----------------------------
@router.get("/list", response_model=List[Dict[str, Any]])
def list_documents():
    results: List[Dict[str, Any]] = []
    try:
        docs = db.collection("documents").stream()
        for doc in docs:
            data = doc.to_dict() or {}
            results.append({
                "filename": data.get("filename", doc.id),
                "original_filename": data.get("original_filename"),
                "status": data.get("status", "uploaded"),
                "created_at": data.get("created_at"),
                "updated_at": data.get("updated_at"),
                "size_bytes": data.get("size_bytes"),
                "page_count": data.get("page_count"),
                "chunk_count": data.get("chunk_count"),
                "company_names": data.get("company_names"),
                "doc_year": data.get("doc_year"),
                "owner_id": data.get("owner_id"),
            })
    except NotFound:
        return []
    return results

# ----------------------------
# Delete Document
# ----------------------------
@router.delete("/{filename}")
def delete_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if os.path.exists(file_path):
        os.remove(file_path)

    try:
        db.collection("documents").document(filename).delete()
        for doc in db.collection("chunks").where(filter=FieldFilter("doc_id", "==", filename)).stream():
            doc.reference.delete()
    except NotFound:
        pass

    remaining = remove_document(filename)
    return {"message": f"{filename} deleted successfully", "remaining_vectors": remaining}

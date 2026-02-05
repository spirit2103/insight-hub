from fastapi import APIRouter, UploadFile, Depends
from app.auth.verify_token import verify_firebase_token
from app.config.firebase import db, bucket
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile,
    user_id: str = Depends(verify_firebase_token)
):
    doc_id = str(uuid.uuid4())

    blob = bucket.blob(f"users/{user_id}/{doc_id}/{file.filename}")
    blob.upload_from_file(file.file)

    db.collection("documents").document(doc_id).set({
        "user_id": user_id,
        "filename": file.filename,
        "status": "uploaded"
    })

    return {"doc_id": doc_id, "status": "uploaded"}

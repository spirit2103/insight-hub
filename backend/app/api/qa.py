from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.rag import rag_answer

router = APIRouter()

class QARequest(BaseModel):
    question: str
    documentId: str | None = None

@router.post("/qa")
def qa(payload: QARequest):
    result = rag_answer(payload.question, payload.documentId)
    return result

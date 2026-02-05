from fastapi import APIRouter
from app.vector_store.faiss_index import index, metadata_store

router = APIRouter(prefix="/debug", tags=["Debug"])

@router.get("/vector-count")
def vector_count():
    return {
        "faiss_vectors": int(index.ntotal),
        "metadata_entries": len(metadata_store),
    }

import logging
import re
from collections import Counter
from app.processing.parser import extract_text
from app.processing.chunker import chunk_text
from app.ai.embeddings import embed
from app.vector_store.faiss_index import add_embedding, save_index
from app.config.firebase import db
from google.cloud.firestore_v1 import FieldFilter
from google.api_core.exceptions import NotFound

logger = logging.getLogger("uvicorn.error")

def process_document(doc_id, pdf_path):
    logger.info("Processing document %s at %s", doc_id, pdf_path)
    pages = extract_text(pdf_path)
    chunks = chunk_text(pages)
    logger.info("Extracted %s pages and %s chunks", len(pages), len(chunks))

    if not chunks:
        raise RuntimeError("No text extracted from PDF")

    # Basic metadata extraction
    full_text = "\n".join([p.get("text", "") for p in pages[:2]]).strip()
    year_candidates = re.findall(r"\b(19|20)\d{2}\b", full_text)
    doc_year = None
    if year_candidates:
        year_counts = Counter(year_candidates)
        doc_year = int(year_counts.most_common(1)[0][0])

    company_candidates = re.findall(r"\b[A-Z][A-Za-z&]*(?:\s+[A-Z][A-Za-z&]*){0,3}\b", full_text)
    company_candidates = [
        c.strip()
        for c in company_candidates
        if len(c.split()) >= 2 or "&" in c
    ]
    company_counts = Counter(company_candidates)
    company_names = [name for name, _ in company_counts.most_common(5)]

    try:
        # Remove any existing chunks for this document to avoid duplicates
        for doc in db.collection("chunks").where(filter=FieldFilter("doc_id", "==", doc_id)).stream():
            doc.reference.delete()
    except NotFound:
        pass

    for c in chunks:
        emb = embed(c["text"])
        faiss_index = add_embedding(emb, {
            "doc_id": doc_id,
            "text": c["text"],
            "page": c["page"],
        })

        try:
            db.collection("chunks").add({
                "doc_id": doc_id,
                "text": c["text"],
                "page": c["page"],
                "faiss_index": int(faiss_index),
            })
        except NotFound:
            # Firestore not initialized for this project
            pass

    try:
        db.collection("documents").document(doc_id).set({
            "status": "completed",
            "page_count": len(pages),
            "chunk_count": len(chunks),
            "doc_year": doc_year,
            "company_names": company_names,
        }, merge=True)
    except NotFound:
        pass

    save_index()

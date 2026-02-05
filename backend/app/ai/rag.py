from typing import Any, Dict, List, Tuple
import logging
import numpy as np
from app.ai.embeddings import embed
from app.vector_store.faiss_index import search, metadata_store, embedding_store
from app.ai.groq_client import ask_groq

logger = logging.getLogger("uvicorn.error")

def _build_context_and_evidence(
    indices: List[int],
    document_id: str | None = None
) -> Tuple[str, List[Dict[str, Any]]]:
    evidence: List[Dict[str, Any]] = []
    for i in indices:
        if i < 0 or i >= len(metadata_store):
            continue
        meta = metadata_store[i]
        if document_id and meta.get("doc_id") != document_id:
            continue
        snippet = (meta.get("text") or "").strip()
        if snippet:
            snippet = snippet[:300]
        evidence.append({
            "documentName": meta.get("doc_id"),
            "pageNumber": meta.get("page"),
            "snippet": snippet,
        })

    context = "\n".join([e["snippet"] for e in evidence if e.get("snippet")])
    return context, evidence

def rag_answer(question: str, document_id: str | None = None) -> Dict[str, Any]:
    if not metadata_store:
        return {
            "answer": "No processed documents found yet. Please upload a PDF and wait for processing to complete.",
            "confidence": "low",
            "evidence": [],
        }

    q_emb = embed(question)

    if document_id:
        doc_indices = [i for i, meta in enumerate(metadata_store) if meta.get("doc_id") == document_id]
        if doc_indices:
            emb_matrix = np.array([embedding_store[i] for i in doc_indices if i < len(embedding_store)])
            if emb_matrix.size == 0:
                # Fallback if embeddings aren't stored; use first few chunks of the doc
                indices_list = doc_indices[:5]
            else:
                q_vec = np.array(q_emb)
                dists = np.sum((emb_matrix - q_vec) ** 2, axis=1)
                top_k = min(5, len(doc_indices))
                top_local = np.argsort(dists)[:top_k]
                indices_list = [doc_indices[i] for i in top_local.tolist()]
        else:
            indices_list = []
    else:
        _, indices = search(q_emb, k=5)
        indices_list = indices[0].tolist()

    context, evidence = _build_context_and_evidence(indices_list, document_id)

    if document_id and not context:
        logger.warning("No context for document_id %s. Falling back to global context.", document_id)
        context, evidence = _build_context_and_evidence(indices_list, None)

    if not context:
        return {
            "answer": "No relevant context found for that question. Try another question or select a different document.",
            "confidence": "low",
            "evidence": [],
        }

    prompt = f"""
    Answer using only the context below.
    Context:
    {context}

    Question: {question}
    """

    try:
        answer = ask_groq(prompt)
    except Exception as e:
        logger.exception("RAG generation failed")
        answer = "I couldn't generate an answer right now. Please try again."

    confidence = "medium" if evidence else "low"
    return {
        "answer": answer,
        "confidence": confidence,
        "evidence": evidence,
    }

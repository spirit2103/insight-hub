import faiss
import numpy as np
import os
import json
from typing import Any, Dict, List, Tuple

index = faiss.IndexFlatL2(384)
metadata_store: List[Dict[str, Any]] = []
embedding_store: List[List[float]] = []

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
INDEX_PATH = os.path.join(BASE_DIR, "vector_store", "faiss.index")
META_PATH = os.path.join(BASE_DIR, "vector_store", "faiss_meta.json")

def load_index() -> None:
    global index, metadata_store, embedding_store
    if os.path.exists(INDEX_PATH):
        index = faiss.read_index(INDEX_PATH)
    if os.path.exists(META_PATH):
        with open(META_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                # Backward compatibility with older metadata-only format
                metadata_store = data
                embedding_store = []
            else:
                metadata_store = data.get("metadata", [])
                embedding_store = data.get("embeddings", [])

def save_index() -> None:
    os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "metadata": metadata_store,
            "embeddings": embedding_store,
        }, f, indent=2)

def add_embedding(embedding, metadata: Dict[str, Any]) -> int:
    index.add(np.array([embedding]))
    metadata_store.append(metadata)
    embedding_store.append(embedding.tolist() if hasattr(embedding, "tolist") else list(embedding))
    return len(metadata_store) - 1

def search(query_embedding, k: int = 5) -> Tuple[np.ndarray, np.ndarray]:
    return index.search(np.array([query_embedding]), k)

def remove_document(doc_id: str) -> int:
    global index, metadata_store, embedding_store
    kept_embeddings: List[List[float]] = []
    kept_metadata: List[Dict[str, Any]] = []

    for emb, meta in zip(embedding_store, metadata_store):
        if meta.get("doc_id") != doc_id:
            kept_embeddings.append(emb)
            kept_metadata.append(meta)

    embedding_store = kept_embeddings
    metadata_store = kept_metadata

    index = faiss.IndexFlatL2(384)
    if embedding_store:
        index.add(np.array(embedding_store))

    save_index()
    return len(embedding_store)

# Load persisted index on import (if present)
load_index()

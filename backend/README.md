# Insight Hub Backend

FastAPI backend for Insight Hub (DocuMind). Handles document uploads, processing, metadata, vector search, and AI Q&A. Integrates with Firebase Auth + Firestore + Storage and uses a local FAISS index for retrieval.

**Key Capabilities**
- Upload and process documents (PDF/DOCX, OCR for images, table extraction).
- Generate embeddings and store vectors in FAISS.
- Store metadata and chunks in Firestore.
- RAG Q&A via Groq API with evidence snippets.
- Charts data (keyword frequency + mentions over time).

**Tech Stack**
- FastAPI, Uvicorn
- firebase-admin (Auth, Firestore, Storage)
- sentence-transformers + FAISS
- PyMuPDF, pdfplumber, pytesseract, pdf2image, Pillow

**Environment Variables**
Create or update `insight-hub/backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT=path\to\firebase_service_account.json
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**Setup**
```powershell
cd insight-hub\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Run the API:
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Endpoints**
- `GET /` health
- `POST /documents/upload` upload a file and start background processing
- `GET /documents/list` list documents
- `DELETE /documents/{filename}` delete document + vectors
- `GET /metadata/{filename}` fetch metadata
- `GET /metadata/list/all` list all metadata
- `GET /charts` keyword frequency and mentions over time
- `POST /qa` RAG Q&A
- `GET /debug/vector-count` FAISS index stats

**Local Data**
- Uploads are stored in `backend/uploads/`.
- FAISS index files live in `backend/app/vector_store/`.

**Notes**
- `.doc` support requires `textract` (not in `requirements.txt`); add it if you need legacy DOC processing.
- OCR requires Tesseract and Poppler installed and available on PATH.

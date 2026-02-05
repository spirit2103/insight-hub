# Insight Hub (DocuMind)

Insight Hub is a full-stack document intelligence app. Upload research documents, extract metadata, build a searchable vector index, visualize keyword trends, and ask questions with AI-backed answers. The system pairs a React dashboard with a FastAPI backend, Firebase for auth/storage/metadata, and a local FAISS index for retrieval.

**What’s Inside**
- `frontend`: Vite + React + TypeScript UI with Firebase Auth and a dashboard for uploads, metadata, charts, and Q&A.
- `backend`: FastAPI API with document processing, embeddings, FAISS vector search, and RAG Q&A.

**Core Features**
- Secure document uploads tied to Firebase Auth users.
- Background processing pipeline for PDF/DOCX, OCR for images, and table extraction.
- Automatic metadata (pages, chunks, year, company names).
- Keyword frequency and mentions over time charts.
- RAG Q&A with evidence snippets and page references.

**Tech Stack**
- Frontend: Vite, React, TypeScript, Tailwind, shadcn-ui, Framer Motion, Firebase Web SDK.
- Backend: FastAPI, Firestore/Storage (firebase-admin), FAISS, sentence-transformers, PyMuPDF, pdfplumber, pytesseract.

**Prerequisites**
- Node.js 18+ and npm
- Python 3.10+ (recommended)
- Firebase project with Auth, Firestore, and Storage enabled
- Groq API key for AI answers
- Tesseract installed and available on PATH
- Poppler installed for `pdf2image` (PDF OCR fallback)

**Quick Start**
1. Backend setup
```powershell
cd insight-hub\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create `insight-hub\backend\.env` (or update the existing one) with:
```env
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT=path\to\firebase_service_account.json
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

Run the API:
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Frontend setup
```powershell
cd insight-hub\frontend
npm install
```

Create `insight-hub\frontend\.env` (or update the existing one) with:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_API_BASE_URL=http://localhost:8000
```

Start the UI:
```powershell
npm run dev
```

Then visit `http://localhost:8080`.

**Project Structure**
- `backend/app/api`: REST endpoints (`/documents`, `/metadata`, `/charts`, `/qa`, `/debug`)
- `backend/app/processing`: extraction + OCR + chunking pipeline
- `backend/app/vector_store`: FAISS index and metadata persistence
- `backend/app/ai`: embeddings and Groq client
- `frontend/src/pages`: Landing, Auth, Dashboard
- `frontend/src/components`: dashboard widgets (upload, charts, QA)

**Notes**
- The backend stores the FAISS index in `backend/app/vector_store/faiss.index` and metadata in `faiss_meta.json`.
- The document list and metadata are read from Firestore collections `documents` and `chunks`.
- For local development, CORS is configured for `http://localhost:8080`.

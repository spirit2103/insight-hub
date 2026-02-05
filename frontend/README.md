# Insight Hub Frontend

React dashboard for Insight Hub (DocuMind). Handles authentication, document uploads, metadata display, charts, and Q&A. Communicates with the FastAPI backend and Firebase.

**What This App Does**
- User authentication with Firebase (email/password).
- Upload documents to the backend and view processing status.
- Visualize keyword and timeline insights.
- Ask questions over processed documents and see evidence.

**Tech Stack**
- Vite, React, TypeScript
- Tailwind CSS + shadcn-ui
- Firebase Web SDK
- TanStack Query, Axios, Recharts, Framer Motion

**Environment Variables**
Create or update `insight-hub/frontend/.env`:
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

**Setup**
```powershell
cd insight-hub\frontend
npm install
```

Run locally:
```powershell
npm run dev
```

The dev server runs at `http://localhost:8080`.

**Project Structure**
- `src/pages`: Landing, Sign In, Sign Up, Dashboard
- `src/components`: upload, charts, QA panel, layout
- `src/lib/api.ts`: backend API client
- `src/firebase.ts`: Firebase initialization

**Notes**
- The frontend expects a running backend at `VITE_API_BASE_URL`.
- Firebase Auth must be enabled in your Firebase project.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, documents, metadata, charts, qa, debug

app = FastAPI(title="InsightHub Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(documents.router)
app.include_router(metadata.router)
app.include_router(charts.router)
app.include_router(qa.router)
app.include_router(debug.router)

@app.get("/")
def health():
    return {"status": "Backend running"}

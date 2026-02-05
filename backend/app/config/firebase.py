import json
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, storage

load_dotenv()

def _load_service_account():
    service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if not service_account:
        raise RuntimeError("FIREBASE_SERVICE_ACCOUNT is not set")

    # If the env var looks like JSON, parse it directly
    if service_account.strip().startswith("{"):
        return json.loads(service_account)

    # Otherwise treat it as a file path
    return service_account

cred = credentials.Certificate(_load_service_account())

firebase_admin.initialize_app(cred, {
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")
})

db = firestore.client()
bucket = storage.bucket()

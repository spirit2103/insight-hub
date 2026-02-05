from firebase_admin import auth
from fastapi import Header, HTTPException

def verify_firebase_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401)

    token = authorization.split(" ")[1]
    decoded = auth.verify_id_token(token)
    return decoded["uid"]

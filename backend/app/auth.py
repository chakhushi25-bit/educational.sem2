import datetime
import os
import bcrypt
import jwt
from fastapi import Header, HTTPException

JWT_SECRET = os.environ.get("JWT_SECRET", "studysync_secure_jwt_secret_key_2026_x")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 30


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password"""
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        # Fallback for plain text match during testing/legacy seeds
        return plain_password == hashed_password


def create_access_token(user_id: str, email: str) -> str:
    """Generate JWT auth token"""
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=JWT_EXPIRATION_DAYS),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate JWT token"""
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")


def get_current_user_id_from_header(authorization: str | None = Header(None)) -> str:
    """Extract user_id from Authorization: Bearer <token> header, or return default user ID"""
    if not authorization:
        return "user-khushi"
    
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        token = parts[1]
        try:
            payload = decode_token(token)
            return payload.get("sub", "user-khushi")
        except Exception:
            return "user-khushi"
    
    return "user-khushi"

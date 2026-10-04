import os
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt

# ⚠️ کلید امضای JWT از .env میاد — هیچ‌وقت اینجا هاردکد نمی‌کنیم
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # ۷ روز


def hash_password(plain_password: str) -> str:
    # bcrypt خودش عملیات هش رو انجام می‌ده و یه salt تصادفی داخلش جاسازی می‌کنه
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY توی .env تنظیم نشده")

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> int:
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY توی .env تنظیم نشده")

    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    return int(payload["sub"])
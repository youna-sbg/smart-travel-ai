from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, LoginRequest, UserOut, Token
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # چک کن این ایمیل قبلاً ثبت نشده باشه
    existing = await db.execute(select(User).where(User.email == user_data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="این ایمیل قبلاً ثبت‌نام کرده")

    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        is_admin=False,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(new_user.id)
    return Token(access_token=token, user=UserOut.model_validate(new_user))


@router.post("/login", response_model=Token)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    # عمداً پیام یکسان برای «ایمیل نیست» و «پسورد اشتباهه» می‌دیم
    # تا کسی نتونه با امتحان کردن، بفهمه کدوم ایمیل‌ها توی سیستم ثبت‌نام کردن
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="ایمیل یا رمز عبور اشتباهه")

    token = create_access_token(user.id)
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models import User, UserFavorite, Place, PlaceFeature
from app.schemas import PlaceOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("/", response_model=List[PlaceOut])
async def list_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Place)
        .join(UserFavorite, UserFavorite.place_id == Place.id)
        .where(UserFavorite.user_id == current_user.id)
        .options(
            selectinload(Place.city),
            selectinload(Place.category),
            selectinload(Place.place_features).selectinload(PlaceFeature.feature),
        )
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{place_id}", status_code=201)
async def add_favorite(
    place_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # چک کن مکان وجود داره
    place_result = await db.execute(select(Place).where(Place.id == place_id))
    if not place_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="مکان پیدا نشد")

    # چک کن از قبل favorite نکرده باشه
    existing = await db.execute(
        select(UserFavorite).where(
            UserFavorite.user_id == current_user.id, UserFavorite.place_id == place_id
        )
    )
    if existing.scalar_one_or_none():
        return {"status": "already_favorited"}

    db.add(UserFavorite(user_id=current_user.id, place_id=place_id))
    await db.commit()
    return {"status": "added"}


@router.delete("/{place_id}", status_code=200)
async def remove_favorite(
    place_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserFavorite).where(
            UserFavorite.user_id == current_user.id, UserFavorite.place_id == place_id
        )
    )
    favorite = result.scalar_one_or_none()

    if not favorite:
        raise HTTPException(status_code=404, detail="این مکان توی لیست علاقه‌مندی‌هات نبود")

    await db.delete(favorite)
    await db.commit()
    return {"status": "removed"}

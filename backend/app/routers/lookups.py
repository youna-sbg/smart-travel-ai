from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models import City, Category, Feature
from app.schemas import CityOut, CategoryOut, FeatureOut

router = APIRouter(tags=["lookups"])


@router.get("/cities", response_model=List[CityOut])
async def list_cities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(City))
    return result.scalars().all()


@router.get("/categories", response_model=List[CategoryOut])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    return result.scalars().all()


@router.get("/features", response_model=List[FeatureOut])
async def list_features(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Feature))
    return result.scalars().all()

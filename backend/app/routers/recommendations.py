from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional, List

from app.database import get_db
from app.models import Place, PlaceFeature, Category
from app.schemas import RecommendationOut, PlaceOut
from app.utils import haversine_km
from app.services.ranking import rank_place

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/", response_model=List[RecommendationOut])
async def get_recommendations(
    lat: float = Query(..., description="عرض جغرافیایی موقعیت فعلی کاربر"),
    lng: float = Query(..., description="طول جغرافیایی موقعیت فعلی کاربر"),
    weather_code: Optional[int] = Query(
        None, description="کد آب‌وهوای فعلی (استاندارد WMO) — اگه ندی، این معیار خنثی حساب می‌شه"
    ),
    city_id: Optional[int] = Query(None, description="محدود کردن به یه شهر خاص"),
    category: Optional[str] = Query(
        None, description="دسته‌بندی ترجیحی کاربر (اسم انگلیسی، مثل Cafe)"
    ),
    feature_ids: Optional[str] = Query(
        None, description="شناسه فیچرهای مطلوب، جدا شده با کاما (مثلاً 1,3)"
    ),
    limit: int = Query(10, ge=1, le=50, description="تعداد نتایج برتر"),
    max_distance_km: Optional[float] = Query(
        None, description="حذف مکان‌های دورتر از این فاصله (اختیاری)"
    ),
    db: AsyncSession = Depends(get_db),
):
    """
    مکان‌ها رو بر اساس ترکیبی از فاصله، تناسب با آب‌وهوا، فیچرها، دسته‌بندی،
    و کامل بودن اطلاعات رتبه‌بندی می‌کنه و بهترین‌ها رو برمی‌گردونه.
    """
    # تبدیل رشته "1,3" به مجموعه {1, 3}
    preferred_feature_ids = None
    if feature_ids:
        try:
            preferred_feature_ids = {int(fid.strip()) for fid in feature_ids.split(",") if fid.strip()}
        except ValueError:
            preferred_feature_ids = None

    query = select(Place).options(
        selectinload(Place.city),
        selectinload(Place.category),
        selectinload(Place.place_features).selectinload(PlaceFeature.feature),
    ).where(Place.is_active == True)  # noqa: E712 — مکان‌های غیرفعال هیچ‌وقت پیشنهاد نمی‌شن

    if city_id:
        query = query.where(Place.city_id == city_id)

    result = await db.execute(query)
    places = result.scalars().all()

    scored = []
    for place in places:
        if place.latitude is None or place.longitude is None:
            continue

        distance = haversine_km(lat, lng, float(place.latitude), float(place.longitude))

        if max_distance_km is not None and distance > max_distance_km:
            continue

        score, reasons, breakdown = rank_place(
            place=place,
            distance_km=distance,
            weather_code=weather_code,
            preferred_feature_ids=preferred_feature_ids,
            preferred_category_name=category,
        )

        scored.append(
            RecommendationOut(
                place=PlaceOut.model_validate(place),
                score=score,
                distance_km=round(distance, 1),
                reasons=reasons,
                breakdown=breakdown,
            )
        )

    scored.sort(key=lambda item: item.score, reverse=True)
    return scored[:limit]

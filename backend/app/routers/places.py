from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional, List

from app.database import get_db
from app.models import Place, PlaceFeature, User
from app.schemas import PlaceOut, PlaceCreate, PlaceUpdate, PlaceFeatureCreate, PlaceFeatureOut
from app.utils import haversine_km
from app.dependencies import get_current_admin_user

router = APIRouter(prefix="/places", tags=["places"])


def _place_query():
    return select(Place).options(
        selectinload(Place.city),
        selectinload(Place.category),
        selectinload(Place.place_features).selectinload(PlaceFeature.feature),
    )


@router.get("/", response_model=List[PlaceOut])
async def list_places(
    city_id: Optional[int] = Query(None, description="فیلتر بر اساس شهر"),
    category_id: Optional[int] = Query(None, description="فیلتر بر اساس دسته‌بندی"),
    db: AsyncSession = Depends(get_db),
):
    # این endpoint عمومیه (برای خود سایت) — فقط مکان‌های فعال رو نشون می‌ده
    query = _place_query().where(Place.is_active == True)  # noqa: E712

    if city_id:
        query = query.where(Place.city_id == city_id)
    if category_id:
        query = query.where(Place.category_id == category_id)

    result = await db.execute(query)
    return result.scalars().all()


# نکته: این endpointها باید قبل از "/{place_id}" ثبت بشن، وگرنه FastAPI
# رشته "nearby" یا "admin" رو به‌عنوان یه place_id (عدد) در نظر می‌گیره و خطا می‌ده
@router.get("/nearby", response_model=List[PlaceOut])
async def nearby_places(
    lat: float = Query(..., description="عرض جغرافیایی موقعیت فعلی کاربر"),
    lng: float = Query(..., description="طول جغرافیایی موقعیت فعلی کاربر"),
    city_id: Optional[int] = Query(None, description="فیلتر بر اساس شهر"),
    category_id: Optional[int] = Query(None, description="فیلتر بر اساس دسته‌بندی"),
    limit: Optional[int] = Query(None, description="حداکثر تعداد نتایج (اختیاری)"),
    db: AsyncSession = Depends(get_db),
):
    query = _place_query().where(Place.is_active == True)  # noqa: E712

    if city_id:
        query = query.where(Place.city_id == city_id)
    if category_id:
        query = query.where(Place.category_id == category_id)

    result = await db.execute(query)
    places = result.scalars().all()

    places_with_distance = []
    for place in places:
        if place.latitude is None or place.longitude is None:
            continue

        distance = haversine_km(lat, lng, float(place.latitude), float(place.longitude))

        place_out = PlaceOut.model_validate(place)
        place_out.distance_km = round(distance, 1)
        places_with_distance.append(place_out)

    places_with_distance.sort(key=lambda p: p.distance_km)

    if limit:
        places_with_distance = places_with_distance[:limit]

    return places_with_distance


@router.get("/admin/all", response_model=List[PlaceOut])
async def list_all_places_for_admin(
    city_id: Optional[int] = Query(None, description="فیلتر بر اساس شهر"),
    category_id: Optional[int] = Query(None, description="فیلتر بر اساس دسته‌بندی"),
    review_status: Optional[str] = Query(
        None, description="فیلتر بر اساس وضعیت بررسی: osm_imported, needs_review, reviewed"
    ),
    is_active: Optional[bool] = Query(None, description="فیلتر بر اساس فعال/غیرفعال بودن"),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    """
    برخلاف GET /places/ عادی، این endpoint همه مکان‌ها رو برمی‌گردونه
    (چه فعال چه غیرفعال) — فقط برای پنل مدیریت ادمینه.
    """
    query = _place_query()

    if city_id:
        query = query.where(Place.city_id == city_id)
    if category_id:
        query = query.where(Place.category_id == category_id)
    if review_status:
        query = query.where(Place.review_status == review_status)
    if is_active is not None:
        query = query.where(Place.is_active == is_active)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{place_id}", response_model=PlaceOut)
async def get_place(place_id: int, db: AsyncSession = Depends(get_db)):
    query = _place_query().where(Place.id == place_id)

    result = await db.execute(query)
    place = result.scalar_one_or_none()

    if not place:
        raise HTTPException(status_code=404, detail="مکان پیدا نشد")

    return place


# ⚠️ از این به بعد، این عملیات‌ها فقط برای ادمین مجازن


@router.post("/", response_model=PlaceOut, status_code=201)
async def create_place(
    place: PlaceCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    new_place = Place(**place.model_dump())
    db.add(new_place)
    await db.commit()

    query = _place_query().where(Place.id == new_place.id)
    result = await db.execute(query)
    return result.scalar_one()


@router.put("/{place_id}", response_model=PlaceOut)
async def update_place(
    place_id: int,
    updates: PlaceUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()

    if not place:
        raise HTTPException(status_code=404, detail="مکان پیدا نشد")

    # فقط فیلدهایی که واقعاً توی درخواست اومدن رو آپدیت کن
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(place, field, value)

    await db.commit()

    query = _place_query().where(Place.id == place_id)
    result = await db.execute(query)
    return result.scalar_one()


@router.post("/{place_id}/features", response_model=PlaceOut, status_code=201)
async def add_feature_to_place(
    place_id: int,
    feature: PlaceFeatureCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
):
    place_result = await db.execute(select(Place).where(Place.id == place_id))
    if not place_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="مکان پیدا نشد")

    new_link = PlaceFeature(
        place_id=place_id, feature_id=feature.feature_id, value=feature.value
    )
    db.add(new_link)
    await db.commit()

    query = _place_query().where(Place.id == place_id)
    result = await db.execute(query)
    return result.scalar_one()

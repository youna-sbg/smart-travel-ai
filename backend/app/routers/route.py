import os
import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/route", tags=["route"])

NESHAN_ROUTING_KEY = os.getenv("NESHAN_ROUTING_KEY")


class RouteResponse(BaseModel):
    duration_minutes: float
    distance_km: float
    polyline: str  # همون فرمت encoded که فرانت‌اند با تابع decodePolyline خودش بازش می‌کنه


@router.get("/", response_model=RouteResponse)
async def get_route(
    origin_lat: float = Query(..., description="عرض جغرافیایی مبدأ"),
    origin_lng: float = Query(..., description="طول جغرافیایی مبدأ"),
    destination_lat: float = Query(..., description="عرض جغرافیایی مقصد"),
    destination_lng: float = Query(..., description="طول جغرافیایی مقصد"),
):
    if not NESHAN_ROUTING_KEY:
        raise HTTPException(
            status_code=500,
            detail="NESHAN_ROUTING_KEY توی .env تنظیم نشده",
        )

    url = "https://api.neshan.org/v4/direction"
    params = {
        "type": "car",
        "origin": f"{origin_lat},{origin_lng}",
        "destination": f"{destination_lat},{destination_lng}",
    }
    headers = {"Api-Key": NESHAN_ROUTING_KEY}

    # trust_env=False یعنی httpx متغیرهای محیطی مثل SSL_CERT_FILE رو نادیده بگیره
    # و از گواهی‌های پیش‌فرض خودش استفاده کنه (برای رفع مشکل فایل گواهی خراب/گمشده روی ویندوز)
    async with httpx.AsyncClient(trust_env=False) as client:
        response = await client.get(url, params=params, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"خطا از سرویس نشان: {response.text}",
        )

    data = response.json()
    routes = data.get("routes")

    if not routes:
        raise HTTPException(status_code=404, detail="مسیری پیدا نشد")

    route = routes[0]
    leg = route["legs"][0]

    return RouteResponse(
        duration_minutes=round(leg["duration"]["value"] / 60),
        distance_km=round(leg["distance"]["value"] / 1000, 1),
        polyline=route["overview_polyline"]["points"],
    )
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional, List, Dict
from datetime import datetime


class CityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    province: str


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class FeatureOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class PlaceFeatureOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    value: int
    feature: FeatureOut


class PlaceFeatureCreate(BaseModel):
    feature_id: int
    value: int


class PlaceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: int
    name: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    opening_hours: Optional[str] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    city: CityOut
    category: CategoryOut
    place_features: List[PlaceFeatureOut] = Field(default=[], validation_alias="place_features", serialization_alias="features")
    distance_km: Optional[float] = None
    is_active: bool = True
    review_status: str = "osm_imported"


class PlaceCreate(BaseModel):
    city_id: int
    category_id: int
    name: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    opening_hours: Optional[str] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    # وقتی ادمین دستی از فرم وارد می‌کنه، فرض می‌کنیم خودش قبلاً بررسی کرده
    review_status: str = "reviewed"


class PlaceUpdate(BaseModel):
    """
    برای ویرایش یه مکان موجود — همه فیلدها اختیاری‌ان،
    فقط چیزی که واقعاً می‌خوای عوض کنی رو بفرست
    """
    name: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    opening_hours: Optional[str] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    city_id: Optional[int] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None
    review_status: Optional[str] = None


# ==========================================
# Authentication
# ==========================================

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="حداقل ۸ کاراکتر")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    is_admin: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ==========================================
# Favorites
# ==========================================

class FavoriteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    place: PlaceOut


# ==========================================
# Recommendations (Ranking Engine)
# ==========================================

class RecommendationOut(BaseModel):
    place: PlaceOut
    score: float
    distance_km: float
    reasons: List[str] = []
    breakdown: Dict[str, float] = {}

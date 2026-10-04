"""
==========================================
services/ranking.py — موتور رتبه‌بندی مکان‌ها

طراحی این ماژول عمداً از لایه API جداست، تا بعداً بشه هر کدوم از
تابع‌های امتیازدهی رو با یه مدل ML جایگزین کرد، بدون دست زدن به بقیه سیستم.

ساختار:
    هر معیار یه تابع جدا داره که یه عدد بین ۰ تا ۱ برمی‌گردونه (نرمال‌شده)،
    به‌علاوه یه «دلیل» متنی اگه امتیازش قابل‌توجه بود.
    بعد وزن‌ها روی این اعداد اعمال می‌شن.
==========================================
"""

from typing import Optional

# ==========================================
# وزن معیارها (مجموعاً ۱.۰)
# این‌ها فعلاً بر اساس قضاوت اولیه‌ان؛ وقتی داده رفتار واقعی کاربر جمع شد،
# می‌شه با تحلیل داده تنظیمشون کرد یا کلاً با مدل ML جایگزینشون کرد.
# ==========================================
WEIGHTS = {
    "distance": 0.30,
    "weather": 0.25,
    "feature": 0.25,
    "category": 0.10,
    "data_quality": 0.10,
}

# دسته‌بندی‌های سرپوشیده (هوای بد بهشون آسیب نمی‌زنه)
INDOOR_CATEGORIES = {"Restaurant", "Cafe", "Hotel", "Museum", "Shopping"}

# دسته‌بندی‌های فضای باز (هوای بد براشون نامناسبه)
OUTDOOR_CATEGORIES = {"Forest", "Beach", "Park", "Waterfall"}

# کدهای آب‌وهوای WMO که یعنی هوا برای فضای باز بد است
BAD_WEATHER_CODES = {
    51, 53, 55,            # نم‌نم باران
    61, 63, 65, 80, 81, 82,  # بارانی
    71, 73, 75, 77,        # برفی
    95, 96, 99,            # طوفانی
}

# هوای کاملاً مطلوب برای فضای باز
GOOD_WEATHER_CODES = {0, 1, 2}


def score_distance(distance_km: Optional[float], max_useful_km: float = 15.0):
    """
    هرچی نزدیک‌تر، امتیاز بیشتر. بعد از max_useful_km امتیاز به صفر میل می‌کنه.
    """
    if distance_km is None:
        return 0.5, None  # فاصله نامعلوم: امتیاز خنثی

    if distance_km >= max_useful_km:
        return 0.0, None

    score = 1.0 - (distance_km / max_useful_km)

    reason = None
    if distance_km <= 2:
        reason = "خیلی نزدیک به شما"
    elif distance_km <= 5:
        reason = "نزدیک به شما"

    return score, reason


def score_weather(category_name: str, weather_code: Optional[int]):
    """
    تناسب دسته‌بندی مکان با آب‌وهوای فعلی.
    """
    if weather_code is None:
        return 0.5, None  # آب‌وهوا نامعلوم: امتیاز خنثی

    is_outdoor = category_name in OUTDOOR_CATEGORIES
    is_indoor = category_name in INDOOR_CATEGORIES
    is_bad_weather = weather_code in BAD_WEATHER_CODES
    is_good_weather = weather_code in GOOD_WEATHER_CODES

    if is_bad_weather:
        if is_indoor:
            return 1.0, "مناسب برای هوای فعلی (سرپوشیده)"
        if is_outdoor:
            return 0.1, "هوای فعلی برای فضای باز مناسب نیست"

    if is_good_weather and is_outdoor:
        return 1.0, "هوا برای فضای باز عالیه"

    return 0.6, None  # حالت‌های میانی (مثلاً ابری)


def score_features(place_features: list, preferred_feature_ids: Optional[set] = None):
    """
    دو بخش داره:
      ۱. اگه کاربر فیچر خاصی خواسته (مثلاً پارکینگ)، تطابق باهاش
      ۲. اگه نخواسته، کیفیت کلی فیچرهای ثبت‌شده

    خروجی سوم (has_data) می‌گه آیا اصلاً فیچری ثبت شده یا نه —
    این برای تنظیم وزن‌ها لازمه، چون اکثر مکان‌های وارد‌شده از OSM هنوز فیچر ندارن.
    """
    if not place_features:
        return 0.0, None, False  # هیچ فیچری ثبت نشده

    if preferred_feature_ids:
        matched = [pf for pf in place_features if pf.feature_id in preferred_feature_ids]
        if not matched:
            return 0.0, None, True

        # میانگین نمره فیچرهای مطلوب کاربر (هر کدوم ۰ تا ۱۰ هستن)
        avg = sum(pf.value for pf in matched) / len(matched) / 10.0
        names = "، ".join(pf.feature.name for pf in matched)
        return avg, f"دارای {names}", True

    # کاربر ترجیح خاصی نداده: میانگین کلی فیچرها
    avg = sum(pf.value for pf in place_features) / len(place_features) / 10.0
    return avg, None, True


def score_category(category_name: str, preferred_category_name: Optional[str]):
    """اگه کاربر دسته‌بندی خاصی خواسته باشه، تطابق باهاش"""
    if not preferred_category_name:
        return 0.5, None  # ترجیحی نداده: خنثی

    if category_name == preferred_category_name:
        return 1.0, f"از دسته‌بندی مورد نظر شما ({category_name})"

    return 0.0, None


def score_data_quality(place):
    """
    هرچی اطلاعات مکان کامل‌تر باشه، قابل‌اعتمادتره.
    این معیار باعث می‌شه مکان‌هایی که فقط یه اسم خشک دارن، بالای لیست نیفتن.
    """
    fields = [place.description, place.address, place.phone, place.opening_hours]
    filled = sum(1 for f in fields if f)
    score = filled / len(fields)

    reason = "اطلاعات کامل" if filled >= 3 else None
    return score, reason


def rank_place(place, distance_km, weather_code, preferred_feature_ids, preferred_category_name):
    """
    امتیاز نهایی یه مکان رو حساب می‌کنه و دلایلش رو برمی‌گردونه.

    نکته مهم درباره وزن‌دهی:
        چون اکثر مکان‌های فعلی (که خودکار از OSM اومدن) هنوز فیچر ثبت‌شده ندارن،
        اگه وزن feature رو کورکورانه اعمال کنیم، همه‌شون ناعادلانه ته لیست می‌افتن.
        برای همین اگه مکانی فیچر نداره، وزن اون معیار رو بین بقیه معیارها پخش می‌کنیم.
    """
    category_name = place.category.name

    dist_score, dist_reason = score_distance(distance_km)
    weather_score, weather_reason = score_weather(category_name, weather_code)
    feature_score, feature_reason, has_feature_data = score_features(
        place.place_features, preferred_feature_ids
    )
    category_score, category_reason = score_category(category_name, preferred_category_name)
    quality_score, quality_reason = score_data_quality(place)

    weights = dict(WEIGHTS)

    # اگه فیچری ثبت نشده، وزنش رو بین بقیه پخش کن
    if not has_feature_data:
        redistributed = weights.pop("feature")
        total_remaining = sum(weights.values())
        for key in weights:
            weights[key] += redistributed * (weights[key] / total_remaining)
        feature_score = 0.0

    total = (
        dist_score * weights.get("distance", 0)
        + weather_score * weights.get("weather", 0)
        + feature_score * weights.get("feature", 0)
        + category_score * weights.get("category", 0)
        + quality_score * weights.get("data_quality", 0)
    )

    reasons = [r for r in [dist_reason, weather_reason, feature_reason, category_reason, quality_reason] if r]

    # ریز امتیازها رو هم برمی‌گردونیم — هم برای شفافیت، هم برای دیباگ، هم به‌عنوان
    # همون feature vector ی که بعداً ورودی مدل ML می‌شه
    breakdown = {
        "distance": round(dist_score, 3),
        "weather": round(weather_score, 3),
        "feature": round(feature_score, 3),
        "category": round(category_score, 3),
        "data_quality": round(quality_score, 3),
    }

    return round(total * 100, 1), reasons, breakdown

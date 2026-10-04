import math


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    فاصله واقعی جغرافیایی بین دو نقطه رو به کیلومتر حساب می‌کنه
    (فرمول Haversine — دقیق‌تر از فاصله اقلیدسی ساده روی مختصات خام)
    """
    R = 6371.0  # شعاع زمین به کیلومتر

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

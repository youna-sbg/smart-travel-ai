# این اسکریپت همه‌ی مکان‌های واقعی رو یه‌جا از طریق API وارد دیتابیس می‌کنه
# قبل از اجرا مطمئن شو:
#   1. uvicorn داره روی پورت 8001 اجرا می‌شه
#   2. کتابخونه requests نصبه (اگه نیست: pip install requests)

import requests

BASE_URL = "http://127.0.0.1:8001"

# نگاشت اسم شهر و دسته‌بندی به همون id هایی که توی seed.sql ساختیم
CITY_IDS = {
    "بابل": 1,
    "بابلسر": 2,
    "ساری": 3,
}

CATEGORY_IDS = {
    "رستوران": 1,
    "کافه": 2,
    "جنگل": 3,
    "ساحل": 4,
    "هتل": 5,
    "پارک": 6,
    "موزه": 7,
    "مرکز خرید": 8,
    "آبشار": 9,
}

# لیست مکان‌های واقعی: (اسم, شهر, دسته‌بندی, latitude, longitude, توضیح اختیاری)
PLACES = [
    ("رومانو", "بابل", "رستوران", 36.55344648032536, 52.67731558235975, None),
    ("لیلیوم", "بابل", "کافه", 36.55265216543914, 52.67496158229263, None),
    ("واج", "بابل", "کافه", 36.597017788595096, 52.676183893212304, None),
    ("حوریا", "بابل", "رستوران", 36.556139640082804, 52.67878516474054, None),
    ("میزبان", "بابلسر", "رستوران", 36.69628762877816, 52.65048033624158, None),
    ("مهرماه", "بابلسر", "رستوران", 36.705896882126474, 52.65098652356233, None),
    ("ماتیسا", "بابلسر", "کافه", 36.710315647091434, 52.63820219813467, None),
    ("اکبرجوجه", "بابلسر", "رستوران", 36.697160890775535, 52.63118485358097, None),
    ("طوفان", "بابلسر", "کافه", 36.70493049989606, 52.614109420385525, "کافه ساحلی"),
    ("برج ساعت", "بابلسر", "هتل", 36.70393404880743, 52.64646818831055, None),
    ("نواب", "بابلسر", "ساحل", 36.71456498878062, 52.670479322335666, None),
    ("پارک کارگر", "ساری", "پارک", 36.567875283154436, 53.0527798718113, None),
    ("گیلانه", "ساری", "رستوران", 36.56094699923056, 53.062178331730905, None),
    ("پارک ولایت", "ساری", "پارک", 36.559223449008215, 53.05810137423154, None),
    ("پوپو", "ساری", "رستوران", 36.56051611527958, 53.044990737220395, None),
    ("برگر کمپانی", "ساری", "رستوران", 36.55841143573217, 53.07905289863954, None),
]


def get_existing_keys():
    """ترکیب (اسم, شهر) مکان‌هایی که از قبل توی دیتابیس هستن رو می‌گیره تا دوباره اضافه نشن"""
    try:
        response = requests.get(f"{BASE_URL}/places/")
        response.raise_for_status()
        return {(place["name"], place["city"]["id"]) for place in response.json()}
    except requests.exceptions.ConnectionError:
        print("❌ نمی‌تونم به بک‌اند وصل بشم. مطمئن شو uvicorn روی پورت 8001 اجراست.")
        return None


def main():
    existing_keys = get_existing_keys()
    if existing_keys is None:
        return

    success_count = 0
    skip_count = 0
    fail_count = 0

    for name, city_name, category_name, lat, lng, description in PLACES:
        city_id = CITY_IDS[city_name]
        key = (name, city_id)

        if key in existing_keys:
            print(f"⏭️  رد شد (قبلاً هست): {name} ({city_name})")
            skip_count += 1
            continue

        payload = {
            "city_id": city_id,
            "category_id": CATEGORY_IDS[category_name],
            "name": name,
            "description": description,
            "latitude": lat,
            "longitude": lng,
        }

        try:
            response = requests.post(f"{BASE_URL}/places/", json=payload)
            if response.status_code == 201:
                print(f"✅ اضافه شد: {name} ({city_name} - {category_name})")
                success_count += 1
            else:
                print(f"❌ خطا برای {name}: کد {response.status_code} - {response.text}")
                fail_count += 1
        except requests.exceptions.ConnectionError:
            print("❌ نمی‌تونم به بک‌اند وصل بشم. مطمئن شو uvicorn روی پورت 8001 اجراست.")
            return

    print(f"\nنتیجه نهایی: {success_count} مورد جدید اضافه شد، {skip_count} مورد تکراری رد شد، {fail_count} مورد خطا داد")


if __name__ == "__main__":
    main()

# ==========================================
# import_from_osm.py
# جمع‌آوری خودکار مکان‌ها (رستوران، کافه، هتل، ...) از OpenStreetMap
# با استفاده از Overpass API (رایگان، بدون نیاز به کلید)
# و وارد کردن خودکارشون به دیتابیس از طریق بک‌اند (با لاگین ادمین)
# ==========================================

import requests
import getpass

BACKEND_URL = "http://127.0.0.1:8001"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# مرکز تقریبی هر شهر + شعاع جستجو (به متر)
CITIES = {
    "بابل": {"id": 1, "lat": 36.5512, "lng": 52.6789, "radius": 6000},
    "بابلسر": {"id": 2, "lat": 36.7000, "lng": 52.6570, "radius": 5000},
    "ساری": {"id": 3, "lat": 36.5633, "lng": 53.0601, "radius": 8000},
}

# نگاشت بین تگ‌های OSM و category_id های خودمون (طبق seed.sql)
OSM_TAG_TO_CATEGORY = {
    ("amenity", "restaurant"): 1,  # Restaurant
    ("amenity", "cafe"): 2,        # Cafe
    ("natural", "wood"): 3,        # Forest
    ("landuse", "forest"): 3,      # Forest
    ("natural", "beach"): 4,       # Beach
    ("tourism", "hotel"): 5,       # Hotel
    ("leisure", "park"): 6,        # Park
    ("tourism", "museum"): 7,      # Museum
    ("shop", "mall"): 8,           # Shopping
    ("waterway", "waterfall"): 9,  # Waterfall
    ("natural", "waterfall"): 9,   # Waterfall
}

CATEGORY_NAMES = {
    1: "رستوران", 2: "کافه", 3: "جنگل", 4: "ساحل", 5: "هتل",
    6: "پارک", 7: "موزه", 8: "مرکز خرید", 9: "آبشار",
}


def build_overpass_query(lat, lng, radius):
    """یه کوئری Overpass QL می‌سازه که همه تگ‌های مورد نظر رو دور یه نقطه جستجو می‌کنه"""
    filters = []
    for (osm_key, osm_value) in OSM_TAG_TO_CATEGORY.keys():
        filters.append(f'  node["{osm_key}"="{osm_value}"](around:{radius},{lat},{lng});')
        filters.append(f'  way["{osm_key}"="{osm_value}"](around:{radius},{lat},{lng});')

    query = f"""
    [out:json][timeout:60];
    (
    {chr(10).join(filters)}
    );
    out center;
    """
    return query


def fetch_osm_places(city_name, city_info):
    print(f"\n🔍 در حال جستجوی مکان‌ها در {city_name}...")
    query = build_overpass_query(city_info["lat"], city_info["lng"], city_info["radius"])
    headers = {"User-Agent": "SmartTravelAI-DataImport/1.0 (personal project)"}

    # اگه سرور اصلی جواب نداد، این آینه‌ها رو هم امتحان کن
    mirrors = [
        OVERPASS_URL,
        "https://overpass.kumi.systems/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
    ]

    last_error = None
    for mirror_url in mirrors:
        try:
            response = requests.post(mirror_url, data={"data": query}, headers=headers, timeout=90)
            response.raise_for_status()
            data = response.json()
            break
        except requests.exceptions.RequestException as err:
            last_error = err
            print(f"   ⚠️ سرور {mirror_url} جواب نداد، امتحان بعدی...")
            continue
    else:
        raise last_error

    places = []
    for element in data.get("elements", []):
        tags = element.get("tags", {})
        name = tags.get("name")
        if not name:
            continue  # مکان‌های بدون اسم رو رد کن، ارزش وارد کردن ندارن

        # مختصات: node مستقیم lat/lon داره، way مرکزش رو از "center" می‌گیریم
        lat = element.get("lat") or element.get("center", {}).get("lat")
        lng = element.get("lon") or element.get("center", {}).get("lon")
        if lat is None or lng is None:
            continue

        # تشخیص category_id بر اساس اولین تگ منطبق
        category_id = None
        for (osm_key, osm_value), cat_id in OSM_TAG_TO_CATEGORY.items():
            if tags.get(osm_key) == osm_value:
                category_id = cat_id
                break

        if category_id is None:
            continue

        places.append({
            "name": name,
            "city_id": city_info["id"],
            "category_id": category_id,
            "latitude": lat,
            "longitude": lng,
            "address": tags.get("addr:full") or tags.get("addr:street"),
        })

    print(f"   {len(places)} مکان با اسم پیدا شد.")
    return places


def login_as_admin():
    print("برای وارد کردن دیتا، باید با حساب ادمین لاگین کنی.")
    email = input("ایمیل ادمین: ").strip()
    password = getpass.getpass("رمز عبور: ")

    response = requests.post(
        f"{BACKEND_URL}/auth/login",
        json={"email": email, "password": password},
    )

    if response.status_code != 200:
        print(f"❌ لاگین ناموفق: {response.json().get('detail', response.text)}")
        return None

    data = response.json()
    if not data["user"]["is_admin"]:
        print("❌ این حساب ادمین نیست، نمی‌تونه مکان وارد کنه.")
        return None

    print(f"✅ با موفقیت به‌عنوان {data['user']['email']} وارد شدی.\n")
    return data["access_token"]


def get_existing_keys(token):
    """ترکیب (اسم, شهر) مکان‌های موجود رو می‌گیره تا دوباره وارد نشن"""
    response = requests.get(f"{BACKEND_URL}/places/")
    response.raise_for_status()
    return {(place["name"], place["city"]["id"]) for place in response.json()}


def import_places(places, token, existing_keys):
    headers = {"Authorization": f"Bearer {token}"}
    success_count = 0
    skip_count = 0
    fail_count = 0

    for place in places:
        key = (place["name"], place["city_id"])
        if key in existing_keys:
            skip_count += 1
            continue

        response = requests.post(f"{BACKEND_URL}/places/", json=place, headers=headers)
        if response.status_code == 201:
            category_name = CATEGORY_NAMES.get(place["category_id"], "?")
            print(f"✅ اضافه شد: {place['name']} ({category_name})")
            success_count += 1
            existing_keys.add(key)  # جلوگیری از تکراری‌شدن توی همین اجرا
        else:
            print(f"❌ خطا برای {place['name']}: {response.text}")
            fail_count += 1

    return success_count, skip_count, fail_count


def main():
    token = login_as_admin()
    if not token:
        return

    existing_keys = get_existing_keys(token)

    total_success = 0
    total_skip = 0
    total_fail = 0

    for city_name, city_info in CITIES.items():
        try:
            places = fetch_osm_places(city_name, city_info)
        except requests.exceptions.RequestException as err:
            print(f"❌ خطا در گرفتن دیتا از OpenStreetMap برای {city_name}: {err}")
            continue

        success, skip, fail = import_places(places, token, existing_keys)
        total_success += success
        total_skip += skip
        total_fail += fail

    print(f"\n📊 نتیجه نهایی: {total_success} مورد جدید اضافه شد، {total_skip} مورد تکراری رد شد، {total_fail} مورد خطا داد")


if __name__ == "__main__":
    main()
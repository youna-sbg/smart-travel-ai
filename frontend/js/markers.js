// ==========================================
// markers.js — گرفتن مکان‌ها از بک‌اند و ریختنشون روی نقشه + لیست
// ==========================================

// این آرایه رو نگه می‌داریم تا بشه بعداً مارکرها رو پاک/آپدیت کرد
let placeMarkers = [];

// آیا الان توی حالت «مرتب‌سازی بر اساس نزدیکی» هستیم یا نه
let nearbySortActive = false;

// پاک کردن همه مارکرهای مکان‌ها از روی نقشه (قبل از رسم دوباره)
function clearPlaceMarkers() {
  placeMarkers.forEach((marker) => map.removeLayer(marker));
  placeMarkers = [];
}

function renderPlaces(places) {
  const listContainer = document.getElementById("places-list");
  const countLabel = document.getElementById("places-count");

  countLabel.innerText = `${places.length} مورد`;
  listContainer.innerHTML = "";
  clearPlaceMarkers();

  if (places.length === 0) {
    listContainer.innerText = "با این فیلتر، مکانی پیدا نشد.";
    return;
  }

  places.forEach((place) => {
    if (place.latitude == null || place.longitude == null) return; // بدون مختصات، روی نقشه نمی‌ره

    const marker = L.marker([place.latitude, place.longitude]).addTo(map);
    marker.bindPopup(buildPopupContent(place));
    placeMarkers.push(marker);

    listContainer.appendChild(buildPlaceCard(place));
  });
}

// تابع مرکزی: بر اساس وضعیت فعلی (فیلترها + حالت نزدیکی)، دیتای درست رو می‌گیره و نمایش می‌ده
// این تابع از filters.js و از دکمه نزدیکی هم صدا زده می‌شه
async function refreshPlaces() {
  const listContainer = document.getElementById("places-list");

  try {
    let places;

    if (nearbySortActive) {
      if (!latestUserLocation) {
        listContainer.innerText =
          "هنوز موقعیت شما مشخص نیست. اجازه دسترسی به موقعیت رو بده یا چند ثانیه صبر کن.";
        return;
      }
      places = await fetchNearbyPlaces(latestUserLocation.lat, latestUserLocation.lng, activeFilters);
    } else {
      places = await fetchPlaces(activeFilters);
    }

    renderPlaces(places);
  } catch (err) {
    listContainer.innerText =
      "خطا در گرفتن دیتا از بک‌اند: " + err.message + " (مطمئن شو uvicorn روی پورت 8001 اجراست)";
    console.error(err);
  }
}

// دکمه فعال/غیرفعال کردن مرتب‌سازی بر اساس نزدیکی
function toggleNearbySort() {
  const btn = document.getElementById("nearby-toggle-btn");
  nearbySortActive = !nearbySortActive;

  if (nearbySortActive) {
    btn.classList.add("active");
    btn.innerText = "مرتب‌سازی بر اساس نزدیکی: فعال";
  } else {
    btn.classList.remove("active");
    btn.innerText = "مرتب‌سازی بر اساس نزدیکی";
  }

  refreshPlaces();
}

// به محض لود شدن صفحه، مکان‌ها رو به‌صورت عادی از بک‌اند بگیر
refreshPlaces();

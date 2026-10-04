// ==========================================
// favorites.js — نگهداری وضعیت مکان‌های موردعلاقه کاربر لاگین‌شده
// ==========================================

let favoritePlaceIds = new Set();

// وقتی کاربر لاگین می‌کنه، لیست علاقه‌مندی‌هاش رو می‌گیریم
async function loadFavorites() {
  if (!currentUser) return;

  try {
    const favorites = await apiGetFavorites();
    favoritePlaceIds = new Set(favorites.map((p) => p.id));
    refreshPlaces(); // دوباره رسم کن تا ستاره‌ها درست نشون داده بشن
  } catch (err) {
    console.error("خطا در گرفتن لیست علاقه‌مندی‌ها:", err);
  }
}

function isFavorite(placeId) {
  return favoritePlaceIds.has(placeId);
}

// این تابع از دکمه ستاره (توی ui.js ساخته می‌شه) صدا زده می‌شه
async function toggleFavorite(placeId) {
  if (!currentUser) {
    openAuthModal("login"); // مهمون نمی‌تونه علاقه‌مندی ذخیره کنه، اول باید وارد بشه
    return;
  }

  try {
    if (isFavorite(placeId)) {
      await apiRemoveFavorite(placeId);
      favoritePlaceIds.delete(placeId);
    } else {
      await apiAddFavorite(placeId);
      favoritePlaceIds.add(placeId);
    }
    refreshPlaces();
  } catch (err) {
    console.error("خطا در تغییر وضعیت علاقه‌مندی:", err);
  }
}

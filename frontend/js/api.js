// ==========================================
// api.js — تمام درخواست‌ها به بک‌اند FastAPI اینجا متمرکز می‌شن
// هیچ فایل دیگه‌ای نباید مستقیم fetch به بک‌اند بزنه، همه از این توابع استفاده کنن
// ==========================================

const BACKEND_URL = "http://127.0.0.1:8001";

function buildFilterQuery(filters = {}) {
  const params = new URLSearchParams();
  if (filters.city_id) params.set("city_id", filters.city_id);
  if (filters.category_id) params.set("category_id", filters.category_id);
  return params.toString();
}

function authHeaders() {
  const token = getToken(); // از auth.js میاد
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchPlaces(filters = {}) {
  const query = buildFilterQuery(filters);
  const res = await fetch(`${BACKEND_URL}/places/${query ? "?" + query : ""}`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

async function fetchNearbyPlaces(lat, lng, filters = {}) {
  const params = new URLSearchParams({ lat, lng });
  if (filters.city_id) params.set("city_id", filters.city_id);
  if (filters.category_id) params.set("category_id", filters.category_id);

  const res = await fetch(`${BACKEND_URL}/places/nearby?${params.toString()}`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

async function fetchCities() {
  const res = await fetch(`${BACKEND_URL}/cities`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${BACKEND_URL}/categories`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

async function fetchRoute(originLat, originLng, destLat, destLng) {
  const url = `${BACKEND_URL}/route/?origin_lat=${originLat}&origin_lng=${originLng}&destination_lat=${destLat}&destination_lng=${destLng}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `سرور خطا داد: ${res.status}`);
  }

  return res.json();
}

// ساخت مکان جدید — فقط ادمین (توکنش رو authHeaders() خودکار می‌فرسته)
async function apiCreatePlace(placeData) {
  const res = await fetch(`${BACKEND_URL}/places/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(placeData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `سرور خطا داد: ${res.status}`);
  return data;
}

// ==========================================
// Authentication
// ==========================================

async function apiRegister(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "خطا در ثبت‌نام");
  return data;
}

async function apiLogin(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "خطا در ورود");
  return data;
}

async function apiGetMe() {
  const res = await fetch(`${BACKEND_URL}/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("توکن نامعتبره");
  return res.json();
}

// ==========================================
// Favorites
// ==========================================

async function apiGetFavorites() {
  const res = await fetch(`${BACKEND_URL}/favorites/`, { headers: authHeaders() });
  if (!res.ok) throw new Error("خطا در گرفتن لیست علاقه‌مندی‌ها");
  return res.json();
}

async function apiAddFavorite(placeId) {
  const res = await fetch(`${BACKEND_URL}/favorites/${placeId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("خطا در اضافه کردن به علاقه‌مندی‌ها");
  return res.json();
}

async function apiRemoveFavorite(placeId) {
  const res = await fetch(`${BACKEND_URL}/favorites/${placeId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("خطا در حذف از علاقه‌مندی‌ها");
  return res.json();
}

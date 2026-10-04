// ==========================================
// api/client.js — تمام درخواست‌ها به بک‌اند FastAPI اینجا متمرکز می‌شن
// ==========================================

import { BACKEND_URL } from "../config";

function buildFilterParams(filters = {}) {
  const params = new URLSearchParams();
  if (filters.city_id) params.set("city_id", filters.city_id);
  if (filters.category_id) params.set("category_id", filters.category_id);
  return params;
}

export async function fetchPlaces(filters = {}) {
  const query = buildFilterParams(filters).toString();
  const res = await fetch(`${BACKEND_URL}/places/${query ? "?" + query : ""}`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

export async function fetchNearbyPlaces(lat, lng, filters = {}) {
  const params = buildFilterParams(filters);
  params.set("lat", lat);
  params.set("lng", lng);

  const res = await fetch(`${BACKEND_URL}/places/nearby?${params.toString()}`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

export async function fetchCities() {
  const res = await fetch(`${BACKEND_URL}/cities`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BACKEND_URL}/categories`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

export async function fetchRoute(originLat, originLng, destLat, destLng) {
  const url = `${BACKEND_URL}/route/?origin_lat=${originLat}&origin_lng=${originLng}&destination_lat=${destLat}&destination_lng=${destLng}`;
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `سرور خطا داد: ${res.status}`);
  }

  return res.json();
}

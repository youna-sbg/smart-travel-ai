import { BACKEND_URL } from "../config";

export async function apiGetAllPlacesForAdmin(token, filters = {}) {
  const params = new URLSearchParams();
  if (filters.city_id) params.set("city_id", filters.city_id);
  if (filters.category_id) params.set("category_id", filters.category_id);
  if (filters.review_status) params.set("review_status", filters.review_status);
  if (filters.is_active !== undefined && filters.is_active !== null) {
    params.set("is_active", filters.is_active);
  }

  const query = params.toString();
  const res = await fetch(`${BACKEND_URL}/places/admin/all${query ? "?" + query : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

export async function apiUpdatePlace(placeId, updates, token) {
  const res = await fetch(`${BACKEND_URL}/places/${placeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `سرور خطا داد: ${res.status}`);
  return data;
}

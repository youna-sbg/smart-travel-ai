import { BACKEND_URL } from "../config";

export async function apiGetFavorites(token) {
  const res = await fetch(`${BACKEND_URL}/favorites/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("خطا در گرفتن لیست علاقه‌مندی‌ها");
  return res.json();
}

export async function apiAddFavorite(placeId, token) {
  const res = await fetch(`${BACKEND_URL}/favorites/${placeId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("خطا در اضافه کردن به علاقه‌مندی‌ها");
  return res.json();
}

export async function apiRemoveFavorite(placeId, token) {
  const res = await fetch(`${BACKEND_URL}/favorites/${placeId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("خطا در حذف از علاقه‌مندی‌ها");
  return res.json();
}

import { BACKEND_URL } from "../config";

export async function apiCreatePlace(placeData, token) {
  const res = await fetch(`${BACKEND_URL}/places/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `سرور خطا داد: ${res.status}`);
  return data;
}

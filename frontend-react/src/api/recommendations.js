import { BACKEND_URL } from "../config";

export async function fetchRecommendations({ lat, lng, weatherCode, cityId, limit = 5 }) {
  const params = new URLSearchParams({ lat, lng, limit });
  if (weatherCode !== null && weatherCode !== undefined) params.set("weather_code", weatherCode);
  if (cityId) params.set("city_id", cityId);

  const res = await fetch(`${BACKEND_URL}/recommendations/?${params.toString()}`);
  if (!res.ok) throw new Error(`سرور خطا داد: ${res.status}`);
  return res.json();
}

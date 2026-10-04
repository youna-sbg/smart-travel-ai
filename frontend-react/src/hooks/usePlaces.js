import { useState, useEffect } from "react";
import { fetchPlaces, fetchNearbyPlaces } from "../api/client";

// refreshTrigger یه عدد ساده‌ست که هر وقت عوض بشه (مثلاً بعد از اضافه کردن مکان جدید توسط ادمین)،
// این هوک مجبور می‌شه دوباره دیتا رو از بک‌اند بگیره، حتی اگه فیلترها عوض نشده باشن
function usePlaces({ cityId, categoryId, nearbySortActive, location, refreshTrigger = 0 }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const filters = { city_id: cityId, category_id: categoryId };

    async function load() {
      if (nearbySortActive && !location) {
        setLoading(false);
        setError("هنوز موقعیت شما مشخص نیست.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = nearbySortActive
          ? await fetchNearbyPlaces(location.lat, location.lng, filters)
          : await fetchPlaces(filters);

        if (!cancelled) setPlaces(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [cityId, categoryId, nearbySortActive, location, refreshTrigger]);

  return { places, loading, error };
}

export default usePlaces;

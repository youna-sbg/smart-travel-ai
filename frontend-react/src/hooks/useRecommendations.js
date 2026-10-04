import { useState, useEffect } from "react";
import { fetchRecommendations } from "../api/recommendations";

// پیشنهادات به موقعیت و آب‌وهوا وابسته‌ان — هر وقت هرکدوم عوض بشه، دوباره گرفته می‌شن
function useRecommendations({ location, weatherCode, cityId, limit = 5 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return; // بدون موقعیت، پیشنهاد معنی نداره

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRecommendations({ lat: location.lat, lng: location.lng, weatherCode, cityId, limit })
      .then((data) => {
        if (!cancelled) setRecommendations(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location, weatherCode, cityId, limit]);

  return { recommendations, loading, error };
}

export default useRecommendations;

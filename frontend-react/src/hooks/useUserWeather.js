import { useState, useEffect, useRef } from "react";
import { fetchWeather } from "../api/weather";

// این هوک فقط یه‌بار (نه با هر آپدیت movePosition) آب‌وهوای کاربر رو می‌گیره
function useUserWeather(location) {
  const [weather, setWeather] = useState(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!location || hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchWeather(location.lat, location.lng)
      .then(setWeather)
      .catch((err) => console.error("خطا در گرفتن آب‌وهوای کاربر:", err));
  }, [location]);

  return weather;
}

export default useUserWeather;

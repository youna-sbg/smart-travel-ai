import { useState, useEffect } from "react";
import { fetchWeather } from "../api/weather";

const CITY_COORDS = {
  Babol: { label: "بابل", lat: 36.5512, lng: 52.6789 },
  Babolsar: { label: "بابلسر", lat: 36.7, lng: 52.657 },
  Sari: { label: "ساری", lat: 36.5633, lng: 53.0601 },
};

function useCityWeather() {
  const [cityWeather, setCityWeather] = useState({}); // { Babol: {temp, icon, text}, ... }

  useEffect(() => {
    Object.entries(CITY_COORDS).forEach(([cityKey, city]) => {
      fetchWeather(city.lat, city.lng)
        .then((weather) => {
          setCityWeather((prev) => ({ ...prev, [cityKey]: { ...weather, label: city.label } }));
        })
        .catch((err) => console.error(`خطا در گرفتن آب‌وهوای ${city.label}:`, err));
    });
  }, []);

  return cityWeather;
}

export default useCityWeather;
export { CITY_COORDS };

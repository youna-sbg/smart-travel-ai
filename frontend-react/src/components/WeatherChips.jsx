import useCityWeather, { CITY_COORDS } from "../hooks/useCityWeather";
import "./WeatherChips.css";

function WeatherChips() {
  const cityWeather = useCityWeather();

  return (
    <div className="weather-chip-row">
      {Object.keys(CITY_COORDS).map((cityKey) => {
        const weather = cityWeather[cityKey];
        const label = CITY_COORDS[cityKey].label;

        return (
          <span key={cityKey} className="weather-chip">
            {label}: {weather ? `${weather.icon} ${weather.temp}°C` : "..."}
          </span>
        );
      })}
    </div>
  );
}

export default WeatherChips;

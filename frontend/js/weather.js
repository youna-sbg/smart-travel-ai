// ==========================================
// weather.js — آب‌وهوای موقعیت کاربر و شهرهای اصلی
// از سرویس رایگان Open-Meteo استفاده می‌کنیم (نیازی به کلید API نداره،
// برای همین برخلاف نشان، مستقیم از فرانت‌اند صداش می‌زنیم نه از پشت بک‌اند)
// ==========================================

// مختصات تقریبی مرکز هر شهر — چون جدول cities توی دیتابیس مختصات نداره
const CITY_COORDS = {
  Babol: { label: "بابل", lat: 36.5512, lng: 52.6789 },
  Babolsar: { label: "بابلسر", lat: 36.7, lng: 52.657 },
  Sari: { label: "ساری", lat: 36.5633, lng: 53.0601 },
};

// تبدیل کد آب‌وهوای استاندارد WMO به آیکون و توضیح فارسی
function describeWeatherCode(code) {
  if (code === 0) return { icon: "☀️", text: "صاف" };
  if ([1, 2].includes(code)) return { icon: "🌤", text: "نیمه‌ابری" };
  if (code === 3) return { icon: "☁️", text: "ابری" };
  if ([45, 48].includes(code)) return { icon: "🌫", text: "مه‌آلود" };
  if ([51, 53, 55].includes(code)) return { icon: "🌦", text: "نم‌نم باران" };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { icon: "🌧", text: "بارانی" };
  if ([71, 73, 75, 77].includes(code)) return { icon: "❄️", text: "برفی" };
  if ([95, 96, 99].includes(code)) return { icon: "⛈", text: "طوفانی" };
  return { icon: "🌡", text: "نامشخص" };
}

// گرفتن آب‌وهوای فعلی یه نقطه از Open-Meteo
async function fetchWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("سرویس آب‌وهوا در دسترس نیست");

  const data = await res.json();
  const temp = Math.round(data.current.temperature_2m);
  const { icon, text } = describeWeatherCode(data.current.weather_code);

  return { temp, icon, text };
}

// آب‌وهوای موقعیت زنده کاربر — فقط یه‌بار (نه هر بار که watchPosition آپدیت می‌شه) صدا زده می‌شه
let hasFetchedUserWeather = false;

async function loadUserWeather(lat, lng) {
  if (hasFetchedUserWeather) return;
  hasFetchedUserWeather = true;

  try {
    const weather = await fetchWeather(lat, lng);
    document.getElementById("user-weather-text").innerText =
      ` · ${weather.icon} ${weather.temp}°C ${weather.text}`;
  } catch (err) {
    console.error("خطا در گرفتن آب‌وهوای موقعیت کاربر:", err);
  }
}

// آب‌وهوای هرکدوم از ۳ شهر اصلی، به‌صورت چیپ‌های کوچیک
async function loadCityWeatherChips() {
  const container = document.getElementById("city-weather");
  container.innerHTML = "";

  for (const cityKey of Object.keys(CITY_COORDS)) {
    const city = CITY_COORDS[cityKey];
    const chip = document.createElement("span");
    chip.className = "weather-chip";
    chip.innerText = `${city.label}: در حال بارگذاری...`;
    container.appendChild(chip);

    try {
      const weather = await fetchWeather(city.lat, city.lng);
      chip.innerText = `${city.label}: ${weather.icon} ${weather.temp}°C`;
    } catch (err) {
      chip.innerText = `${city.label}: نامشخص`;
      console.error(`خطا در گرفتن آب‌وهوای ${city.label}:`, err);
    }
  }
}

loadCityWeatherChips();

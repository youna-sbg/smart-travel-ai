// ==========================================
// api/weather.js — گرفتن آب‌وهوا از Open-Meteo (رایگان، بدون نیاز به کلید API)
// ==========================================

export function describeWeatherCode(code) {
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

export async function fetchWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("سرویس آب‌وهوا در دسترس نیست");

  const data = await res.json();
  const temp = Math.round(data.current.temperature_2m);
  const code = data.current.weather_code;
  const { icon, text } = describeWeatherCode(code);

  // code لازمه چون موتور رتبه‌بندی بر اساس همین کد تصمیم می‌گیره
  return { temp, icon, text, code };
}

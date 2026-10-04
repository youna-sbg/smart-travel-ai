// ==========================================
// location.js — موقعیت زنده کاربر (watchPosition) + مارکر آبی
// ==========================================

let userMarker = null;
let hasCenteredOnUser = false; // فقط بار اول که موقعیت گرفتیم، نقشه رو روش وسط‌چین می‌کنیم
let latestUserLocation = null; // آخرین موقعیت شناخته‌شده کاربر، برای استفاده در مسیریابی (route.js ازش می‌خونه)

function startWatchingLocation() {
  if (!navigator.geolocation) {
    document.getElementById("location-status-text").innerText =
      "مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کنه.";
    return;
  }

  navigator.geolocation.watchPosition(onLocationUpdate, onLocationError, {
    enableHighAccuracy: true,
    maximumAge: 5000, // اگه موقعیت کمتر از ۵ ثانیه پیش گرفته شده، همون رو استفاده کن
    timeout: 10000,
  });
}

function onLocationUpdate(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  latestUserLocation = { lat, lng };

  document.getElementById("status-dot").classList.add("active");
  document.getElementById("location-status-text").innerText =
    `موقعیت شما: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

  if (userMarker === null) {
    // اولین باره که موقعیت می‌گیریم؛ یه مارکر آبی می‌سازیم
    userMarker = L.circleMarker([lat, lng], {
      radius: 9,
      fillColor: "#1a73e8",
      fillOpacity: 1,
      color: "#ffffff",
      weight: 3,
    }).addTo(map);
    userMarker.bindPopup("موقعیت فعلی شما");
  } else {
    // دفعات بعدی، فقط جای مارکر رو عوض می‌کنیم (نه اینکه یه مارکر جدید بسازیم)
    userMarker.setLatLng([lat, lng]);
  }

  if (!hasCenteredOnUser) {
    map.setView([lat, lng], 13);
    hasCenteredOnUser = true;
  }

  // آب‌وهوای موقعیت فعلی رو هم بگیر (خود تابع مراقبه که این کار فقط یه‌بار انجام بشه)
  loadUserWeather(lat, lng);
}

function onLocationError(error) {
  let message;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "دسترسی به موقعیت رد شد. برای استفاده از این قابلیت، از تنظیمات مرورگر اجازه بده.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "موقعیت شما در دسترس نیست.";
      break;
    case error.TIMEOUT:
      message = "زمان گرفتن موقعیت تموم شد. دوباره تلاش کن.";
      break;
    default:
      message = "خطای ناشناخته در گرفتن موقعیت.";
  }
  document.getElementById("location-status-text").innerText = message;
}

startWatchingLocation();

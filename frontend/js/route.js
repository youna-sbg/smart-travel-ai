// ==========================================
// route.js — مسیریابی: گرفتن مسیر از بک‌اند و رسمش روی نقشه
// ==========================================

// مختصات تهران و چالوس (فقط برای دکمه تست مسیریابی، ربطی به دیتابیس نداره)
const testOrigin = { lat: 35.6892, lng: 51.389 }; // تهران
const testDestination = { lat: 36.655, lng: 51.42 }; // چالوس

let lastRouteLayer = null; // مسیر قبلی رو نگه می‌داریم تا قبل از رسم مسیر جدید پاکش کنیم

// تابع decode کردن فرمت encoded polyline (استاندارد Google/Neshan)
function decodePolyline(encoded) {
  let points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// تابع مشترک برای گرفتن مسیر از بک‌اند و رسمش روی نقشه
async function drawRoute(originLat, originLng, destLat, destLng, resultElementId = "result") {
  try {
    const data = await fetchRoute(originLat, originLng, destLat, destLng);

    document.getElementById(resultElementId).innerText =
      `زمان تقریبی: ${data.duration_minutes} دقیقه | فاصله: ${data.distance_km} کیلومتر`;

    // اگه مسیر قبلی روی نقشه هست، اول پاکش کن
    if (lastRouteLayer) {
      map.removeLayer(lastRouteLayer);
    }

    const decoded = decodePolyline(data.polyline);
    lastRouteLayer = L.polyline(decoded, { color: "#0a7a3e", weight: 5 }).addTo(map);
    map.fitBounds(lastRouteLayer.getBounds());
  } catch (err) {
    document.getElementById(resultElementId).innerText = "خطا: " + err.message;
    console.error(err);
  }
}

// گرفتن مسیر تست تهران→چالوس (دکمه بالای صفحه)
function getRoute() {
  drawRoute(testOrigin.lat, testOrigin.lng, testDestination.lat, testDestination.lng);
}

// مسیریابی از موقعیت فعلی کاربر تا یه مکان مشخص (دکمه داخل popup هر مارکر)
// این تابع باید global بمونه چون از onclick داخل HTML صدا زده می‌شه (ui.js همین‌جوری می‌سازتش)
function routeToPlace(destLat, destLng, placeName) {
  if (!latestUserLocation) {
    document.getElementById("result").innerText =
      "هنوز موقعیت شما مشخص نیست. اجازه دسترسی به موقعیت رو بده یا چند ثانیه صبر کن.";
    return;
  }

  document.getElementById("result").innerText = `در حال محاسبه مسیر تا ${placeName}...`;
  drawRoute(latestUserLocation.lat, latestUserLocation.lng, destLat, destLng);
}

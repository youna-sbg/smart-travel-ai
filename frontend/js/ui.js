// ==========================================
// ui.js — ساخت محتوای HTML برای نمایش (popup مارکرها، کارت‌های لیست)
// این فایل هیچ fetch یا منطق نقشه‌ای نداره، فقط رشته HTML می‌سازه
// ==========================================

const CATEGORY_ICONS = {
  Restaurant: "🍽",
  Cafe: "☕",
  Forest: "🌲",
  Beach: "🏖",
  Hotel: "🏨",
  Park: "🌳",
  Museum: "🏛",
  Shopping: "🛍",
  Waterfall: "💧",
};

function getCategoryIcon(categoryName) {
  return CATEGORY_ICONS[categoryName] || "📍";
}

function buildFeaturesText(place) {
  if (!place.features || place.features.length === 0) return "";
  return place.features.map((f) => `${f.feature.name}: ${f.value}/10`).join("، ");
}

// دکمه ستاره — پر اگه علاقه‌مند باشه، خالی اگه نباشه
function buildFavoriteButton(place) {
  const favorited = isFavorite(place.id); // از favorites.js
  return `<button class="favorite-btn ${favorited ? "favorited" : ""}" onclick="toggleFavorite(${place.id})" title="علاقه‌مندی">${favorited ? "★" : "☆"}</button>`;
}

function buildPopupContent(place) {
  const featuresText = buildFeaturesText(place);
  const safeName = place.name.replace(/'/g, "\\'");
  const distanceText = place.distance_km != null ? ` · ${place.distance_km} کیلومتر` : "";

  return (
    `<b>${place.name}</b> ${buildFavoriteButton(place)}<br>${place.category.name} — ${place.city.name}${distanceText}` +
    (place.description ? `<br>${place.description}` : "") +
    (featuresText ? `<br><small>${featuresText}</small>` : "") +
    `<br><button class="popup-route-btn" onclick="routeToPlace(${place.latitude}, ${place.longitude}, '${safeName}')">مسیریابی به اینجا</button>`
  );
}

function buildPlaceCard(place) {
  const featuresText = buildFeaturesText(place);
  const distanceBadge =
    place.distance_km != null
      ? `<span class="place-distance">${place.distance_km} کیلومتر با شما فاصله دارد</span>`
      : "";

  const card = document.createElement("div");
  card.className = "place-card";
  card.innerHTML = `
    <div class="km-post">${getCategoryIcon(place.category.name)}</div>
    <div class="place-card-body">
      <span class="place-name">${place.name} ${buildFavoriteButton(place)}</span>
      <span class="place-meta">${place.category.name} · ${place.city.name}</span>
      ${distanceBadge}
      ${featuresText ? `<span class="place-features">${featuresText}</span>` : ""}
    </div>
  `;
  return card;
}

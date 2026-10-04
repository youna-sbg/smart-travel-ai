import { useEffect, useRef } from "react";

function PlacesLayer({ map, places, favoriteIds }) {
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    places.forEach((place) => {
      if (place.latitude == null || place.longitude == null) return;

      const safeName = place.name.replace(/'/g, "\\'");
      const distanceText = place.distance_km != null ? ` · ${place.distance_km} کیلومتر` : "";
      const isFavorited = favoriteIds.has(place.id);
      const star = isFavorited ? "★" : "☆";

      const marker = window.L.marker([place.latitude, place.longitude]).addTo(map);
      marker.bindPopup(
        `<b>${place.name}</b> <button onclick="window.toggleFavoritePlace(${place.id})" style="border:none; background:none; color:#e0862e; font-size:16px; cursor:pointer;">${star}</button>` +
          `<br>${place.category.name} — ${place.city.name}${distanceText}` +
          (place.description ? `<br>${place.description}` : "") +
          `<br><button onclick="window.routeToPlace(${place.latitude}, ${place.longitude}, '${safeName}')" style="margin-top:6px; padding:4px 10px; font-size:13px;">مسیریابی به اینجا</button>`
      );
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => map.removeLayer(marker));
      markersRef.current = [];
    };
  }, [map, places, favoriteIds]);

  return null;
}

export default PlacesLayer;

import { useEffect, useRef } from "react";

// دقیقاً مثل PlacesLayer، این کامپوننت هم چیزی رندر نمی‌کنه (null)،
// فقط یه مارکر آبی رو روی نقشه می‌سازه/آپدیت می‌کنه.
function UserLocationMarker({ map, location }) {
  const markerRef = useRef(null);
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (!map || !location) return;

    if (markerRef.current === null) {
      // اولین باره که موقعیت می‌گیریم؛ مارکر آبی رو می‌سازیم
      markerRef.current = window.L.circleMarker([location.lat, location.lng], {
        radius: 9,
        fillColor: "#1a73e8",
        fillOpacity: 1,
        color: "#ffffff",
        weight: 3,
      }).addTo(map);
      markerRef.current.bindPopup("موقعیت فعلی شما");
    } else {
      // دفعات بعدی، فقط جاش رو عوض کن
      markerRef.current.setLatLng([location.lat, location.lng]);
    }

    if (!hasCenteredRef.current) {
      map.setView([location.lat, location.lng], 13);
      hasCenteredRef.current = true;
    }
  }, [map, location]);

  // موقع unmount کامل شدن کامپوننت (نه هر آپدیت)، مارکر رو پاک کن
  useEffect(() => {
    return () => {
      if (markerRef.current && map) {
        map.removeLayer(markerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

export default UserLocationMarker;

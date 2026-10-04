import { useEffect, useRef } from "react";
import { fetchRoute } from "../api/client";
import { decodePolyline } from "../utils/polyline";

function RouteLayer({ map, routeRequest, onResult }) {
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map || !routeRequest) return;

    let cancelled = false;

    async function loadRoute() {
      try {
        const data = await fetchRoute(
          routeRequest.originLat,
          routeRequest.originLng,
          routeRequest.destLat,
          routeRequest.destLng
        );

        if (cancelled) return;

        if (polylineRef.current) {
          map.removeLayer(polylineRef.current);
        }

        const decoded = decodePolyline(data.polyline);
        const layer = window.L.polyline(decoded, { color: "#0a7a3e", weight: 5 }).addTo(map);
        map.fitBounds(layer.getBounds());
        polylineRef.current = layer;

        onResult({
          text: `زمان تقریبی: ${data.duration_minutes} دقیقه | فاصله: ${data.distance_km} کیلومتر`,
          isError: false,
        });
      } catch (err) {
        if (!cancelled) onResult({ text: "خطا: " + err.message, isError: true });
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routeRequest]);

  return null;
}

export default RouteLayer;
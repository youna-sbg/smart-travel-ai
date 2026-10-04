import { useEffect, useRef } from "react";
import { MAP_KEY, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../config";
import "./MapView.css";

function MapView({ onMapReady }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = window.L.map(containerRef.current, {
      key: MAP_KEY,
      maptype: "dreamy",
      poi: true,
      traffic: false,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });

    mapInstanceRef.current = map;
    if (onMapReady) onMapReady(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="map-container" />;
}

export default MapView;

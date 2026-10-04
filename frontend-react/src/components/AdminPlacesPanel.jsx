import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGetAllPlacesForAdmin, apiUpdatePlace } from "../api/adminPlaces";

function AdminPlacesPanel({ onClose }) {
  const { getToken } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = statusFilter ? { review_status: statusFilter } : {};
      const data = await apiGetAllPlacesForAdmin(getToken(), filters);
      setPlaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  async function toggleActive(place) {
    try {
      await apiUpdatePlace(place.id, { is_active: !place.is_active }, getToken());
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (err) {
      alert("خطا: " + err.message);
    }
  }

  async function markReviewed(place) {
    try {
      await apiUpdatePlace(place.id, { review_status: "reviewed" }, getToken());
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, review_status: "reviewed" } : p))
      );
    } catch (err) {
      alert("خطا: " + err.message);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        zIndex: 2000,
        overflow: "auto",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>مدیریت مکان‌ها ({places.length})</h2>
        <button onClick={onClose}>بستن</button>
      </div>

      <div style={{ margin: "12px 0" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">همه وضعیت‌ها</option>
          <option value="osm_imported">وارد شده از OSM (بررسی‌نشده)</option>
          <option value="needs_review">نیاز به بررسی</option>
          <option value="reviewed">بررسی‌شده</option>
        </select>
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p style={{ color: "#c0392b" }}>خطا: {error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ textAlign: "right", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "8px" }}>اسم</th>
              <th style={{ padding: "8px" }}>دسته‌بندی</th>
              <th style={{ padding: "8px" }}>شهر</th>
              <th style={{ padding: "8px" }}>وضعیت بررسی</th>
              <th style={{ padding: "8px" }}>فعال</th>
              <th style={{ padding: "8px" }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr
                key={place.id}
                style={{
                  borderBottom: "1px solid #eee",
                  opacity: place.is_active ? 1 : 0.45,
                }}
              >
                <td style={{ padding: "8px" }}>{place.name}</td>
                <td style={{ padding: "8px" }}>{place.category.name}</td>
                <td style={{ padding: "8px" }}>{place.city.name}</td>
                <td style={{ padding: "8px" }}>{place.review_status}</td>
                <td style={{ padding: "8px" }}>{place.is_active ? "فعال" : "غیرفعال"}</td>
                <td style={{ padding: "8px", display: "flex", gap: "6px" }}>
                  <button onClick={() => toggleActive(place)}>
                    {place.is_active ? "غیرفعال کن" : "فعال کن"}
                  </button>
                  {place.review_status !== "reviewed" && (
                    <button onClick={() => markReviewed(place)}>بررسی شد</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPlacesPanel;

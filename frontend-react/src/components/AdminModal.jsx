import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useLookups from "../hooks/useLookups";
import { apiCreatePlace } from "../api/admin";

function AdminModal({ onClose, onCreated }) {
  const { getToken } = useAuth();
  const { cities, categories } = useLookups();

  const [name, setName] = useState("");
  const [cityId, setCityId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !cityId || !categoryId || !latitude || !longitude) {
      setError("اسم، شهر، دسته‌بندی، و مختصات (latitude/longitude) اجباری هستن.");
      return;
    }

    const placeData = {
      name,
      city_id: parseInt(cityId),
      category_id: parseInt(categoryId),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description: description || null,
      address: address || null,
    };

    try {
      await apiCreatePlace(placeData, getToken());
      setSuccess(`«${name}» با موفقیت اضافه شد.`);
      setName("");
      setLatitude("");
      setLongitude("");
      setAddress("");
      setDescription("");
      onCreated(); // به App.jsx خبر می‌ده که لیست مکان‌ها رو دوباره بگیره
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "10px",
          width: "340px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3>افزودن مکان جدید</h3>

        <input
          type="text"
          placeholder="اسم مکان *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px" }}
        />

        <select value={cityId} onChange={(e) => setCityId(e.target.value)} style={{ padding: "10px" }}>
          <option value="">شهر را انتخاب کن *</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="">دسته‌بندی را انتخاب کن *</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="latitude *"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            style={{ padding: "10px", flex: 1, minWidth: 0 }}
          />
          <input
            type="text"
            placeholder="longitude *"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            style={{ padding: "10px", flex: 1, minWidth: 0 }}
          />
        </div>

        <input
          type="text"
          placeholder="آدرس (اختیاری)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: "10px" }}
        />

        <textarea
          placeholder="توضیح کوتاه (اختیاری)"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px" }}
        />

        {error && <p style={{ color: "#c0392b", fontSize: "13px", margin: 0 }}>{error}</p>}
        {success && <p style={{ color: "#2f6f62", fontSize: "13px", margin: 0 }}>{success}</p>}

        <button type="submit">ثبت مکان</button>
        <button type="button" onClick={onClose}>
          بستن
        </button>
      </form>
    </div>
  );
}

export default AdminModal;

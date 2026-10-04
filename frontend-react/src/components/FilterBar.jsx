import useLookups from "../hooks/useLookups";
import "./FilterBar.css";

function FilterBar({
  cityId,
  categoryId,
  onCityChange,
  onCategoryChange,
  onClearFilters,
  nearbySortActive,
  onToggleNearbySort,
}) {
  const { cities, categories } = useLookups();

  return (
    <div className="filter-row">
      <select
        className="filter-select"
        value={cityId || ""}
        onChange={(e) => onCityChange(e.target.value || null)}
      >
        <option value="">همه شهرها</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={categoryId || ""}
        onChange={(e) => onCategoryChange(e.target.value || null)}
      >
        <option value="">همه دسته‌بندی‌ها</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button className="filter-clear-btn" onClick={onClearFilters}>
        پاک کردن فیلتر
      </button>

      <button
        className={`filter-nearby-btn ${nearbySortActive ? "filter-nearby-btn--active" : ""}`}
        onClick={onToggleNearbySort}
      >
        {nearbySortActive ? "مرتب‌سازی بر اساس نزدیکی: فعال" : "مرتب‌سازی بر اساس نزدیکی"}
      </button>
    </div>
  );
}

export default FilterBar;

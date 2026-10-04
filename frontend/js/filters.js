// ==========================================
// filters.js — فیلتر مکان‌ها بر اساس شهر و دسته‌بندی
// ==========================================

// وضعیت فعلی فیلتر — markers.js موقع گرفتن دیتا از همین می‌خونه
const activeFilters = {
  city_id: null,
  category_id: null,
};

async function populateFilterDropdowns() {
  const citySelect = document.getElementById("city-filter");
  const categorySelect = document.getElementById("category-filter");

  try {
    const [cities, categories] = await Promise.all([fetchCities(), fetchCategories()]);

    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id;
      option.innerText = city.name;
      citySelect.appendChild(option);
    });

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.innerText = category.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("خطا در گرفتن لیست شهرها/دسته‌بندی‌ها برای فیلتر:", err);
  }
}

function onFilterChange() {
  const citySelect = document.getElementById("city-filter");
  const categorySelect = document.getElementById("category-filter");

  activeFilters.city_id = citySelect.value || null;
  activeFilters.category_id = categorySelect.value || null;

  refreshPlaces(); // این تابع توی markers.js تعریف شده
}

function clearFilters() {
  document.getElementById("city-filter").value = "";
  document.getElementById("category-filter").value = "";
  activeFilters.city_id = null;
  activeFilters.category_id = null;
  refreshPlaces();
}

populateFilterDropdowns();

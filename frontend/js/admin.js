// ==========================================
// admin.js — فرم افزودن مکان، فقط برای کاربر ادمین
// ==========================================

async function populateAdminDropdowns() {
  const citySelect = document.getElementById("admin-city");
  const categorySelect = document.getElementById("admin-category");

  // اگه قبلاً پر شده، دوباره پرش نکن
  if (citySelect.options.length > 0) return;

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
    console.error("خطا در گرفتن لیست شهرها/دسته‌بندی‌ها برای فرم ادمین:", err);
  }
}

async function openAdminModal() {
  await populateAdminDropdowns();
  document.getElementById("admin-error").innerText = "";
  document.getElementById("admin-success").innerText = "";
  document.getElementById("admin-modal").style.display = "flex";
}

function closeAdminModal() {
  document.getElementById("admin-modal").style.display = "none";
}

async function submitAdminForm() {
  const errorBox = document.getElementById("admin-error");
  const successBox = document.getElementById("admin-success");
  errorBox.innerText = "";
  successBox.innerText = "";

  const name = document.getElementById("admin-name").value.trim();
  const cityId = document.getElementById("admin-city").value;
  const categoryId = document.getElementById("admin-category").value;
  const latitude = document.getElementById("admin-latitude").value;
  const longitude = document.getElementById("admin-longitude").value;
  const description = document.getElementById("admin-description").value.trim();
  const address = document.getElementById("admin-address").value.trim();

  if (!name || !cityId || !categoryId || !latitude || !longitude) {
    errorBox.innerText = "اسم، شهر، دسته‌بندی، و مختصات (latitude/longitude) اجباری هستن.";
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
    await apiCreatePlace(placeData);
    successBox.innerText = `«${name}» با موفقیت اضافه شد.`;

    // فرم رو خالی کن برای مکان بعدی
    document.getElementById("admin-name").value = "";
    document.getElementById("admin-latitude").value = "";
    document.getElementById("admin-longitude").value = "";
    document.getElementById("admin-description").value = "";
    document.getElementById("admin-address").value = "";

    refreshPlaces(); // نقشه و لیست رو آپدیت کن تا مکان جدید دیده بشه
  } catch (err) {
    errorBox.innerText = err.message;
  }
}

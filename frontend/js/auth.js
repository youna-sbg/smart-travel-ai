// ==========================================
// auth.js — مدیریت ورود/ثبت‌نام/خروج و نگهداری توکن
// ==========================================

const TOKEN_KEY = "travelai_token";
let currentUser = null;

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function initAuth() {
  const token = getToken();
  if (!token) {
    updateAuthUI();
    return;
  }

  try {
    currentUser = await apiGetMe();
  } catch (err) {
    clearToken();
    currentUser = null;
  }

  updateAuthUI();
  if (currentUser) loadFavorites();
}

async function handleLogin(email, password) {
  const data = await apiLogin(email, password);
  saveToken(data.access_token);
  currentUser = data.user;
  updateAuthUI();
  loadFavorites();
}

async function handleRegister(email, password) {
  const data = await apiRegister(email, password);
  saveToken(data.access_token);
  currentUser = data.user;
  updateAuthUI();
  loadFavorites();
}

function handleLogout() {
  clearToken();
  currentUser = null;
  favoritePlaceIds.clear();
  updateAuthUI();
  refreshPlaces();
}

// آپدیت بخش هدر بر اساس اینکه کاربر لاگین هست یا نه، و اگه هست، ادمینه یا نه
function updateAuthUI() {
  const guestBox = document.getElementById("auth-guest");
  const userBox = document.getElementById("auth-user");
  const userEmailLabel = document.getElementById("auth-user-email");
  const adminBtn = document.getElementById("admin-add-place-btn");

  if (currentUser) {
    guestBox.style.display = "none";
    userBox.style.display = "flex";
    userEmailLabel.innerText = currentUser.email;
    adminBtn.style.display = currentUser.is_admin ? "inline-block" : "none";
  } else {
    guestBox.style.display = "flex";
    userBox.style.display = "none";
    adminBtn.style.display = "none";
  }
}

// ==========================================
// مدیریت مودال ورود/ثبت‌نام
// ==========================================

let authModalMode = "login";

function openAuthModal(mode) {
  authModalMode = mode;
  document.getElementById("auth-modal").style.display = "flex";
  document.getElementById("auth-modal-title").innerText =
    mode === "login" ? "ورود به حساب" : "ساخت حساب جدید";
  document.getElementById("auth-submit-btn").innerText =
    mode === "login" ? "ورود" : "ثبت‌نام";
  document.getElementById("auth-error").innerText = "";
  document.getElementById("auth-email").value = "";
  document.getElementById("auth-password").value = "";
}

function closeAuthModal() {
  document.getElementById("auth-modal").style.display = "none";
}

async function submitAuthForm() {
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const errorBox = document.getElementById("auth-error");
  errorBox.innerText = "";

  if (!email || !password) {
    errorBox.innerText = "ایمیل و رمز عبور رو پر کن.";
    return;
  }

  try {
    if (authModalMode === "login") {
      await handleLogin(email, password);
    } else {
      await handleRegister(email, password);
    }
    closeAuthModal();
  } catch (err) {
    errorBox.innerText = err.message;
  }
}

initAuth();

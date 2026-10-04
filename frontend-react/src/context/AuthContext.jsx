import { createContext, useContext, useState, useEffect } from "react";
import { apiRegister, apiLogin, apiGetMe } from "../api/auth";

const TOKEN_KEY = "travelai_token";

// Context یعنی یه «انبار state سراسری» که هر کامپوننتی، هرجای درخت React،
// می‌تونه بدون نیاز به prop drilling (رد کردن props از این کامپوننت به اون یکی) بهش دسترسی داشته باشه.
// این جایگزین همون متغیر global `currentUser` توی نسخه HTML خامه.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // تا وقتی چک اولیه توکن تموم نشده

  // موقع لود اولیه صفحه، اگه توکن ذخیره‌شده معتبر بود، کاربر رو خودکار لاگین نگه دار
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthLoading(false);
      return;
    }

    apiGetMe(token)
      .then(setCurrentUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setAuthLoading(false));
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setCurrentUser(data.user);
  }

  async function register(email, password) {
    const data = await apiRegister(email, password);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setCurrentUser(data.user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  const value = { currentUser, authLoading, login, register, logout, getToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// این هوک رو بقیه کامپوننت‌ها صدا می‌زنن تا به وضعیت لاگین دسترسی داشته باشن
// مثال استفاده: const { currentUser, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده بشه");
  }
  return context;
}

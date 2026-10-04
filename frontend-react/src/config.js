// ==========================================
// config.js — تنظیمات ثابت پروژه
// ==========================================

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8001";

// ⚠️ کلید «نقشه وب» نشان رو اینجا بذار
export const MAP_KEY = import.meta.env.VITE_NESHAN_MAP_KEY || "YOUR_NESHAN_WEB_MAP_KEY";

// مرکز پیش‌فرض نقشه — منطقه بابل/بابلسر/ساری
export const DEFAULT_MAP_CENTER = [36.58, 52.75];
export const DEFAULT_MAP_ZOOM = 10;

// ==========================================
// api/auth.js — درخواست‌های مربوط به ثبت‌نام/ورود/کاربر فعلی
// ==========================================

import { BACKEND_URL } from "../config";

export async function apiRegister(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "خطا در ثبت‌نام");
  return data;
}

export async function apiLogin(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "خطا در ورود");
  return data;
}

export async function apiGetMe(token) {
  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("توکن نامعتبره");
  return res.json();
}

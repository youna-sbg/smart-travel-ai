import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function AuthModal({ mode, onClose }) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("ایمیل و رمز عبور رو پر کن.");
      return;
    }

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-box">
        <h3>{mode === "login" ? "ورود به حساب" : "ساخت حساب جدید"}</h3>

        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="رمز عبور (حداقل ۸ کاراکتر)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="modal-error">{error}</p>}

        <button type="submit" className="btn-primary">
          {mode === "login" ? "ورود" : "ثبت‌نام"}
        </button>
        <button type="button" className="filter-clear-btn" onClick={onClose}>
          انصراف
        </button>
      </form>
    </div>
  );
}

export default AuthModal;

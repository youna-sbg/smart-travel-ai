import { useAuth } from "../context/AuthContext";
import "./Header.css";

function AuthWidget({ onOpenModal }) {
  const { currentUser, logout, authLoading } = useAuth();

  if (authLoading) return null;

  if (currentUser) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "13px", color: "#cfe0d6" }}>{currentUser.email}</span>
        <button className="btn-ghost-light" onClick={logout}>
          خروج
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button className="btn-ghost-light" onClick={() => onOpenModal("login")}>
        ورود
      </button>
      <button className="btn-ghost-light" onClick={() => onOpenModal("register")}>
        ثبت‌نام
      </button>
    </div>
  );
}

export default AuthWidget;

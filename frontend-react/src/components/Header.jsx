import "./Header.css";
import AuthWidget from "./AuthWidget";

function Header({ currentUser, onOpenAuthModal, onOpenAdminModal, onOpenAdminPlacesPanel }) {
  return (
    <header className="app-header">
      <div className="app-header-row">
        <div>
          <h1 className="app-wordmark">Smart Travel AI</h1>
          <p className="app-tagline">دستیار سفر جاده‌ای شمال — بابل، بابلسر، ساری</p>
        </div>

        <div className="app-header-actions">
          {currentUser?.is_admin && (
            <>
              <button className="btn-ghost-light" onClick={onOpenAdminModal}>
                + افزودن مکان
              </button>
              <button className="btn-ghost-light" onClick={onOpenAdminPlacesPanel}>
                مدیریت مکان‌ها
              </button>
            </>
          )}
          <AuthWidget onOpenModal={onOpenAuthModal} />
        </div>
      </div>
    </header>
  );
}

export default Header;

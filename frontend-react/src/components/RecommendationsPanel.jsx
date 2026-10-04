import "./RecommendationsPanel.css";

const CATEGORY_ICONS = {
  Restaurant: "🍽",
  Cafe: "☕",
  Forest: "🌲",
  Beach: "🏖",
  Hotel: "🏨",
  Park: "🌳",
  Museum: "🏛",
  Shopping: "🛍",
  Waterfall: "💧",
};

function RecommendationsPanel({ recommendations, loading, error, weatherText, onRouteTo }) {
  if (loading) {
    return (
      <section className="rec-panel rec-panel--quiet">
        <p className="rec-status">در حال پیدا کردن بهترین گزینه‌ها برای شما...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rec-panel rec-panel--quiet">
        <p className="rec-status">پیشنهادها در دسترس نیست: {error}</p>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section className="rec-panel rec-panel--quiet">
        <p className="rec-status">
          برای دیدن پیشنهادها، دسترسی به موقعیت مکانی‌تان را اجازه دهید.
        </p>
      </section>
    );
  }

  const [top, ...rest] = recommendations;

  return (
    <section className="rec-panel">
      <header className="rec-header">
        <h2 className="rec-title">الان کجا برویم</h2>
        {weatherText && <p className="rec-context">بر اساس موقعیت شما و {weatherText}</p>}
      </header>

      {/* پیشنهاد اول — عمداً بزرگ‌تر، چون واقعاً از بقیه مهم‌تره */}
      <article className="rec-top">
        <div className="rec-top-head">
          <span className="rec-icon" aria-hidden="true">
            {CATEGORY_ICONS[top.place.category.name] || "📍"}
          </span>
          <div>
            <h3 className="rec-top-name">{top.place.name}</h3>
            <p className="rec-top-meta">
              {top.place.category.name} در {top.place.city.name} — {top.distance_km} کیلومتر
            </p>
          </div>
          <span className="rec-score" title="امتیاز تناسب">
            {Math.round(top.score)}
          </span>
        </div>

        {top.reasons.length > 0 && (
          <ul className="rec-reasons">
            {top.reasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        )}

        <button
          className="rec-route-btn"
          onClick={() => onRouteTo(top.place.latitude, top.place.longitude, top.place.name)}
        >
          مسیر را نشانم بده
        </button>
      </article>

      {/* بقیه پیشنهادها — فشرده‌تر */}
      {rest.length > 0 && (
        <ol className="rec-rest">
          {rest.map((rec) => (
            <li key={rec.place.id} className="rec-item">
              <span className="rec-item-icon" aria-hidden="true">
                {CATEGORY_ICONS[rec.place.category.name] || "📍"}
              </span>
              <div className="rec-item-body">
                <span className="rec-item-name">{rec.place.name}</span>
                <span className="rec-item-meta">
                  {rec.place.city.name} — {rec.distance_km} کیلومتر
                  {rec.reasons.length > 0 && ` — ${rec.reasons[0]}`}
                </span>
              </div>
              <button
                className="rec-item-btn"
                onClick={() => onRouteTo(rec.place.latitude, rec.place.longitude, rec.place.name)}
              >
                مسیر
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default RecommendationsPanel;

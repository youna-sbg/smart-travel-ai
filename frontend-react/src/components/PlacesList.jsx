import "./PlacesList.css";

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

function PlacesList({ places, favoriteIds, onToggleFavorite }) {
  if (places.length === 0) {
    return <p className="places-empty">با این فیلتر، مکانی پیدا نشد.</p>;
  }

  return (
    <section>
      <h3 className="places-heading">
        دفترچه مسیر <span className="places-count">{places.length} مورد</span>
      </h3>

      <div className="places-grid">
        {places.map((place) => {
          const isFavorited = favoriteIds.has(place.id);
          return (
            <article key={place.id} className="place-card">
              <div className="km-post">{CATEGORY_ICONS[place.category.name] || "📍"}</div>
              <div className="place-card-body">
                <div className="place-card-top">
                  <span className="place-name">{place.name}</span>
                  <button
                    className="place-fav"
                    onClick={() => onToggleFavorite(place.id)}
                    title="علاقه‌مندی"
                  >
                    {isFavorited ? "★" : "☆"}
                  </button>
                </div>
                <span className="place-meta">
                  {place.category.name} · {place.city.name}
                </span>
                {place.distance_km != null && (
                  <span className="place-distance">{place.distance_km} کیلومتر با شما فاصله دارد</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PlacesList;

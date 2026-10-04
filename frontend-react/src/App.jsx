import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Header from "./components/Header";
import MapView from "./components/MapView";
import PlacesLayer from "./components/PlacesLayer";
import UserLocationMarker from "./components/UserLocationMarker";
import RouteLayer from "./components/RouteLayer";
import FilterBar from "./components/FilterBar";
import PlacesList from "./components/PlacesList";
import WeatherChips from "./components/WeatherChips";
import AuthModal from "./components/AuthModal";
import AdminModal from "./components/AdminModal";
import AdminPlacesPanel from "./components/AdminPlacesPanel";
import RecommendationsPanel from "./components/RecommendationsPanel";
import usePlaces from "./hooks/usePlaces";
import useGeolocation from "./hooks/useGeolocation";
import useUserWeather from "./hooks/useUserWeather";
import useFavorites from "./hooks/useFavorites";
import useRecommendations from "./hooks/useRecommendations";
import { useAuth } from "./context/AuthContext";

const TEST_ORIGIN = { lat: 35.6892, lng: 51.389 };
const TEST_DESTINATION = { lat: 36.655, lng: 51.42 };

function App() {
  const { currentUser } = useAuth();
  const [map, setMap] = useState(null);
  const { location, statusText } = useGeolocation();
  const userWeather = useUserWeather(location);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [cityId, setCityId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [nearbySortActive, setNearbySortActive] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { places, loading, error } = usePlaces({
    cityId,
    categoryId,
    nearbySortActive,
    location,
    refreshTrigger,
  });

  const {
    recommendations,
    loading: recLoading,
    error: recError,
  } = useRecommendations({
    location,
    weatherCode: userWeather?.code ?? null,
    cityId,
    limit: 5,
  });

  const [routeRequest, setRouteRequest] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPlacesPanelOpen, setAdminPlacesPanelOpen] = useState(false);

  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const currentUserRef = useRef(currentUser);
  const toggleFavoriteRef = useRef(toggleFavorite);
  useEffect(() => {
    currentUserRef.current = currentUser;
    toggleFavoriteRef.current = toggleFavorite;
  }, [currentUser, toggleFavorite]);

  const routeToPlace = useCallback((destLat, destLng, placeName) => {
    const currentLocation = locationRef.current;
    if (!currentLocation) {
      setRouteResult({
        text: "هنوز موقعیت شما مشخص نیست. اجازه دسترسی به موقعیت رو بده یا چند ثانیه صبر کن.",
        isError: true,
      });
      return;
    }

    setRouteResult({ text: `در حال محاسبه مسیر تا ${placeName}...`, isError: false });
    setRouteRequest({
      originLat: currentLocation.lat,
      originLng: currentLocation.lng,
      destLat,
      destLng,
    });
  }, []);

  useEffect(() => {
    window.routeToPlace = routeToPlace;

    window.toggleFavoritePlace = (placeId) => {
      if (!currentUserRef.current) {
        setAuthModalMode("login");
        return;
      }
      toggleFavoriteRef.current(placeId);
    };

    return () => {
      delete window.routeToPlace;
      delete window.toggleFavoritePlace;
    };
  }, [routeToPlace]);

  function handleTestRoute() {
    setRouteRequest({
      originLat: TEST_ORIGIN.lat,
      originLng: TEST_ORIGIN.lng,
      destLat: TEST_DESTINATION.lat,
      destLng: TEST_DESTINATION.lng,
    });
  }

  function handleClearFilters() {
    setCityId(null);
    setCategoryId(null);
  }

  function handleToggleFavoriteFromList(placeId) {
    if (!currentUser) {
      setAuthModalMode("login");
      return;
    }
    toggleFavorite(placeId);
  }

  function handlePlaceCreated() {
    setAdminModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleAdminPlacesPanelClose() {
    setAdminPlacesPanelOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  }

  const weatherText = userWeather ? `هوای ${userWeather.text} (${userWeather.temp}°)` : null;

  return (
    <div>
      <Header
        currentUser={currentUser}
        onOpenAuthModal={setAuthModalMode}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onOpenAdminPlacesPanel={() => setAdminPlacesPanelOpen(true)}
      />

      {authModalMode && (
        <AuthModal mode={authModalMode} onClose={() => setAuthModalMode(null)} />
      )}

      {adminModalOpen && (
        <AdminModal onClose={() => setAdminModalOpen(false)} onCreated={handlePlaceCreated} />
      )}

      {adminPlacesPanelOpen && <AdminPlacesPanel onClose={handleAdminPlacesPanelClose} />}

      <main className="app-body">
        <RecommendationsPanel
          recommendations={recommendations}
          loading={recLoading}
          error={recError}
          weatherText={weatherText}
          onRouteTo={routeToPlace}
        />

        <p className="status-line">
          {statusText}
          {userWeather && ` · ${userWeather.icon} ${userWeather.temp}°C ${userWeather.text}`}
        </p>

        <WeatherChips />

        <FilterBar
          cityId={cityId}
          categoryId={categoryId}
          onCityChange={setCityId}
          onCategoryChange={setCategoryId}
          onClearFilters={handleClearFilters}
          nearbySortActive={nearbySortActive}
          onToggleNearbySort={() => setNearbySortActive((prev) => !prev)}
        />

        <button className="btn-primary" onClick={handleTestRoute}>
          مسیر تست: تهران → چالوس
        </button>

        {routeResult && (
          <p className={`route-result ${routeResult.isError ? "route-result--error" : "route-result--ok"}`}>
            {routeResult.text}
          </p>
        )}

        <p className="section-status">
          {loading && "در حال گرفتن مکان‌ها..."}
          {error && `خطا: ${error}`}
          {!loading && !error && `${places.length} مکان روی نقشه`}
        </p>

        <MapView onMapReady={setMap} />
        <PlacesLayer map={map} places={places} favoriteIds={favoriteIds} />
        <UserLocationMarker map={map} location={location} />
        <RouteLayer map={map} routeRequest={routeRequest} onResult={setRouteResult} />

        <div style={{ marginTop: "20px" }}>
          {!loading && !error && (
            <PlacesList
              places={places}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavoriteFromList}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

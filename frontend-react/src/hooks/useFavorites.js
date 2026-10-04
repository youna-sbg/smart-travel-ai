import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGetFavorites, apiAddFavorite, apiRemoveFavorite } from "../api/favorites";

function useFavorites() {
  const { currentUser, getToken } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const loadFavorites = useCallback(async () => {
    if (!currentUser) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const favorites = await apiGetFavorites(getToken());
      setFavoriteIds(new Set(favorites.map((p) => p.id)));
    } catch (err) {
      console.error("خطا در گرفتن لیست علاقه‌مندی‌ها:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // هر وقت کاربر لاگین/خروج کرد، لیست علاقه‌مندی‌ها رو دوباره بگیر
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function toggleFavorite(placeId) {
    if (!currentUser) return false; // فراخوان (UI) باید قبلش چک کنه کاربر لاگینه یا نه

    const token = getToken();
    try {
      if (favoriteIds.has(placeId)) {
        await apiRemoveFavorite(placeId, token);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(placeId);
          return next;
        });
      } else {
        await apiAddFavorite(placeId, token);
        setFavoriteIds((prev) => new Set(prev).add(placeId));
      }
      return true;
    } catch (err) {
      console.error("خطا در تغییر وضعیت علاقه‌مندی:", err);
      return false;
    }
  }

  return { favoriteIds, toggleFavorite };
}

export default useFavorites;

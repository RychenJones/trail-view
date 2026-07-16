const FAVORITES_KEY = 'favoriteTrails';

export function addFavorite(trail) {
  if (!trail) return;

  const favorites = JSON.parse(
    localStorage.getItem(FAVORITES_KEY)
  ) || [];

  // Prevent duplicates
  const alreadyFavorite = favorites.some(
    favorite => favorite.id === trail.id
  );

  if (!alreadyFavorite) {
    favorites.push(trail);
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }
}

export function removeFavorite(trailId) {
  const favorites = JSON.parse(
    localStorage.getItem(FAVORITES_KEY)
  ) || [];

  const updatedFavorites = favorites.filter(
    favorite => favorite.id !== trailId
  );

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(updatedFavorites)
  );
}

export function isFavorite(trailId) {
  const favorites = JSON.parse(
    localStorage.getItem(FAVORITES_KEY)
  ) || [];

  return favorites.some(
    favorite => favorite.id === trailId
  );
}



const FAVORITES_KEY = 'favoriteTrails';

function readFavorites() {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.warn('Unable to read favorites:', error);
    return [];
  }
}

function writeFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn('Unable to save favorites:', error);
  }
}

export function addFavorite(trail) {
  if (!trail) return;

  const favorites = readFavorites();
  const alreadyFavorite = favorites.some(
    favorite => favorite.id === trail.id
  );

  if (!alreadyFavorite) {
    favorites.push(trail);
    writeFavorites(favorites);
  }
}

export function removeFavorite(trailId) {
  const favorites = readFavorites();
  const updatedFavorites = favorites.filter(
    favorite => favorite.id !== trailId
  );

  writeFavorites(updatedFavorites);
}

export function isFavorite(trailId) {
  const favorites = readFavorites();

  return favorites.some(
    favorite => favorite.id === trailId
  );
}



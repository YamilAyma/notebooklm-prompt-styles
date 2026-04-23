/**
 * favorites.js — localStorage-backed favorites system
 */

const STORAGE_KEY = 'nlm-favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function isFavorite(styleId) {
  return getFavorites().includes(styleId);
}

export function toggleFavorite(styleId) {
  const favs = getFavorites();
  const index = favs.indexOf(styleId);
  if (index === -1) {
    favs.push(styleId);
  } else {
    favs.splice(index, 1);
  }
  saveFavorites(favs);
  return index === -1; // returns true if now favorited
}

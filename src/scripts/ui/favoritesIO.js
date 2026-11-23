/**
 * favoritesIO.js — Buttons to export the favorites to a file and import them back
 */

import { getFavorites, saveFavorites } from '../favorites.js';
import { serializeFavorites, parseFavorites, mergeFavorites } from '../../lib/favoritesIO.js';
import { showToast } from '../utils.js';
import { t } from '../i18n.js';

/**
 * @param {string[]} knownIds ids of every style of the catalog
 * @param {() => void} onChange called after the favorites changed (to refresh the page)
 */
export function initFavoritesIO(knownIds, onChange) {
  const exportBtn = document.getElementById('fav-export');
  const importBtn = document.getElementById('fav-import');
  const fileInput = document.getElementById('fav-file');
  if (!exportBtn || !importBtn || !fileInput) return;

  exportBtn.addEventListener('click', () => {
    const favorites = getFavorites().filter((id) => knownIds.includes(id));
    if (favorites.length === 0) {
      showToast(t('favNone'));
      return;
    }

    const blob = new Blob([serializeFavorites(favorites)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'notebooklm-favorites.json';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(t('favExported').replace('{n}', favorites.length));
  });

  importBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const [file] = fileInput.files;
    fileInput.value = ''; // so the same file can be chosen again
    if (!file) return;

    try {
      const { ids } = parseFavorites(await file.text(), knownIds);
      const current = getFavorites();
      const merged = mergeFavorites(current, ids);
      saveFavorites(merged);
      showToast(t('favImported').replace('{n}', merged.length - current.length));
      onChange();
    } catch {
      showToast(t('favInvalid'));
    }
  });
}

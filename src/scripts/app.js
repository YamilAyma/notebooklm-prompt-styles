/**
 * app.js — Core orchestration engine for NotebookLM Styles Showcase
 */

import { isFavorite } from './favorites.js';
import { initTooltip } from './tooltip.js';
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initBottomSheet } from './ui/bottomSheet.js';
import { initShare } from './ui/share.js';
import { createCard, hydrateCard } from './ui/card.js';
import { initStylePage } from './ui/stylePage.js';
import { showToast, normalizeText } from './utils.js';
import { applyTranslations, setLang, getLang, t } from './i18n.js';

// ─── State ──────────────────────────────────────────────────────────

let stylesData = null;
let currentStyles = [];
let itemsToShow = 12;
let displayedCount = 0;
let showOnlyFavorites = false;
let searchTerms = []; // normalized words of the current search (empty = no search)
let needsHydration = true; // first render adopts prerendered cards

// ─── Init ───────────────────────────────────────────────────────────

async function init() {
  await handlePreloader();

  try {
    const res = await fetch('/data/styles.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    stylesData = await res.json();
  } catch (err) {
    console.error('Failed to load styles data:', err);
    showEmptyState();
    return;
  }

  const app = document.getElementById('app');
  const landing = document.getElementById('landing');
  
  if (app) {
    const categoryId = app?.getAttribute('data-category') || 'all';
    initSearch(categoryId);
    applyFilters(categoryId);
    initFavFilter();
    initPagination();
    updateFavBadge();
  } else if (landing) {
    renderFeaturedStyles();
  }

  // Initialize modules
  initTooltip();
  initNavigation(stylesData.categories, app?.getAttribute('data-category') || 'all');
  initBottomSheet();
  initStylePage();
  initShare();
  initTheme();
  initI18n();
}

function renderFeaturedStyles() {
  const grid = document.getElementById('featured-grid');
  if (!grid || !stylesData) return;

  const allStyles = stylesData.categories.flatMap(c => c.styles);
  // Get 6 unique styles for the landing
  const featured = allStyles.slice(0, 6);

  const prerendered = [...grid.querySelectorAll('.style-card[data-ssr]')];
  const hydrated = prerendered.length === featured.length
    && prerendered.every((el, i) => el.dataset.styleId === featured[i].id && hydrateCard(el, featured[i]));
  if (hydrated) {
    prerendered.forEach(el => el.removeAttribute('data-ssr'));
    return;
  }

  grid.innerHTML = '';
  featured.forEach(style => {
    const card = createCard(style);
    grid.appendChild(card);
  });
}

function initI18n() {
  const trigger = document.getElementById('lang-trigger');
  const menu = document.getElementById('lang-menu');
  const codeEl = document.getElementById('current-lang-code');

  if (!trigger || !menu) return;

  const updateTrigger = () => {
    const lang = getLang();
    const flags = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷' };
    if (codeEl) codeEl.textContent = flags[lang] || lang.toUpperCase();
  };

  updateTrigger();
  applyTranslations();

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = menu.getAttribute('data-visible') === 'true';
    if (isVisible) {
      closeMenu();
    } else {
      menu.hidden = false;
      setTimeout(() => menu.setAttribute('data-visible', 'true'), 10);
    }
  });

  const closeMenu = () => {
    menu.setAttribute('data-visible', 'false');
    setTimeout(() => { 
      if (menu.getAttribute('data-visible') === 'false') menu.hidden = true; 
    }, 300);
  };

  document.addEventListener('click', closeMenu);

  menu.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLang(lang);
      updateTrigger();
      closeMenu();
      
      // Refresh dynamic content
      const app = document.getElementById('app');
      applyFilters(app?.getAttribute('data-category') || 'all');
      
      // Also notify navigation to re-render with new language
      initNavigation(stylesData.categories, app?.getAttribute('data-category') || 'all');
    });
  });
}

async function handlePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  if (sessionStorage.getItem('preloaderShown')) {
    preloader.style.display = 'none';
    return;
  }

  document.body.style.overflow = 'hidden';
  return new Promise(resolve => {
    setTimeout(() => {
      preloader.classList.add('preloader--hidden');
      document.body.style.overflow = '';
      sessionStorage.setItem('preloaderShown', 'true');
      setTimeout(() => {
        preloader.style.display = 'none';
        resolve();
      }, 500);
    }, 800);
  });
}

function initPagination() {
  const loadMoreBtn = document.getElementById('load-more');
  loadMoreBtn?.addEventListener('click', () => renderNextBatch());
}

// ─── Filtering & State ──────────────────────────────────────────────

function applyFilters(categoryId = 'all') {
  // Search is global: while searching, the category is ignored.
  const searching = searchTerms.length > 0;
  const visibleCategories = categoryId === 'all' || searching
    ? stylesData.categories
    : stylesData.categories.filter(c => c.id === categoryId);

  let filtered = visibleCategories.flatMap(c => c.styles);

  if (searching) {
    filtered = filtered.filter(s => searchTerms.every(term => s.searchText.includes(term)));
  }

  if (showOnlyFavorites) {
    filtered = filtered.filter(s => isFavorite(s.id));
  }

  currentStyles = filtered;
  displayedCount = 0;

  updateUI(filtered.length);
}

function updateUI(count) {
  const countEl = document.getElementById('style-count');
  if (countEl) countEl.textContent = count;

  const grid = document.getElementById('styles-grid');
  if (grid) {
    if (needsHydration) {
      needsHydration = false;
      if (hydratePrerendered(grid)) return;
    }

    grid.innerHTML = '';
    if (count === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderNextBatch();
    }
  }
}

/**
 * Adopts the cards prerendered at build time (first page of the current
 * category) instead of re-creating them. Returns false if they do not match
 * the data, so the caller falls back to a full client render.
 */
function hydratePrerendered(grid) {
  if (showOnlyFavorites) return false;

  const prerendered = [...grid.querySelectorAll('.style-card[data-ssr]')];
  if (prerendered.length === 0 || prerendered.length > currentStyles.length) return false;

  const matches = prerendered.every((el, i) => el.dataset.styleId === currentStyles[i].id);
  if (!matches) return false;

  const onFavorite = (id, isFav) => handleFavoriteUpdate(isFav);
  const ok = prerendered.every((el, i) => hydrateCard(el, currentStyles[i], onFavorite));
  if (!ok) return false;

  prerendered.forEach(el => el.removeAttribute('data-ssr'));
  hideEmptyState();
  displayedCount = prerendered.length;
  updatePagination();
  return true;
}

function handleFavoriteUpdate(isFav) {
  updateFavBadge();
  // If we are in favorites view and removed one, re-apply filters
  if (showOnlyFavorites && !isFav) {
    const app = document.getElementById('app');
    applyFilters(app?.getAttribute('data-category') || 'all');
  }
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  if (pagination) pagination.hidden = displayedCount >= currentStyles.length;
}

// ─── Search ─────────────────────────────────────────────────────────

function initSearch(categoryId) {
  const bar = document.getElementById('search-bar');
  const input = document.getElementById('style-search');
  if (!bar || !input) return;

  bar.hidden = false;

  const apply = () => {
    searchTerms = normalizeText(input.value).split(/\s+/).filter(Boolean);

    const url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);

    const note = document.getElementById('category-note');
    if (note) note.hidden = searchTerms.length > 0;

    applyFilters(categoryId);
  };

  const initial = new URLSearchParams(window.location.search).get('q');
  if (initial) {
    input.value = initial;
    searchTerms = normalizeText(initial).split(/\s+/).filter(Boolean);
    const note = document.getElementById('category-note');
    if (note) note.hidden = true;
  }

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 150);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && input.value) {
      input.value = '';
      apply();
      e.stopPropagation();
    }
  });

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      input.focus();
    }
  });
}

function initFavFilter() {
  const favTrigger = document.getElementById('fav-trigger');
  favTrigger?.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    favTrigger.classList.toggle('fab-fav--active', showOnlyFavorites);
    favTrigger.querySelector('.fab-fav__icon').textContent = showOnlyFavorites ? '♥' : '♡';
    
    const app = document.getElementById('app');
    applyFilters(app?.getAttribute('data-category') || 'all');
  });
}

// ─── Rendering ──────────────────────────────────────────────────────

function renderNextBatch() {
  const grid = document.getElementById('styles-grid');
  if (!grid) return;

  const nextBatch = currentStyles.slice(displayedCount, displayedCount + itemsToShow);
  
  for (const style of nextBatch) {
    const card = createCard(style, (id, isFav) => handleFavoriteUpdate(isFav));
    grid.appendChild(card);
  }

  displayedCount += nextBatch.length;
  updatePagination();
}

// ─── Helpers ────────────────────────────────────────────────────────

function updateFavBadge() {
  const badge = document.getElementById('fav-badge');
  const trigger = document.getElementById('fav-trigger');
  if (!badge || !trigger || !stylesData) return;

  const count = stylesData.categories
    .flatMap(c => c.styles)
    .filter(s => isFavorite(s.id))
    .length;
  
  badge.textContent = count;
  trigger.classList.toggle('fab-fav--has-items', count > 0);
}

function showEmptyState() {
  const grid = document.getElementById('styles-grid');
  const empty = document.getElementById('empty-state');
  if (grid) grid.hidden = true;
  if (empty) {
    // Remember the page's own message, and swap it only for search misses
    empty.defaultMessage ??= { key: empty.getAttribute('data-i18n'), text: empty.textContent };
    if (searchTerms.length > 0) {
      empty.setAttribute('data-i18n', 'emptySearch');
      empty.textContent = t('emptySearch');
    } else {
      const { key, text } = empty.defaultMessage;
      if (key) empty.setAttribute('data-i18n', key);
      else empty.removeAttribute('data-i18n');
      empty.textContent = key ? t(key) : text;
    }
    empty.hidden = false;
  }
}

function hideEmptyState() {
  const grid = document.getElementById('styles-grid');
  const empty = document.getElementById('empty-state');
  if (grid) grid.hidden = false;
  if (empty) empty.hidden = true;
}

// ─── Boot ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);

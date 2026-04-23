/**
 * app.js — Core orchestration engine for NotebookLM Styles Showcase
 */

import { isFavorite } from './favorites.js';
import { initTooltip } from './tooltip.js';
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initBottomSheet } from './ui/bottomSheet.js';
import { initShare } from './ui/share.js';
import { createCard } from './ui/card.js';
import { showToast } from './utils.js';

// ─── State ──────────────────────────────────────────────────────────

let stylesData = null;
let currentStyles = [];
let itemsToShow = 12;
let displayedCount = 0;
let showOnlyFavorites = false;

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
  const categoryId = app?.getAttribute('data-category') || 'all';

  // Initial Filter
  applyFilters(categoryId);

  // Initialize modules
  initTooltip();
  initNavigation(stylesData.categories, categoryId);
  initBottomSheet();
  initShare();
  initTheme();
  
  initFavFilter();
  initPagination();
  updateFavBadge();
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
      }, 2000);
    }, 2000);
  });
}

function initPagination() {
  const loadMoreBtn = document.getElementById('load-more');
  loadMoreBtn?.addEventListener('click', () => renderNextBatch());
}

// ─── Filtering & State ──────────────────────────────────────────────

function applyFilters(categoryId = 'all') {
  const visibleCategories = categoryId === 'all'
    ? stylesData.categories
    : stylesData.categories.filter(c => c.id === categoryId);

  let filtered = visibleCategories.flatMap(c => c.styles);

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
    grid.innerHTML = '';
    if (count === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderNextBatch();
    }
  }
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
  const pagination = document.getElementById('pagination');
  if (!grid) return;

  const nextBatch = currentStyles.slice(displayedCount, displayedCount + itemsToShow);
  
  for (const style of nextBatch) {
    const card = createCard(style, (id, isFav) => {
      updateFavBadge();
      // If we are in favorites view and removed one, re-apply filters
      if (showOnlyFavorites && !isFav) {
        const app = document.getElementById('app');
        applyFilters(app?.getAttribute('data-category') || 'all');
      }
    });
    grid.appendChild(card);
  }

  displayedCount += nextBatch.length;

  if (pagination) {
    pagination.hidden = displayedCount >= currentStyles.length;
  }
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
  if (empty) empty.hidden = false;
}

function hideEmptyState() {
  const grid = document.getElementById('styles-grid');
  const empty = document.getElementById('empty-state');
  if (grid) grid.hidden = false;
  if (empty) empty.hidden = true;
}

// ─── Boot ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);

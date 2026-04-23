/**
 * app.js — Core rendering engine for NotebookLM Styles Showcase
 *
 * Loads styles.json, renders bento grid cards, manages image rotation,
 * and coordinates tooltip, favorites, navigation, and bottom sheet.
 */

import { isFavorite, toggleFavorite } from './favorites.js';
import { initTooltip, show as showTooltip, scheduleHide as hideTooltip } from './tooltip.js';
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';

// ─── State ──────────────────────────────────────────────────────────

let stylesData = null;
let currentStyles = [];
let itemsToShow = 12;
let displayedCount = 0;
let imageRotationTimers = new Map();
let showOnlyFavorites = false;

// ─── Init ───────────────────────────────────────────────────────────

async function init() {
  // ─── Handle Preloader ──────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  const hasSeenPreloader = sessionStorage.getItem('preloaderShown');

  if (preloader) {
    if (hasSeenPreloader) {
      preloader.style.display = 'none';
    } else {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        preloader.classList.add('preloader--hidden');
        document.body.style.overflow = '';
        sessionStorage.setItem('preloaderShown', 'true');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 2000);
      }, 2000);
    }
  }

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
  const category = app?.getAttribute('data-category') || 'all';

  // Filter styles by category
  const visibleCategories = category === 'all'
    ? stylesData.categories
    : stylesData.categories.filter(c => c.id === category);

  // Flatten all visible styles
  currentStyles = visibleCategories.flatMap(c => c.styles);

  if (currentStyles.length === 0) {
    showEmptyState();
    return;
  }

  // Update style count
  const countEl = document.getElementById('style-count');
  if (countEl) countEl.textContent = currentStyles.length;

  // Reset pagination
  displayedCount = 0;
  const grid = document.getElementById('styles-grid');
  if (grid) grid.innerHTML = '';

  // Render first batch
  renderNextBatch();

  // Initialize modules
  initTooltip();
  initNavigation(stylesData.categories, category);
  initBottomSheet();
  initFavFilter();
  updateFavBadge();
  initShare();
  initPagination();
  initTheme();
}

function initPagination() {
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      renderNextBatch();
    });
  }
}

// ─── Render Grid ────────────────────────────────────────────────────

function renderNextBatch() {
  const grid = document.getElementById('styles-grid');
  const pagination = document.getElementById('pagination');
  if (!grid) return;

  const nextBatch = currentStyles.slice(displayedCount, displayedCount + itemsToShow);
  
  for (const style of nextBatch) {
    const card = createCard(style);
    grid.appendChild(card);
  }

  displayedCount += nextBatch.length;

  // Show/hide pagination
  if (pagination) {
    pagination.hidden = displayedCount >= currentStyles.length;
  }
}

function createCard(style) {
  const card = document.createElement('article');
  card.className = 'style-card';
  card.setAttribute('data-style-id', style.id);

  // Random starting image
  const startIndex = Math.floor(Math.random() * style.previews.length);
  const imgSrc = style.previews[startIndex];

  // Image
  const imgContainer = document.createElement('div');
  imgContainer.className = 'style-card__image-container';

  const img = document.createElement('img');
  img.className = 'style-card__image';
  img.src = imgSrc;
  img.alt = `${style.name} — slide style preview`;
  img.loading = 'lazy';
  img.width = 400;
  img.height = 300;
  imgContainer.appendChild(img);
  card.appendChild(imgContainer);

  // Favorite button
  const favBtn = document.createElement('button');
  favBtn.className = 'style-card__fav';
  const isFav = isFavorite(style.id);
  if (isFav) favBtn.classList.add('style-card__fav--active');
  favBtn.innerHTML = isFav ? '♥' : '♡';
  favBtn.setAttribute('aria-label', `${isFav ? 'Remove from' : 'Add to'} favorites`);
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(style.id);
    
    // Pulse animation
    favBtn.classList.remove('style-card__fav--active');
    if (nowFav) {
      void favBtn.offsetWidth; // trigger reflow
      favBtn.classList.add('style-card__fav--active');
    }
    
    favBtn.innerHTML = nowFav ? '♥' : '♡';
    favBtn.classList.toggle('style-card__fav--active', nowFav);
    favBtn.setAttribute('aria-label', `${nowFav ? 'Remove from' : 'Add to'} favorites`);
    updateFavBadge();
    
    // If we are in favorites view and removed one, re-render
    if (showOnlyFavorites && !nowFav) {
      setTimeout(() => filterStyles(), 300);
    }
  });
  card.appendChild(favBtn);

  // Info bar
  const info = document.createElement('div');
  info.className = 'style-card__info';

  const colorDot = document.createElement('span');
  colorDot.className = 'style-card__color-dot';
  colorDot.style.backgroundColor = style.colors?.primary || '#888';
  info.appendChild(colorDot);

  const name = document.createElement('span');
  name.className = 'style-card__name';
  name.textContent = style.name;
  info.appendChild(name);

  card.appendChild(info);

  // ─── Interactions ─────────────────────────────────────────────

  // Image rotation on hover
  let rotationIndex = startIndex;

  card.addEventListener('mouseenter', () => {
    if (style.previews.length <= 1) return;

    const timer = setInterval(() => {
      rotationIndex = (rotationIndex + 1) % style.previews.length;
      img.classList.add('style-card__image--fading');
      setTimeout(() => {
        img.src = style.previews[rotationIndex];
        img.classList.remove('style-card__image--fading');
      }, 250);
    }, 1500);

    imageRotationTimers.set(style.id, timer);

    // Show tooltip (desktop only)
    const rect = card.getBoundingClientRect();
    showTooltip(style, rect);
  });

  card.addEventListener('mouseleave', () => {
    const timer = imageRotationTimers.get(style.id);
    if (timer) {
      clearInterval(timer);
      imageRotationTimers.delete(style.id);
    }
    hideTooltip();
  });

  // Bottom sheet on click (mobile + fallback)
  card.addEventListener('click', () => {
    openBottomSheet(style);
  });

  return card;
}

// ─── Bottom Sheet ───────────────────────────────────────────────────

function initBottomSheet() {
  const sheet = document.getElementById('bottom-sheet');
  const backdrop = sheet?.querySelector('.bottom-sheet__backdrop');
  const closeBtn = document.getElementById('sheet-close');
  const copyBtn = document.getElementById('sheet-copy');

  backdrop?.addEventListener('click', closeBottomSheet);
  closeBtn?.addEventListener('click', closeBottomSheet);

  copyBtn?.addEventListener('click', () => {
    const yaml = document.getElementById('sheet-yaml')?.textContent;
    if (yaml) {
      navigator.clipboard.writeText(yaml).then(() => {
        const textEl = copyBtn.querySelector('.copy-btn__text');
        const original = textEl.textContent;
        textEl.textContent = 'Copied!';
        copyBtn.classList.add('copy-btn--copied');
        showToast();
        setTimeout(() => {
          textEl.textContent = original;
          copyBtn.classList.remove('copy-btn--copied');
        }, 1500);
      });
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBottomSheet();
  });
}

function openBottomSheet(style) {
  const sheet = document.getElementById('bottom-sheet');
  const title = document.getElementById('sheet-title');
  const yaml = document.getElementById('sheet-yaml');

  if (!sheet) return;

  title.textContent = style.name;
  yaml.textContent = style.yamlContent;

  sheet.hidden = false;
  sheet.offsetHeight; // reflow
  sheet.setAttribute('data-visible', 'true');
  document.body.style.overflow = 'hidden';
}

function closeBottomSheet() {
  const sheet = document.getElementById('bottom-sheet');
  if (!sheet) return;

  sheet.setAttribute('data-visible', 'false');
  document.body.style.overflow = '';
  setTimeout(() => { sheet.hidden = true; }, 400);
}

// ─── Favorites Filter ─────────────────────────────────────────────

function initFavFilter() {
  const favTrigger = document.getElementById('fav-trigger');
  if (!favTrigger) return;

  favTrigger.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    favTrigger.classList.toggle('fab-fav--active', showOnlyFavorites);
    favTrigger.querySelector('.fab-fav__icon').textContent = showOnlyFavorites ? '♥' : '♡';
    filterStyles();
  });
}

function filterStyles() {
  const app = document.getElementById('app');
  const category = app?.getAttribute('data-category') || 'all';

  const visibleCategories = category === 'all'
    ? stylesData.categories
    : stylesData.categories.filter(c => c.id === category);

  let filtered = visibleCategories.flatMap(c => c.styles);

  if (showOnlyFavorites) {
    filtered = filtered.filter(s => isFavorite(s.id));
  }

  // Update count
  const countEl = document.getElementById('style-count');
  if (countEl) countEl.textContent = filtered.length;

  // Update state and re-render grid
  currentStyles = filtered;
  displayedCount = 0;
  const grid = document.getElementById('styles-grid');
  if (grid) grid.innerHTML = '';

  if (currentStyles.length === 0) {
    showEmptyState();
  } else {
    const empty = document.getElementById('empty-state');
    if (grid) grid.hidden = false;
    if (empty) empty.hidden = true;
    renderNextBatch();
  }
}

function updateFavBadge() {
  const badge = document.getElementById('fav-badge');
  const trigger = document.getElementById('fav-trigger');
  if (!badge || !trigger) return;

  const count = stylesData.categories.flatMap(c => c.styles).filter(s => isFavorite(s.id)).length;
  
  badge.textContent = count;
  trigger.classList.toggle('fab-fav--has-items', count > 0);
}

// ─── Share ─────────────────────────────────────────────────────────

function initShare() {
  const shareBtn = document.getElementById('share-trigger');
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const title = encodeURIComponent('NotebookLM Slide Styles: Curated visual design prompts for your research!');

  // Platform specific links
  const linkedin = document.getElementById('share-linkedin');
  const reddit = document.getElementById('share-reddit');
  const x = document.getElementById('share-x');

  if (linkedin) linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  if (reddit) reddit.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${title}`;
  if (x) x.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;

  if (!shareBtn) return;

  shareBtn.addEventListener('click', () => {
    const shareData = {
      title: 'NotebookLM Slide Styles',
      text: 'Check out these awesome visual design styles for NotebookLM!',
      url: url
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        showToast();
      });
    }
  });
}

// ─── Helpers ────────────────────────────────────────────────────────

function showEmptyState() {
  const grid = document.getElementById('styles-grid');
  const empty = document.getElementById('empty-state');
  if (grid) grid.hidden = true;
  if (empty) empty.hidden = false;
}

function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.hidden = false;
  toast.setAttribute('data-visible', 'true');
  setTimeout(() => {
    toast.setAttribute('data-visible', 'false');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 1800);
}

// ─── Boot ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);

/**
 * app.js — Core rendering engine for NotebookLM Styles Showcase
 *
 * Loads styles.json, renders bento grid cards, manages image rotation,
 * and coordinates tooltip, favorites, navigation, and bottom sheet.
 */

import { isFavorite, toggleFavorite } from './favorites.js';
import { initTooltip, show as showTooltip, scheduleHide as hideTooltip } from './tooltip.js';
import { initNavigation } from './navigation.js';

// ─── State ──────────────────────────────────────────────────────────

let stylesData = null;
let imageRotationTimers = new Map();

// ─── Init ───────────────────────────────────────────────────────────

async function init() {
  // ─── Handle Preloader ──────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      preloader.classList.add('preloader--hidden');
      document.body.style.overflow = '';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 2000);
    }, 2000);
  }

  try {
    const res = await fetch('data/styles.json');
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
  const visibleStyles = visibleCategories.flatMap(c => c.styles);

  if (visibleStyles.length === 0) {
    showEmptyState();
    return;
  }

  // Update style count
  const countEl = document.getElementById('style-count');
  if (countEl) countEl.textContent = visibleStyles.length;

  // Render grid
  renderGrid(visibleStyles);

  // Initialize modules
  initTooltip();
  initNavigation(stylesData.categories, category);
  initBottomSheet();
}

// ─── Render Grid ────────────────────────────────────────────────────

function renderGrid(styles) {
  const grid = document.getElementById('styles-grid');
  if (!grid) return;

  grid.innerHTML = '';

  for (const style of styles) {
    const card = createCard(style);
    grid.appendChild(card);
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
    favBtn.innerHTML = nowFav ? '♥' : '♡';
    favBtn.classList.toggle('style-card__fav--active', nowFav);
    favBtn.setAttribute('aria-label', `${nowFav ? 'Remove from' : 'Add to'} favorites`);
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

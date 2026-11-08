/**
 * card.js — Component-like logic for rendering style cards
 */

import { isFavorite, toggleFavorite } from '../favorites.js';
import { show as showTooltip, scheduleHide as hideTooltip } from '../tooltip.js';
import { openBottomSheet } from './bottomSheet.js';
import { isMobile } from '../utils.js';
import { t } from '../i18n.js';
import { stylePath } from '../../lib/stylePage.js';

const imageRotationTimers = new Map();

/** Grid images: lightweight thumbnails, falling back to the originals. */
function getCardImages(style) {
  return style.thumbs?.length ? style.thumbs : style.previews;
}

export function createCard(style, onFavoriteUpdate) {
  const card = document.createElement('article');
  card.className = 'style-card';
  card.setAttribute('data-style-id', style.id);

  // Random starting image
  const images = getCardImages(style);
  const imgSrc = images[Math.floor(Math.random() * images.length)];

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
  card.appendChild(createFavoriteButton(style, onFavoriteUpdate));

  // Info bar
  card.appendChild(createInfoBar(style));

  setupCardInteractions(card, img, style);

  bindOpen(card, style);

  return card;
}

/**
 * Attaches behavior to a card already rendered in the HTML (build time),
 * so it does not need to be re-created on the client.
 * The expected markup is the one produced by src/components/StyleCard.astro.
 */
export function hydrateCard(card, style, onFavoriteUpdate) {
  const img = card.querySelector('.style-card__image');
  const favBtn = card.querySelector('.style-card__fav');
  if (!img || !favBtn) return false;

  bindFavoriteButton(favBtn, style, onFavoriteUpdate);
  setupCardInteractions(card, img, style);
  card.querySelector('.style-card__name')?.addEventListener('click', (e) => e.stopPropagation());
  bindOpen(card, style);
  return true;
}

/** Opens the YAML sheet on click, and on Enter / Space for keyboard users. */
function bindOpen(card, style) {
  card.tabIndex = 0;
  card.setAttribute('aria-haspopup', 'dialog');

  card.addEventListener('click', () => openBottomSheet(style));
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return; // let the favorite button handle its own keys
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBottomSheet(style);
    }
  });
}

function createFavoriteButton(style, onFavoriteUpdate) {
  const favBtn = document.createElement('button');
  favBtn.className = 'style-card__fav';
  bindFavoriteButton(favBtn, style, onFavoriteUpdate);
  return favBtn;
}

function bindFavoriteButton(favBtn, style, onFavoriteUpdate) {
  const updateState = () => {
    const isFav = isFavorite(style.id);
    favBtn.classList.toggle('style-card__fav--active', isFav);
    favBtn.textContent = isFav ? '♥' : '♡';
    favBtn.setAttribute('aria-label', t(isFav ? 'ariaFavRemove' : 'ariaFavAdd'));
  };

  updateState();

  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(style.id);

    // Animation
    if (nowFav) {
      favBtn.classList.remove('style-card__fav--active');
      void favBtn.offsetWidth; // trigger reflow
      favBtn.classList.add('style-card__fav--active');
    }

    updateState();
    if (onFavoriteUpdate) onFavoriteUpdate(style.id, nowFav);
  });
}

function createInfoBar(style) {
  const info = document.createElement('div');
  info.className = 'style-card__info';

  const colorDot = document.createElement('span');
  colorDot.className = 'style-card__color-dot';
  colorDot.style.backgroundColor = style.colors?.primary || '#888';

  const name = document.createElement('a');
  name.className = 'style-card__name';
  name.href = stylePath(style.id);
  name.textContent = style.name;
  name.addEventListener('click', (e) => e.stopPropagation()); // go to the page, do not open the sheet

  info.appendChild(colorDot);
  info.appendChild(name);
  return info;
}

function setupCardInteractions(card, img, style) {
  const images = getCardImages(style);
  let rotationIndex = Math.max(
    0,
    images.findIndex((p) => img.src.endsWith(p)),
  );

  const startRotation = () => {
    if (images.length <= 1 || imageRotationTimers.has(style.id)) return;

    const timer = setInterval(() => {
      rotationIndex = (rotationIndex + 1) % images.length;
      img.classList.add('style-card__image--fading');
      setTimeout(() => {
        img.src = images[rotationIndex];
        img.classList.remove('style-card__image--fading');
      }, 250);
    }, 2500);

    imageRotationTimers.set(style.id, timer);
  };

  const stopRotation = () => {
    const timer = imageRotationTimers.get(style.id);
    if (timer) {
      clearInterval(timer);
      imageRotationTimers.delete(style.id);
    }
  };

  if (isMobile()) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startRotation();
          else stopRotation();
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(card);
  } else {
    card.addEventListener('mouseenter', () => {
      startRotation();
      const rect = card.getBoundingClientRect();
      showTooltip(style, rect);
    });

    card.addEventListener('mouseleave', () => {
      stopRotation();
      hideTooltip();
    });
  }
}

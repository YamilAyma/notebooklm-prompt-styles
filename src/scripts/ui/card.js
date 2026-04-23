/**
 * card.js — Component-like logic for rendering style cards
 */

import { isFavorite, toggleFavorite } from '../favorites.js';
import { show as showTooltip, scheduleHide as hideTooltip } from '../tooltip.js';
import { openBottomSheet } from './bottomSheet.js';
import { isMobile } from '../utils.js';

const imageRotationTimers = new Map();

export function createCard(style, onFavoriteUpdate) {
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
  const favBtn = createFavoriteButton(style, onFavoriteUpdate);
  card.appendChild(favBtn);

  // Info bar
  const info = createInfoBar(style);
  card.appendChild(info);

  // Interactions
  setupCardInteractions(card, img, style);

  // Bottom sheet on click
  card.addEventListener('click', () => {
    openBottomSheet(style);
  });

  return card;
}

function createFavoriteButton(style, onFavoriteUpdate) {
  const favBtn = document.createElement('button');
  favBtn.className = 'style-card__fav';
  
  const updateState = () => {
    const isFav = isFavorite(style.id);
    favBtn.classList.toggle('style-card__fav--active', isFav);
    favBtn.innerHTML = isFav ? '♥' : '♡';
    favBtn.setAttribute('aria-label', `${isFav ? 'Remove from' : 'Add to'} favorites`);
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

  return favBtn;
}

function createInfoBar(style) {
  const info = document.createElement('div');
  info.className = 'style-card__info';

  const colorDot = document.createElement('span');
  colorDot.className = 'style-card__color-dot';
  colorDot.style.backgroundColor = style.colors?.primary || '#888';
  
  const name = document.createElement('span');
  name.className = 'style-card__name';
  name.textContent = style.name;

  info.appendChild(colorDot);
  info.appendChild(name);
  return info;
}

function setupCardInteractions(card, img, style) {
  let rotationIndex = style.previews.indexOf(img.src);

  const startRotation = () => {
    if (style.previews.length <= 1 || imageRotationTimers.has(style.id)) return;
    
    const timer = setInterval(() => {
      rotationIndex = (rotationIndex + 1) % style.previews.length;
      img.classList.add('style-card__image--fading');
      setTimeout(() => {
        img.src = style.previews[rotationIndex];
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startRotation();
        else stopRotation();
      });
    }, { threshold: 0.1 });
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

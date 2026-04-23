/**
 * navigation.js — Floating hamburger menu + category modal
 */

import { t } from './i18n.js';

let navModal, navList, navTrigger, backdrop;
let isOpen = false;

export function initNavigation(categories, currentCategory) {
  navModal = document.getElementById('nav-modal');
  navList = document.getElementById('nav-list');
  navTrigger = document.getElementById('nav-trigger');
  backdrop = navModal?.querySelector('.nav-modal__backdrop');

  if (!navModal || !navTrigger) return;

  // Build nav list
  buildNavList(categories, currentCategory);

  // Toggle on FAB click
  navTrigger.addEventListener('click', toggle);

  // Close on backdrop click
  backdrop?.addEventListener('click', close);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
}

function buildNavList(categories, currentCategory) {
  let html = '';

  // "Home" link
  const isHome = window.location.pathname === '/';
  const homeActive = isHome ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__item">
      <a href="/" class="nav-modal__link${homeActive}">
        <span class="nav-modal__emoji">🏠</span>
        Home
      </a>
    </li>
    <li class="nav-modal__divider"></li>
  `;

  // "All Styles" link
  const isStyles = window.location.pathname === '/styles';
  const allActive = isStyles ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__item">
      <a href="/styles" class="nav-modal__link${allActive}">
        <span class="nav-modal__emoji">✦</span>
        ${t('navAll')}
      </a>
    </li>
  `;

  // "Get Skill" link
  const isSkill = window.location.pathname === '/get-skill';
  const skillActive = isSkill ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__item">
      <a href="/get-skill" class="nav-modal__link${skillActive}">
        <span class="nav-modal__emoji">🛠️</span>
        ${t('navGetSkill')}
      </a>
    </li>
    <li class="nav-modal__divider"></li>
  `;

  for (const cat of categories) {
    const active = currentCategory === cat.id ? ' nav-modal__link--active' : '';
    const label = t('nav-' + cat.id) || cat.name;
    html += `
      <li class="nav-modal__item">
        <a href="/styles/${cat.id}" class="nav-modal__link${active}">
          <span class="nav-modal__emoji">${cat.emoji}</span>
          ${label}
        </a>
      </li>
    `;
  }
  
  // "How To" link
  const howToActive = window.location.pathname === '/how-to' ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__divider"></li>
    <li class="nav-modal__item">
      <a href="/how-to" class="nav-modal__link${howToActive}">
        <span class="nav-modal__emoji">📖</span>
        ${t('nav-how-to')}
      </a>
    </li>
  `;

  // "About" link
  const aboutActive = window.location.pathname === '/about' ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__divider"></li>
    <li class="nav-modal__item">
      <a href="/about" class="nav-modal__link${aboutActive}">
        <span class="nav-modal__emoji">ℹ️</span>
        ${t('nav-about')}
      </a>
    </li>
  `;

  navList.innerHTML = html;
}

function toggle() {
  isOpen ? close() : open();
}

function open() {
  isOpen = true;
  navModal.hidden = false;
  navTrigger.classList.add('fab--open');
  // Trigger reflow for animation
  navModal.offsetHeight;
  navModal.setAttribute('data-visible', 'true');
}

function close() {
  isOpen = false;
  navModal.setAttribute('data-visible', 'false');
  navTrigger.classList.remove('fab--open');
  setTimeout(() => {
    navModal.hidden = true;
  }, 300);
}

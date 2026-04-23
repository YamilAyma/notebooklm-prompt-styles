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
        <span class="nav-modal__icon">
          <svg viewBox="0 0 32 32" width="20" height="20"><path fill="currentColor" d="M16.612 2.214a1.01 1.01 0 0 0-1.224 0L3.388 12.446a1.01 1.01 0 0 0-.388.804V28a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V13.25a1.01 1.01 0 0 0-.388-.804zM25 28H7V14.1l9-7.875l9 7.875z"/></svg>
        </span>
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
        <span class="nav-modal__icon">
          <svg viewBox="0 0 32 32" width="20" height="20"><path fill="currentColor" d="M10 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m0 8H4V8h6zm18-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m0 8h-6V8h6zm-18 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m0 8H4v-6h6zm18-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m0 8h-6v-6h6z"/></svg>
        </span>
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
        <span class="nav-modal__icon">
          <svg viewBox="0 0 32 32" width="20" height="20"><path fill="currentColor" d="M25 11V9h-2V7h-2V5h-2V3h-2v2h-2v2H9v2H7v2H5v2H3v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h-2zm-4 6h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2h2v-2h2V9h2V7h2v2h2v2h2v2h2v2z"/></svg>
        </span>
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
        <span class="nav-modal__icon">
          <svg viewBox="0 0 32 32" width="20" height="20"><path fill="currentColor" d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 22H6V6h20zM8 10h16v2H8zm0 5h16v2H8zm0 5h10v2H8z"/></svg>
        </span>
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
        <span class="nav-modal__icon">
          <svg viewBox="0 0 32 32" width="20" height="20"><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/><path fill="currentColor" d="M15 11h2v2h-2zm0 4h2v6h-2z"/></svg>
        </span>
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

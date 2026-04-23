/**
 * navigation.js — Floating hamburger menu + category modal
 */

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

  // "All Styles" link
  const allActive = currentCategory === 'all' ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__item">
      <a href="/" class="nav-modal__link${allActive}">
        <span class="nav-modal__emoji">✦</span>
        All Styles
      </a>
    </li>
    <li class="nav-modal__divider"></li>
  `;

  for (const cat of categories) {
    const active = currentCategory === cat.id ? ' nav-modal__link--active' : '';
    html += `
      <li class="nav-modal__item">
        <a href="/${cat.id}" class="nav-modal__link${active}">
          <span class="nav-modal__emoji">${cat.emoji}</span>
          ${cat.name}
        </a>
      </li>
    `;
  }
  
  // "About" link
  const aboutActive = window.location.pathname === '/about' ? ' nav-modal__link--active' : '';
  html += `
    <li class="nav-modal__divider"></li>
    <li class="nav-modal__item">
      <a href="/about" class="nav-modal__link${aboutActive}">
        <span class="nav-modal__emoji">ℹ️</span>
        About
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

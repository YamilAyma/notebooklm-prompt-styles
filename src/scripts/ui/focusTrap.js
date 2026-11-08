/**
 * focusTrap.js — Keeps keyboard focus inside a modal while it is open.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const isVisible = (el) => el.getClientRects().length > 0;

/**
 * Traps Tab / Shift+Tab inside `container` (plus any `include` elements, e.g. a
 * toggle button that lives outside it), moves focus in, and returns a function
 * that releases the trap and restores focus to where it was.
 */
export function activateFocusTrap(container, { initialFocus = null, include = [] } = {}) {
  const previous = document.activeElement;
  const getItems = () => [...container.querySelectorAll(FOCUSABLE), ...include].filter(isVisible);

  const onKeydown = (e) => {
    if (e.key !== 'Tab') return;

    const items = getItems();
    if (items.length === 0) {
      e.preventDefault();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (!items.includes(active)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', onKeydown);

  const target = initialFocus || getItems()[0];
  target?.focus({ preventScroll: true });

  return function release() {
    document.removeEventListener('keydown', onKeydown);
    if (previous && document.contains(previous) && typeof previous.focus === 'function') {
      previous.focus({ preventScroll: true });
    }
  };
}

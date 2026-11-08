/**
 * stylePage.js — Behavior of the per-style page (/style/<id>/)
 */

import { copyToClipboard } from '../utils.js';

export function initStylePage() {
  const page = document.getElementById('style-page');
  const copyBtn = document.getElementById('style-copy');
  if (!page || !copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const yaml = document.getElementById('style-yaml')?.textContent;
    if (!yaml) return;

    const textEl = copyBtn.querySelector('.copy-btn__text');
    const original = textEl.textContent;

    copyToClipboard(yaml, 'YAML Copied!').then((success) => {
      if (!success) return;
      textEl.textContent = 'Copied!';
      copyBtn.classList.add('copy-btn--copied');
      setTimeout(() => {
        textEl.textContent = original;
        copyBtn.classList.remove('copy-btn--copied');
      }, 1500);
    });
  });
}

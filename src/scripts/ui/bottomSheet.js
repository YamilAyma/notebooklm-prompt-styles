/**
 * bottomSheet.js — Logic for the YAML preview sheet on mobile
 */

import { copyToClipboard } from '../utils.js';

export function initBottomSheet() {
  const sheet = document.getElementById('bottom-sheet');
  const backdrop = sheet?.querySelector('.bottom-sheet__backdrop');
  const closeBtn = document.getElementById('sheet-close');
  const copyBtn = document.getElementById('sheet-copy');

  backdrop?.addEventListener('click', closeBottomSheet);
  closeBtn?.addEventListener('click', closeBottomSheet);

  copyBtn?.addEventListener('click', () => {
    const yaml = document.getElementById('sheet-yaml')?.textContent;
    if (yaml) {
      const textEl = copyBtn.querySelector('.copy-btn__text');
      const original = textEl.textContent;
      
      copyToClipboard(yaml, 'YAML Copied!').then(success => {
        if (success) {
          textEl.textContent = 'Copied!';
          copyBtn.classList.add('copy-btn--copied');
          setTimeout(() => {
            textEl.textContent = original;
            copyBtn.classList.remove('copy-btn--copied');
          }, 1500);
        }
      });
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBottomSheet();
  });
}

export function openBottomSheet(style) {
  const sheet = document.getElementById('bottom-sheet');
  const title = document.getElementById('sheet-title');
  const yaml = document.getElementById('sheet-yaml');

  if (!sheet || !style) return;

  title.textContent = style.name;
  yaml.textContent = style.yamlContent;

  sheet.hidden = false;
  sheet.offsetHeight; // reflow
  sheet.setAttribute('data-visible', 'true');
  document.body.style.overflow = 'hidden';
}

export function closeBottomSheet() {
  const sheet = document.getElementById('bottom-sheet');
  if (!sheet) return;

  sheet.setAttribute('data-visible', 'false');
  document.body.style.overflow = '';
  setTimeout(() => { 
    sheet.hidden = true; 
  }, 400);
}

/**
 * tooltip.js — Dynamic YAML tooltip with viewport-aware positioning
 */

import { copyToClipboard } from './utils.js';

let tooltipEl, tooltipYaml, tooltipCopy;
let currentStyleData = null;
let hideTimeout = null;

export function initTooltip() {
  tooltipEl = document.getElementById('yaml-tooltip');
  tooltipYaml = document.getElementById('tooltip-yaml');
  tooltipCopy = document.getElementById('tooltip-copy');

  if (!tooltipEl) return;

  tooltipCopy.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentStyleData) {
      const textEl = tooltipCopy.querySelector('.copy-btn__text');
      const original = textEl.textContent;
      
      copyToClipboard(currentStyleData.yamlContent, 'YAML Copied!').then(success => {
        if (success) {
          textEl.textContent = 'Copied!';
          tooltipCopy.classList.add('copy-btn--copied');
          setTimeout(() => {
            textEl.textContent = original;
            tooltipCopy.classList.remove('copy-btn--copied');
          }, 1500);
        }
      });
    }
  });

  // Keep tooltip visible when hovering over it
  tooltipEl.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
  });

  tooltipEl.addEventListener('mouseleave', () => {
    hide();
  });
}

export function show(styleData, anchorRect) {
  if (!tooltipEl || window.innerWidth < 768) return;

  clearTimeout(hideTimeout);
  currentStyleData = styleData;

  // Show first ~20 lines of YAML (Preview only)
  const lines = styleData.yamlContent.split('\n').slice(0, 20);
  tooltipYaml.textContent = lines.join('\n');

  // Position: prefer right of the card, flip if no space
  const tooltipWidth = 380;
  const tooltipHeight = 340;
  const gap = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left, top;

  // Horizontal: try right, then left, then centered
  if (anchorRect.right + gap + tooltipWidth < vw) {
    left = anchorRect.right + gap;
  } else if (anchorRect.left - gap - tooltipWidth > 0) {
    left = anchorRect.left - gap - tooltipWidth;
  } else {
    left = Math.max(gap, (vw - tooltipWidth) / 2);
  }

  // Vertical: align with card top, clamp to viewport
  top = anchorRect.top;
  if (top + tooltipHeight > vh - gap) {
    top = vh - tooltipHeight - gap;
  }
  top = Math.max(gap, top);

  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
  tooltipEl.hidden = false;
  tooltipEl.setAttribute('data-visible', 'true');
}

export function scheduleHide() {
  hideTimeout = setTimeout(hide, 200);
}

function hide() {
  if (!tooltipEl) return;
  tooltipEl.setAttribute('data-visible', 'false');
  setTimeout(() => {
    if (tooltipEl.getAttribute('data-visible') !== 'true') {
      tooltipEl.hidden = true;
    }
  }, 300);
}

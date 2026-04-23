/**
 * share.js — Logic for social hub and link sharing
 */

import { showToast } from '../utils.js';

export function initShare() {
  const shareBtn = document.getElementById('copy-trigger');
  const modalCopyBtn = document.getElementById('modal-copy');
  const socialTrigger = document.getElementById('social-trigger');
  const socialModal = document.getElementById('social-modal');
  const modalBackdrop = socialModal?.querySelector('.social-modal__backdrop');

  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const title = encodeURIComponent('NotebookLM Slide Styles: Curated visual design prompts for your research!');

  // Platform specific links
  const setLinks = (prefix) => {
    const linkedin = document.getElementById(`${prefix}linkedin`);
    const reddit = document.getElementById(`${prefix}reddit`);
    const x = document.getElementById(`${prefix}x`);

    if (linkedin) linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    if (reddit) reddit.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${title}`;
    if (x) x.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
  };

  setLinks('share-');
  setLinks('modal-');

  // Modal toggle logic
  if (socialTrigger && socialModal) {
    socialTrigger.addEventListener('click', () => {
      socialModal.hidden = false;
      setTimeout(() => socialModal.setAttribute('data-visible', 'true'), 10);
    });

    const closeSocial = () => {
      socialModal.setAttribute('data-visible', 'false');
      setTimeout(() => { 
        socialModal.hidden = true; 
      }, 300);
    };

    modalBackdrop?.addEventListener('click', closeSocial);
    
    // Close on link click
    socialModal.querySelectorAll('.social-modal__item').forEach(item => {
      item.addEventListener('click', closeSocial);
    });
  }

  const handleCopy = () => {
    const shareData = {
      title: 'NotebookLM Slide Styles',
      text: 'Check out these awesome visual design styles for NotebookLM!',
      url: url
    };

    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
      });
    }
  };

  shareBtn?.addEventListener('click', handleCopy);
  modalCopyBtn?.addEventListener('click', handleCopy);
}

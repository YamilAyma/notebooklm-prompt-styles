/**
 * utils.js — Shared utility functions
 */

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  if (message) toast.textContent = message;
  
  toast.hidden = false;
  toast.setAttribute('data-visible', 'true');
  
  setTimeout(() => {
    toast.setAttribute('data-visible', 'false');
    setTimeout(() => { 
      toast.hidden = true; 
    }, 300);
  }, 1800);
}

export function copyToClipboard(text, successMessage = 'Copied to clipboard') {
  return navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage);
    return true;
  }).catch(err => {
    console.error('Failed to copy:', err);
    return false;
  });
}

export function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

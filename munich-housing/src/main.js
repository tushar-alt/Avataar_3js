import { initPostListing } from "./js/components/postModal.js";
import { initMessaging } from "./js/components/messageModal.js";
import { initProfile } from "./js/pages/profile.js";
import { initAuth } from './js/components/authModal.js';
import { loadHomepage } from './js/pages/home.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHomepage();
  initAuth();
  initPostListing();
  initMessaging();
  initProfile();
});

// Toast utility
export const showToast = (message) => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
};

// Utility to escape HTML
export const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

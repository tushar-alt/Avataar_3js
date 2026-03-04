import { registerUser, loginUser, logoutUser, subscribeToAuthChanges } from '../firebase/auth.js';
import { showToast } from '../../main.js';

let isLoginMode = true;
export let currentUser = null;
export let currentUserProfile = null;

export const initAuth = () => {
  const loginBtn = document.getElementById('nav-login-btn');
  const userMenu = document.getElementById('nav-user-menu');
  const userEmailSpan = document.getElementById('nav-user-email');
  const logoutBtn = document.getElementById('nav-logout-btn');

  const authModal = document.getElementById('auth-modal');
  const closeAuthBtn = document.getElementById('close-auth-modal');
  const authForm = document.getElementById('auth-form');
  const authTitle = document.getElementById('auth-title');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleLink = document.getElementById('auth-toggle-link');
  const authToggleText = document.getElementById('auth-toggle-text');

  // Listen for auth state changes
  subscribeToAuthChanges((user, profile) => {
    currentUser = user;
    currentUserProfile = profile;

    if (user) {
      // User is logged in
      loginBtn.classList.add('hidden');
      userMenu.classList.remove('hidden');
      userEmailSpan.textContent = user.email;
      authModal.classList.add('hidden');
    } else {
      // User is logged out
      loginBtn.classList.remove('hidden');
      userMenu.classList.add('hidden');
      userEmailSpan.textContent = '';
    }
  });

  // Modal toggle
  loginBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
  });

  closeAuthBtn.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });

  // Switch between login and signup
  authToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
      authTitle.textContent = 'Login';
      authSubmitBtn.textContent = 'Login';
      authToggleText.textContent = "Don't have an account?";
      authToggleLink.textContent = 'Sign up';
    } else {
      authTitle.textContent = 'Sign Up';
      authSubmitBtn.textContent = 'Sign Up';
      authToggleText.textContent = 'Already have an account?';
      authToggleLink.textContent = 'Login';
    }
  });

  // Handle form submission
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      if (isLoginMode) {
        await loginUser(email, password);
        showToast('Successfully logged in');
      } else {
        await registerUser(email, password);
        showToast('Successfully registered');
      }
      authForm.reset();
    } catch (error) {
      console.error('Auth error:', error);
      showToast(error.message);
    }
  });

  // Logout
  logoutBtn.addEventListener('click', async () => {
    try {
      await logoutUser();
      showToast('Logged out');
    } catch (error) {
      showToast('Error logging out');
    }
  });
};

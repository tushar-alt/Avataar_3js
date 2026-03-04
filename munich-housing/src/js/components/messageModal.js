import { sendMessage } from '../firebase/messaging.js';
import { currentUser, currentUserProfile } from './authModal.js';
import { showToast } from '../../main.js';

export const initMessaging = () => {
  const messageModal = document.getElementById('message-modal');
  const closeMessageModal = document.getElementById('close-message-modal');
  const messageForm = document.getElementById('message-form');
  const messageBody = document.getElementById('message-body');

  let currentReceiverId = null;
  let currentListingId = null;
  let currentListingTitle = null;

  // Listen for message clicks on listing cards
  document.getElementById('listings-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-message')) {
      if (!currentUser) {
        showToast('Please login to send messages');
        return;
      }

      // Feature requirement: paid users send unlimited messages
      // For MVP, we'll allow free users to send messages too, but we can restrict if needed.
      // Let's check if we strictly need to block free users from messaging:
      // "paid users can post listings and send unlimited messages"
      // Let's assume free users can send limited, but for simplicity in MVP we allow all,
      // or we can strictly enforce isPremium for messaging. We will enforce it.
      if (!currentUserProfile?.isPremium) {
        showToast('Sending messages requires a Premium subscription (€5/month). Go to Profile to upgrade.');
        return;
      }

      currentReceiverId = e.target.dataset.ownerId;
      currentListingId = e.target.dataset.listingId;
      currentListingTitle = e.target.dataset.listingTitle;

      document.getElementById('message-recipient-name').textContent = currentListingTitle;
      messageModal.classList.remove('hidden');
    }
  });

  closeMessageModal.addEventListener('click', () => {
    messageModal.classList.add('hidden');
    messageBody.value = '';
  });

  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = messageForm.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      await sendMessage(
        currentUser.uid,
        currentUser.email,
        currentReceiverId,
        currentListingId,
        currentListingTitle,
        messageBody.value
      );

      showToast('Message sent!');
      messageModal.classList.add('hidden');
      messageBody.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Error sending message');
    } finally {
      btn.disabled = false;
    }
  });
};

import { escapeHTML } from "../../main.js";
import { currentUser, currentUserProfile } from '../components/authModal.js';
import { getUserMessages } from '../firebase/messaging.js';
import { startMockCheckout } from '../components/stripe.js';
import { showToast } from '../../main.js';

export const initProfile = () => {
  const profileBtn = document.getElementById('nav-profile-btn');
  const profileModal = document.getElementById('profile-modal');
  const closeProfileModal = document.getElementById('close-profile-modal');
  const upgradeBtn = document.getElementById('profile-upgrade-btn');
  const subStatus = document.getElementById('profile-sub-status');
  const messagesContainer = document.getElementById('profile-messages-container');

  profileBtn.addEventListener('click', async () => {
    if (!currentUser) return;

    // Update subscription UI
    if (currentUserProfile?.isPremium) {
      subStatus.textContent = 'Premium Member (€5/month)';
      subStatus.style.color = 'var(--primary-color)';
      subStatus.style.fontWeight = 'bold';
      upgradeBtn.classList.add('hidden');
    } else {
      subStatus.textContent = 'Free User (Cannot post listings or send messages)';
      subStatus.style.color = 'inherit';
      upgradeBtn.classList.remove('hidden');
    }

    // Load messages
    messagesContainer.innerHTML = '<p>Loading messages...</p>';
    try {
      const messages = await getUserMessages(currentUser.uid);

      if (messages.length === 0) {
        messagesContainer.innerHTML = '<p>No messages yet.</p>';
      } else {
        messagesContainer.innerHTML = messages.map(msg => `
          <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <p><strong>From:</strong> ${escapeHTML(msg.senderEmail)}</p>
            <p><strong>Regarding:</strong> ${escapeHTML(msg.listingTitle)}</p>
            <p style="margin-top: 0.5rem; color: var(--text-color);">${escapeHTML(msg.body)}</p>
          </div>
        `).join('');
      }
    } catch (error) {
      messagesContainer.innerHTML = '<p>Error loading messages.</p>';
    }

    profileModal.classList.remove('hidden');
  });

  closeProfileModal.addEventListener('click', () => {
    profileModal.classList.add('hidden');
  });

  upgradeBtn.addEventListener('click', async () => {
    upgradeBtn.disabled = true;
    upgradeBtn.textContent = 'Processing...';

    const success = await startMockCheckout(currentUser.uid);
    if (success) {
      // Optimistically update profile in memory
      currentUserProfile.isPremium = true;
      subStatus.textContent = 'Premium Member (€5/month)';
      subStatus.style.color = 'var(--primary-color)';
      subStatus.style.fontWeight = 'bold';
      upgradeBtn.classList.add('hidden');
    } else {
      upgradeBtn.disabled = false;
      upgradeBtn.textContent = 'Upgrade to Premium (€5/month)';
    }
  });
};

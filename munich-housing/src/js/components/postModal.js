import { uploadImage, createListing } from '../firebase/db.js';
import { currentUser, currentUserProfile } from './authModal.js';
import { showToast } from '../../main.js';
import { loadHomepage } from '../pages/home.js'; // Reload list after post

export const initPostListing = () => {
  const postBtn = document.getElementById('nav-post-btn');
  const postModal = document.getElementById('post-modal');
  const closePostModal = document.getElementById('close-post-modal');
  const postForm = document.getElementById('post-form');
  const submitBtn = document.getElementById('post-submit-btn');

  postBtn.addEventListener('click', () => {
    if (!currentUser) {
      showToast('Please login to post a listing');
      return;
    }
    if (!currentUserProfile?.isPremium) {
      showToast('Posting listings requires a Premium subscription (€5/month). Go to Profile to upgrade.');
      return;
    }
    postModal.classList.remove('hidden');
  });

  closePostModal.addEventListener('click', () => {
    postModal.classList.add('hidden');
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
      const fileInput = document.getElementById('post-image');
      const file = fileInput.files[0];

      let imageUrl = '';
      if (file) {
        imageUrl = await uploadImage(file, currentUser.uid);
      }

      const listingData = {
        title: document.getElementById('post-title').value,
        price: Number(document.getElementById('post-price').value),
        district: document.getElementById('post-district').value,
        latitude: document.getElementById('post-lat').value,
        longitude: document.getElementById('post-lng').value,
        availabilityDate: document.getElementById('post-date').value,
        description: document.getElementById('post-desc').value,
        type: document.getElementById('post-type').value,
        imageUrl,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email
      };

      await createListing(listingData);
      showToast('Listing created successfully!');

      postForm.reset();
      postModal.classList.add('hidden');

      // Refresh map and listings
      loadHomepage();

    } catch (error) {
      console.error('Error posting listing:', error);
      showToast('Error creating listing');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Listing';
    }
  });
};

import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../config.js';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { showToast } from '../../main.js';

// MOCK CHECKOUT FLOW
// In a real app, you need a backend endpoint to create a Checkout Session.
// Here we mock the process entirely on the frontend to fulfill the assignment
// without requiring a custom Node/Express backend.
export const startMockCheckout = async (userId) => {
  try {
    showToast('Mock Stripe Checkout: Processing payment...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update user profile in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isPremium: true
    });

    showToast('Payment successful! You are now Premium.');
    return true;
  } catch (error) {
    console.error('Payment error:', error);
    showToast('Payment failed.');
    return false;
  }
};

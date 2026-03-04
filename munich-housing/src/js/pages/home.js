import { escapeHTML } from "../../main.js";
import { getListings } from '../firebase/db.js';
import { initMap, renderMarkers, highlightMarker, unhighlightMarker } from '../components/map.js';

export const loadHomepage = async () => {
  // Initialize map first
  try {
    initMap();
  } catch (error) {
    console.error("Mapbox init failed. Check token:", error);
    document.getElementById('map').innerHTML = '<p style="padding: 2rem;">Mapbox token required.</p>';
  }

  // Fetch listings
  const listingsContainer = document.getElementById('listings-container');
  try {
    const listings = await getListings();

    if (listings.length === 0) {
      listingsContainer.innerHTML = '<p>No listings found. Be the first to post!</p>';
      return;
    }

    // Render cards
    listingsContainer.innerHTML = '';
    listings.forEach(listing => {
      const card = document.createElement('div');
      card.className = 'listing-card';
      card.dataset.id = listing.id;

      const imageUrl = listing.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image';

      card.innerHTML = `
        <img src="${imageUrl}" alt="${escapeHTML(listing.title)}" class="listing-image" />
        <div class="listing-info">
          <div class="listing-type-district">${escapeHTML(listing.type)} • ${escapeHTML(listing.district)}</div>
          <div class="listing-title" title="${escapeHTML(listing.title)}">${escapeHTML(listing.title)}</div>
          <div class="listing-price">€${escapeHTML(listing.price.toString())} / month</div>
          <div class="listing-date">Available: ${escapeHTML(listing.availabilityDate)}</div>
          <div class="listing-actions">
            <button class="btn-message" data-owner-id="${listing.ownerId}" data-listing-id="${listing.id}" data-listing-title="${escapeHTML(listing.title)}">Message</button>
          </div>
        </div>
      `;

      // Hover events for map
      card.addEventListener('mouseenter', () => highlightMarker(listing.id));
      card.addEventListener('mouseleave', () => unhighlightMarker(listing.id));

      listingsContainer.appendChild(card);
    });

    // Render markers on map
    if (window.mapboxgl && window.mapboxgl.accessToken !== 'PLACEHOLDER_MAPBOX_TOKEN') {
       renderMarkers(listings);
    }
  } catch (error) {
    console.error("Error loading homepage:", error);
    listingsContainer.innerHTML = '<p>Error loading listings.</p>';
  }
};

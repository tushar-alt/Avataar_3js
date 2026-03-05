import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../config.js';

let map;
let markers = {};

export const initMap = () => {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [11.5820, 48.1351], // starting position [lng, lat] (Munich)
    zoom: 12 // starting zoom
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
};

import { escapeHTML } from "../../main.js";

export const renderMarkers = (listings) => {
  // Clear existing markers
  Object.values(markers).forEach(marker => marker.remove());
  markers = {};

  if (!map) return;

  listings.forEach(listing => {
    // Create DOM element for the marker
    const el = document.createElement('div');
    el.className = 'map-marker';
    el.textContent = `€${listing.price}`;
    el.id = `marker-${listing.id}`;

    // Add marker to map
    const marker = new mapboxgl.Marker(el)
      .setLngLat([parseFloat(listing.longitude), parseFloat(listing.latitude)])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(`
            <h3>${escapeHTML(listing.title)}</h3>
            <p>${escapeHTML(listing.district)} • ${escapeHTML(listing.type)}</p>
            <p><strong>€${escapeHTML(listing.price.toString())}/mo</strong></p>
          `)
      )
      .addTo(map);

    markers[listing.id] = marker;
  });
};

export const highlightMarker = (listingId) => {
  const el = document.getElementById(`marker-${listingId}`);
  if (el) {
    el.classList.add('active');
  }
};

export const unhighlightMarker = (listingId) => {
  const el = document.getElementById(`marker-${listingId}`);
  if (el) {
    el.classList.remove('active');
  }
};

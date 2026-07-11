import { getTrails } from './data.js';
import { renderTrails, renderDropdown } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Grab the containers from your HTML
  const trailListContainer = document.querySelector('.trail-list');
  const trailSelectDropdown = document.getElementById('trail');
  console.log("loaded");

  // 1. Fetch the data
  const trailData = await getTrails();
  console.log(trailData);


  // 2. Render the UI
  if (trailData.length > 0) {
    renderTrails(trailData, trailListContainer);
    renderDropdown(trailData, trailSelectDropdown);
  } else {
    // Fallback if data fails to load
    if (trailListContainer) {
      trailListContainer.innerHTML = '<p>Sorry, we could not load the trails at this time.</p>';
    }
  }
});
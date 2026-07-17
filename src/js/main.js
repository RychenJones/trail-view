import { getTrails } from './data.js';
import { renderTrails, renderDropdown } from './render.js';
import { addFavorite, removeFavorite, isFavorite } from './favorites.js';
import { validateHikePlan } from './form.js';

let trailData = [];
let currentFilter = "all";

function filterTrails(trails, filter) {
  switch (filter) {
    case "favorites":
      return trails.filter(trail =>
        isFavorite(trail.id)
      );

    case "easy":
    case "moderate":
    case "hard":
      return trails.filter(trail =>
        trail.difficulty.toLowerCase() === filter
      );

    default:
      return trails;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const trailListContainer = document.querySelector('.trail-list');
  const trailSelectDropdown = document.getElementById('trail');
  const filterDropdown = document.getElementById('filter-trails');

  if (trailListContainer) {
    trailListContainer.innerHTML = '<p class="status-message">Loading trails…</p>';
  }

  try {
    trailData = await getTrails();

    if (trailData.length > 0) {
      renderTrails(trailData, trailListContainer);
      renderDropdown(trailData, trailSelectDropdown);
    } else if (trailListContainer) {
      trailListContainer.innerHTML =
        '<p class="status-message">Sorry, we could not load the trails at this time.</p>';
    }
  } catch (error) {
    console.error('Error loading trails:', error);
    if (trailListContainer) {
      trailListContainer.innerHTML =
        '<p class="status-message">We could not load trail data right now. Please try again later.</p>';
    }
  }

  if (filterDropdown) {
    filterDropdown.addEventListener('change', () => {
      currentFilter = filterDropdown.value;

      const filteredTrails = filterTrails(
        trailData,
        currentFilter
      );

      renderTrails(
        filteredTrails,
        trailListContainer
      );
    });
  }
});


document.addEventListener('click', async event => {
  const starButton = event.target.closest('.star-btn');

  if (!starButton) return;

  event.preventDefault();
  event.stopPropagation();

  const trailId = starButton.dataset.id;

  const trail = trailData.find(
    trail => String(trail.id) === trailId
  );

  if (!trail) return;

  if (isFavorite(trailId)) {
    removeFavorite(trailId);
    starButton.classList.remove('is-fav');
    starButton.setAttribute('aria-pressed', 'false');
    starButton.setAttribute('aria-label', 'Add to favorites');
  } else {
    addFavorite(trail);
    starButton.classList.add('is-fav');
    starButton.setAttribute('aria-pressed', 'true');
    starButton.setAttribute('aria-label', 'Remove from favorites');
  }


  // Refresh list if currently filtering favorites
  const trailListContainer = document.querySelector('.trail-list');

  if (currentFilter === "favorites") {
    renderTrails(
      filterTrails(trailData, currentFilter),
      trailListContainer
    );
  }
});




const form = document.querySelector(".card");

if (form) {
  const errorBox = document.createElement('div');
  errorBox.className = 'form-errors';
  errorBox.setAttribute('role', 'alert');
  errorBox.setAttribute('aria-live', 'polite');
  errorBox.hidden = true;
  form.insertBefore(errorBox, form.firstElementChild);

  form.addEventListener("submit", function (event) {
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const notes = document.querySelector("#notes").value.trim();

    const validation = validateHikePlan({ name, email, notes });

    if (!validation.isValid) {
      event.preventDefault();
      errorBox.innerHTML = validation.errors.map(message => `<p>${message}</p>`).join('');
      errorBox.hidden = false;
      return;
    }

    errorBox.hidden = true;
    errorBox.innerHTML = '';
  });
}

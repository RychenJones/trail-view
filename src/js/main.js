import { getTrails } from './data.js';
import { renderTrails, renderDropdown } from './render.js';
import { addFavorite, removeFavorite, isFavorite } from './favorites.js';

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

  trailData = await getTrails();

  if (trailData.length > 0) {
    renderTrails(trailData, trailListContainer);
    renderDropdown(trailData, trailSelectDropdown);
  } else if (trailListContainer) {
    trailListContainer.innerHTML =
      '<p>Sorry, we could not load the trails at this time.</p>';
  }


  // Filter listener
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
  } else {
    addFavorite(trail);
    starButton.classList.add('is-fav');
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

form.addEventListener("submit", function (event) {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const notes = document.querySelector("#notes").value.trim();

  const errors = [];

  // Name validation
  if (name.length >= 100) {
    errors.push("Name must be less than 100 characters.");
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  // Notes validation
  if (notes.length >= 500) {
    errors.push("Notes must be less than 500 characters.");
  }

  // Stop submission if errors exist
  if (errors.length > 0) {
    event.preventDefault();
    alert(errors.join("\n"));
  }
});
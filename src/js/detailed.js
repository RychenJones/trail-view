import { renderDetailedView } from './render.js';
import { getTrails } from './data.js';
import { addFavorite, removeFavorite, isFavorite } from './favorites.js';

let trailData = []

document.addEventListener('DOMContentLoaded', async () => {
    const trailSummary = document.querySelector(".trail-summary");
    const photoFrame = document.querySelector(".photo-frame");
    const card = document.querySelector(".card");

    console.log("loaded");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        if (card) {
            card.innerHTML = "<p>Trail information not found.</p>";
        }
        return;
    }

    try {
        trailData = await getTrails();

        const trail = trailData.find(trail => String(trail.id) === id);

        if (trail) {
            console.log(trail);
            renderDetailedView(trail, trailSummary, photoFrame, card);
        } else {
            card.innerHTML = "<p>Trail information not found.</p>";
        }

    } catch (error) {
        console.error("Error loading trail:", error);
        card.innerHTML = "<p>Error loading trail information.</p>";
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
  } else {
    addFavorite(trail);
    starButton.classList.add('is-fav');
  }
});
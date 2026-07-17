import { renderDetailedView } from './render.js';
import { getTrails } from './data.js';
import { addFavorite, removeFavorite, isFavorite } from './favorites.js';

let trailData = [];

document.addEventListener('DOMContentLoaded', async () => {
    const trailSummary = document.querySelector(".trail-summary");
    const photoFrame = document.querySelector(".photo-frame");
    const card = document.querySelector(".card");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        if (card) {
            card.innerHTML = "<div class='status-card'><h2>Trail not found</h2><p>We could not locate that trail. Please return to the home page and choose a trail from the list.</p></div>";
        }
        return;
    }

    try {
        trailData = await getTrails();

        const trail = trailData.find(trail => String(trail.id) === id);

        if (trail) {
            renderDetailedView(trail, trailSummary, photoFrame, card);
        } else {
            card.innerHTML = "<div class='status-card'><h2>Trail not found</h2><p>The trail you requested is not available. Please return to the home page and try another route.</p></div>";
        }

    } catch (error) {
        console.error("Error loading trail:", error);
        card.innerHTML = "<div class='status-card'><h2>Unable to load trail details</h2><p>We could not load this trail right now. Please try again shortly.</p></div>";
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
});
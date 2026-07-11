import { renderDetailedView } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Grab the containers from your HTML
    const trailSummary = document.querySelector(".trail-summary");
    const photoFrame = document.querySelector(".photo-frame");
    const card = document.querySelector(".card");

    console.log("loaded");

    // Get the data from the URL
    const params = new URLSearchParams(window.location.search);

    const trail = {
        id: params.get("id"),
        name: params.get("name"),
        description: params.get("description"),
        image: params.get("image"),
        location: params.get("location"),
        difficulty: params.get("difficulty"),
        distance: params.get("distance")
    };

    console.log(trail);

    // Render the UI
    if (trail.id) {
        renderDetailedView(trail, trailSummary, photoFrame, card);
    } else {
        if (card) {
            card.innerHTML = "<p>Trail information not found.</p>";
        }
    }
});
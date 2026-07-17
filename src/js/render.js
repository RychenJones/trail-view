import { isFavorite } from './favorites.js';

export function renderTrails(trails, container) {
  if (!container) return;
  
  // Clear the stock HTML
  container.innerHTML = ''; 

  trails.forEach(trail => {
    const diffClass = trail.difficulty.toLowerCase();
    const cardHTML = `
      <article class="trail-card" data-id="${trail.id}">
        <a class="trail-card-link"
          href="detailed-view.html?id=${encodeURIComponent(trail.id)}"
          title="${trail.description}"
          aria-label="View details for ${trail.name}">
          <div class="trail-thumbnail">
            <img src="${trail.image}" alt="${trail.alt}">
          </div>
          <div class="trail-info">
            <div class="trail-card-header">
              <h3>${trail.name}</h3>
            </div>

            <div class="location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
                <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/>
                <circle cx="12" cy="10" r="2.5"/>
              </svg>
              ${trail.location}
            </div>

            <div class="trail-meta" aria-label="Trail information">
              <span class="trail-difficulty">
                <span class="difficulty-dot ${diffClass}" aria-hidden="true"></span>
                ${trail.difficulty}
              </span>
              <span class="trail-distance">${trail.distance} mi</span>
            </div>
          </div>
        </a>
        <button
          type="button"
          class="star-btn ${isFavorite(trail.id) ? 'is-fav' : ''}"
          aria-label="${isFavorite(trail.id) ? 'Remove from favorites' : 'Add to favorites'}"
          aria-pressed="${isFavorite(trail.id)}"
          data-id="${trail.id}">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/>
          </svg>
        </button>
      </article>
    `;

    container.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// Replaces the stock dropdown options with dynamic data
export function renderDropdown(trails, dropdownElement) {
  if (!dropdownElement) return;
  
  // Clear stock options, but keep the placeholder
  dropdownElement.innerHTML = '<option value="" selected disabled>Select a trail…</option>';
  
  trails.forEach(trail => {
    const optionHTML = `<option value="${trail.id}">${trail.name}</option>`;
    dropdownElement.insertAdjacentHTML('beforeend', optionHTML);
  });
}




export function renderDetailedView(trail, trailSummary, photoFrame, card) {
  if (!trailSummary || !photoFrame || !card) return;

  const diffClass = trail.difficulty.toLowerCase();

  trailSummary.innerHTML = `
    <div class="title-row">
      <h1>${trail.name}</h1>
      <button
        type="button"
        class="star-btn ${isFavorite(trail.id) ? 'is-fav' : ''}"
        aria-label="${isFavorite(trail.id) ? 'Remove from favorites' : 'Add to favorites'}"
        aria-pressed="${isFavorite(trail.id)}"
        data-id="${trail.id}">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/>
        </svg>
      </button>
    </div>

    <div class="location">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/>
        <circle cx="12" cy="10" r="2.5"/>
      </svg>
      ${trail.location}
    </div>

    <div class="stat-strip" aria-label="Trail statistics">
      <div class="stat">
        <span class="label">Distance</span>
        <span class="value trail-distance">${trail.distance} mi</span>
      </div>

      <div class="stat">
        <span class="label">Difficulty</span>
        <span class="value">
          <span class="difficulty-dot ${diffClass}" aria-hidden="true"></span>
          ${trail.difficulty}
        </span>
      </div>
    </div>
  `;

  photoFrame.innerHTML = `
    <div
      class="photo"
      aria-hidden="true"
      role="img"
      aria-label="${trail.name}"
      style="background-image: url('${trail.image}'); background-size: cover; background-position: center;">
    </div>
  `;

  card.innerHTML = `
    <div class="card-title">
      <h2>Description</h2>
    </div>

    <p>${trail.description}</p>
  `;
}
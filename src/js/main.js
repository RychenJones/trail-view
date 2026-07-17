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

  function renderStatus(message, isError = false) {
    if (!trailListContainer) return;

    trailListContainer.innerHTML = `
      <p class="status-message ${isError ? 'status-message-error' : ''}" role="status">${message}</p>
    `;
  }

  function renderTrailResults(trails) {
    if (!trailListContainer) return;

    if (!trails.length) {
      trailListContainer.innerHTML = `
        <p class="status-message status-message-empty" role="status">No trails match this filter right now.</p>
      `;
      return;
    }

    renderTrails(trails, trailListContainer);
  }

  function setTrailControlsEnabled(isEnabled) {
    if (filterDropdown) {
      filterDropdown.disabled = !isEnabled;
    }

    if (trailSelectDropdown) {
      trailSelectDropdown.disabled = !isEnabled;
    }
  }

  renderStatus('Loading trails…');
  setTrailControlsEnabled(false);

  try {
    trailData = await getTrails();

    if (trailData.length > 0) {
      renderTrailResults(filterTrails(trailData, currentFilter));
      renderDropdown(trailData, trailSelectDropdown);
      setTrailControlsEnabled(true);
    } else {
      trailData = [];
      renderStatus('No trails are available right now.');
      if (trailSelectDropdown) {
        trailSelectDropdown.innerHTML = '<option value="" selected disabled>Select a trail…</option>';
      }
      setTrailControlsEnabled(false);
    }
  } catch (error) {
    console.error('Error loading trails:', error);
    trailData = [];
    renderStatus('We could not load trail data right now. Please try again later.', true);
    if (trailSelectDropdown) {
      trailSelectDropdown.innerHTML = '<option value="" selected disabled>Select a trail…</option>';
    }
    setTrailControlsEnabled(false);
  }

  if (filterDropdown) {
    filterDropdown.addEventListener('change', () => {
      currentFilter = filterDropdown.value;

      const filteredTrails = filterTrails(
        trailData,
        currentFilter
      );

      renderTrailResults(filteredTrails);
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
    renderTrailResults(
      filterTrails(trailData, currentFilter)
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

  const successBox = document.createElement('div');
  successBox.className = 'form-success';
  successBox.setAttribute('role', 'status');
  successBox.setAttribute('aria-live', 'polite');
  successBox.hidden = true;
  form.insertBefore(successBox, form.firstElementChild);

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const trailInput = document.getElementById('trail');
  const notesInput = document.getElementById('notes');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const trailError = document.getElementById('trail-error');
  const notesError = document.getElementById('notes-error');

  function clearFieldErrors() {
    [nameInput, emailInput, trailInput, notesInput].forEach(input => {
      input?.setAttribute('aria-invalid', 'false');
    });

    [nameError, emailError, trailError, notesError].forEach(error => {
      if (error) error.textContent = '';
    });
  }

  function showFieldError(input, errorElement, message) {
    if (input) input.setAttribute('aria-invalid', 'true');
    if (errorElement) errorElement.textContent = message;
  }

  function clearSuccessState() {
    successBox.hidden = true;
    successBox.textContent = '';
  }

  function focusFirstInvalidField(fields) {
    const fieldOrder = [
      { input: nameInput, field: 'name' },
      { input: emailInput, field: 'email' },
      { input: trailInput, field: 'trail' },
      { input: notesInput, field: 'notes' }
    ];

    const firstInvalid = fieldOrder.find(({ field }) => fields.includes(field));

    if (firstInvalid?.input) {
      firstInvalid.input.focus();
      firstInvalid.input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  [nameInput, emailInput, trailInput, notesInput].forEach(input => {
    if (!input) return;

    const resetFeedback = () => {
      clearFieldErrors();
      clearSuccessState();
    };

    input.addEventListener('input', resetFeedback);
    input.addEventListener('change', resetFeedback);
  });

  form.addEventListener("submit", function (event) {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const trail = trailInput.value.trim();
    const notes = notesInput.value.trim();

    clearFieldErrors();

    const validation = validateHikePlan({ name, email, notes, trail });

    if (!validation.isValid) {
      event.preventDefault();
      clearSuccessState();

      validation.errors.forEach(({ field, message }) => {
        if (field === 'name') {
          showFieldError(nameInput, nameError, message);
        } else if (field === 'email') {
          showFieldError(emailInput, emailError, message);
        } else if (field === 'trail') {
          showFieldError(trailInput, trailError, message);
        } else if (field === 'notes') {
          showFieldError(notesInput, notesError, message);
        }
      });

      errorBox.innerHTML = validation.errors.map(({ message }) => `<p>${message}</p>`).join('');
      errorBox.hidden = false;
      focusFirstInvalidField(validation.errors.map(({ field }) => field));
      return;
    }

    errorBox.hidden = true;
    errorBox.innerHTML = '';

    successBox.hidden = false;
    successBox.textContent = 'Your hike plan looks good. Thanks for sharing it!';
  });
}

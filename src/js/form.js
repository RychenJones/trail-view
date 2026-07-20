export function validateHikePlan({ name = '', email = '', notes = '', trail = '' }) {
  const errors = [];

  if (name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Please enter your name.' });
  } else if (name.trim().length >= 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Please enter your email address.' });
  } else if (!emailPattern.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!trail.trim()) {
    errors.push({ field: 'trail', message: 'Please select a trail.' });
  }

  if (notes.trim().length >= 500) {
    errors.push({ field: 'notes', message: 'Notes must be less than 500 characters.' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateHikePlan({ name = '', email = '', notes = '' }) {
  const errors = [];

  if (name.trim().length === 0) {
    errors.push('Please enter your name.');
  } else if (name.trim().length >= 100) {
    errors.push('Name must be less than 100 characters.');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.push('Please enter your email address.');
  } else if (!emailPattern.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (notes.trim().length >= 500) {
    errors.push('Notes must be less than 500 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

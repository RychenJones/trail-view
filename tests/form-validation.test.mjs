import test from 'node:test';
import assert from 'node:assert/strict';
import { validateHikePlan } from '../src/js/form.js';

test('accepts a valid hike plan', () => {
  const result = validateHikePlan({
    name: 'Jordan Rivers',
    email: 'jordan@example.com',
    trail: '1',
    notes: 'Meet at sunrise'
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects invalid values with clear messages', () => {
  const result = validateHikePlan({
    name: 'x'.repeat(101),
    email: 'invalid',
    trail: '',
    notes: 'x'.repeat(501)
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, [
    'Name must be less than 100 characters.',
    'Please enter a valid email address.',
    'Please select a trail.',
    'Notes must be less than 500 characters.'
  ]);
});

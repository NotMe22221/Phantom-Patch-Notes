/**
 * Property-based tests for error handling
 * Tests universal properties that should hold across all valid executions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { displayError, hideError, formatApiError } from './error-handler.js';

// Feature: phantom-patch-notes, Property 29: Frontend error display
// For any error from backend operations, the Frontend should display a user-friendly error message
// Validates: Requirements 8.5

describe('Error Handler - Property-Based Tests', () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="error-display" class="error-message"></div>
    `;
  });

  test.prop([
    fc.string({ minLength: 1, maxLength: 200 })
  ], { numRuns: 100 })(
    'Property 29: displays user-friendly error messages for any error',
    (errorMessage: string) => {
      // Display error
      displayError(errorMessage);

      // Get error display element
      const errorDisplay = document.getElementById('error-display');
      expect(errorDisplay).toBeTruthy();

      // Verify error is visible
      expect(errorDisplay?.classList.contains('visible')).toBe(true);

      // Verify error message is displayed
      expect(errorDisplay?.textContent).toBe(errorMessage);
    }
  );

  test.prop([
    fc.record({
      component: fc.string({ minLength: 1, maxLength: 50 }),
      message: fc.string({ minLength: 1, maxLength: 200 }),
      code: fc.string({ minLength: 1, maxLength: 20 })
    })
  ], { numRuns: 100 })(
    'Property 29: formats API errors with component and message',
    (apiError) => {
      const error = {
        response: {
          data: {
            error: apiError
          }
        }
      };

      const formatted = formatApiError(error);

      // Verify formatted message contains component and message
      expect(formatted).toContain(apiError.component);
      expect(formatted).toContain(apiError.message);
    }
  );

  test.prop([
    fc.string({ minLength: 1, maxLength: 200 })
  ], { numRuns: 100 })(
    'Property 29: formats simple error messages',
    (message: string) => {
      const error = { message };

      const formatted = formatApiError(error);

      // Verify formatted message equals the error message
      expect(formatted).toBe(message);
    }
  );

  it('Property 29: provides fallback message for unknown errors', () => {
    const error = {};

    const formatted = formatApiError(error);

    // Verify fallback message is provided
    expect(formatted).toBe('An unexpected error occurred. Please try again.');
  });

  it('Property 29: hideError removes error display', () => {
    // Display an error first
    displayError('Test error');

    const errorDisplay = document.getElementById('error-display');
    expect(errorDisplay?.classList.contains('visible')).toBe(true);

    // Hide error
    hideError();

    // Verify error is hidden
    expect(errorDisplay?.classList.contains('visible')).toBe(false);
    expect(errorDisplay?.textContent).toBe('');
  });
});

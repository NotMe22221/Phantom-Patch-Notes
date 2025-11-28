/**
 * Error handling utilities for the frontend
 */

/**
 * Display an error message to the user
 */
export function displayError(message: string): void {
  const errorDisplay = document.getElementById('error-display');
  if (!errorDisplay) return;

  errorDisplay.textContent = message;
  errorDisplay.classList.add('visible');

  // Auto-hide after 10 seconds
  setTimeout(() => {
    hideError();
  }, 10000);
}

/**
 * Hide the error message
 */
export function hideError(): void {
  const errorDisplay = document.getElementById('error-display');
  if (!errorDisplay) return;

  errorDisplay.classList.remove('visible');
  errorDisplay.textContent = '';
}

/**
 * Convert API errors to user-friendly messages
 */
export function formatApiError(error: any): string {
  if (error.response?.data?.error) {
    const apiError = error.response.data.error;
    return `${apiError.component || 'System'} Error: ${apiError.message}`;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle errors gracefully
 */
export function handleError(error: any): void {
  console.error('Error:', error);
  const message = formatApiError(error);
  displayError(message);
}

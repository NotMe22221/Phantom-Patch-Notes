/**
 * ErrorHandler utility class
 * Provides centralized error handling with code mapping and user-friendly messages
 */

import type { SystemError } from '../../shared/types.js';

/**
 * Error code categories
 */
export enum ErrorCode {
  // Repository errors
  INVALID_REPOSITORY = 'INVALID_REPOSITORY',
  GIT_OPERATION_FAILED = 'GIT_OPERATION_FAILED',
  REPOSITORY_NOT_FOUND = 'REPOSITORY_NOT_FOUND',
  
  // Theme errors
  THEME_VALIDATION_FAILED = 'THEME_VALIDATION_FAILED',
  THEME_NOT_FOUND = 'THEME_NOT_FOUND',
  THEME_LOAD_FAILED = 'THEME_LOAD_FAILED',
  
  // Export errors
  EXPORT_FAILED = 'EXPORT_FAILED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  FILE_WRITE_FAILED = 'FILE_WRITE_FAILED',
  
  // API errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  
  // System errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

/**
 * ErrorHandler utility class
 */
export class ErrorHandler {
  /**
   * Create a structured SystemError from any error
   * @param error - The error to handle
   * @param component - The component where the error occurred
   * @param context - Additional context information
   * @returns Structured SystemError
   */
  static handle(error: any, component: string, context?: Record<string, any>): SystemError {
    const code = this.getErrorCode(error);
    const message = this.getUserFriendlyMessage(error, code);
    
    return {
      code,
      message,
      component,
      details: {
        originalError: error.message || error,
        stack: error.stack,
        ...context
      },
      timestamp: new Date()
    };
  }

  /**
   * Map error to appropriate error code
   * @param error - The error to map
   * @returns Error code string
   */
  static getErrorCode(error: any): string {
    // If error already has a code, use it
    if (error.code && typeof error.code === 'string') {
      return error.code;
    }

    // Check error name
    if (error.name === 'ThemeValidationError') {
      return ErrorCode.THEME_VALIDATION_FAILED;
    }

    // Check error message patterns
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('repository') && message.includes('not found')) {
      return ErrorCode.REPOSITORY_NOT_FOUND;
    }
    
    if (message.includes('repository') && message.includes('invalid')) {
      return ErrorCode.INVALID_REPOSITORY;
    }
    
    if (message.includes('git')) {
      return ErrorCode.GIT_OPERATION_FAILED;
    }
    
    if (message.includes('theme') && message.includes('not found')) {
      return ErrorCode.THEME_NOT_FOUND;
    }
    
    if (message.includes('theme')) {
      return ErrorCode.THEME_LOAD_FAILED;
    }
    
    if (message.includes('export') || message.includes('format')) {
      return ErrorCode.EXPORT_FAILED;
    }
    
    if (message.includes('validation') || message.includes('required')) {
      return ErrorCode.VALIDATION_ERROR;
    }

    return ErrorCode.UNKNOWN_ERROR;
  }

  /**
   * Convert technical error to user-friendly message
   * @param error - The error to convert
   * @param code - The error code
   * @returns User-friendly error message
   */
  static getUserFriendlyMessage(error: any, code: string): string {
    // If error already has a user-friendly message, use it
    if (error.message && typeof error.message === 'string') {
      // Check if it's already user-friendly (contains helpful context)
      if (error.message.includes('Please') || error.message.includes('Ensure')) {
        return error.message;
      }
    }

    // Generate user-friendly message based on error code
    switch (code) {
      case ErrorCode.INVALID_REPOSITORY:
        return 'The specified path is not a valid git repository. Please ensure the directory contains a .git folder.';
      
      case ErrorCode.REPOSITORY_NOT_FOUND:
        return 'The repository path does not exist. Please check the path and try again.';
      
      case ErrorCode.GIT_OPERATION_FAILED:
        return `Git operation failed: ${error.message || 'Unknown git error'}. Please check your repository and try again.`;
      
      case ErrorCode.THEME_VALIDATION_FAILED:
        return `Theme validation failed: ${error.message || 'Invalid theme structure'}. Please check your theme configuration.`;
      
      case ErrorCode.THEME_NOT_FOUND:
        return 'The requested theme was not found. Using default theme instead.';
      
      case ErrorCode.THEME_LOAD_FAILED:
        return `Failed to load theme: ${error.message || 'Unknown error'}. Using default theme instead.`;
      
      case ErrorCode.EXPORT_FAILED:
        return `Export operation failed: ${error.message || 'Unknown error'}. Please check your export settings.`;
      
      case ErrorCode.INVALID_FORMAT:
        return 'Invalid export format specified. Supported formats are: markdown, html, json.';
      
      case ErrorCode.FILE_WRITE_FAILED:
        return 'Failed to write output file. Please check file permissions and disk space.';
      
      case ErrorCode.VALIDATION_ERROR:
        return `Validation error: ${error.message || 'Invalid input'}. Please check your request parameters.`;
      
      case ErrorCode.MISSING_PARAMETER:
        return `Missing required parameter: ${error.message || 'Unknown parameter'}. Please provide all required fields.`;
      
      case ErrorCode.INTERNAL_ERROR:
        return 'An internal error occurred. Please try again or contact support if the problem persists.';
      
      case ErrorCode.UNKNOWN_ERROR:
      default:
        return `An unexpected error occurred: ${error.message || 'Unknown error'}. Please try again.`;
    }
  }

  /**
   * Create a SystemError with specific code and message
   * @param code - Error code
   * @param message - Error message
   * @param component - Component name
   * @param details - Additional details
   * @returns SystemError
   */
  static createError(
    code: string,
    message: string,
    component: string,
    details?: any
  ): SystemError {
    return {
      code,
      message,
      component,
      details,
      timestamp: new Date()
    };
  }

  /**
   * Check if an error is a SystemError
   * @param error - Error to check
   * @returns True if error is a SystemError
   */
  static isSystemError(error: any): error is SystemError {
    return (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error &&
      'component' in error &&
      'timestamp' in error
    );
  }

  /**
   * Extract git-specific error details
   * @param error - The error object
   * @returns Git error details
   */
  static extractGitErrorDetails(error: any): any {
    if (!error) return null;
    
    return {
      message: error.message || 'Unknown git error',
      stack: error.stack,
      // Extract git-specific error info if available
      gitCommand: error.git?.command,
      exitCode: error.git?.exitCode,
      stderr: error.git?.stderr
    };
  }
}

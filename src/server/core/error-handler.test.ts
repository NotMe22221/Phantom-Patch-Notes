/**
 * Tests for ErrorHandler utility class
 */

import { describe, it, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { ErrorHandler, ErrorCode } from './error-handler.js';

describe('ErrorHandler', () => {
  describe('handle', () => {
    it('should create SystemError from generic error', () => {
      const error = new Error('Something went wrong');
      const result = ErrorHandler.handle(error, 'TestComponent');

      expect(result.code).toBeDefined();
      expect(result.message).toBeDefined();
      expect(result.component).toBe('TestComponent');
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.details).toBeDefined();
    });

    it('should include context in error details', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      const result = ErrorHandler.handle(error, 'TestComponent', context);

      expect(result.details.userId).toBe('123');
      expect(result.details.action).toBe('test');
    });

    it('should preserve error stack trace', () => {
      const error = new Error('Test error');
      const result = ErrorHandler.handle(error, 'TestComponent');

      expect(result.details.stack).toBeDefined();
    });
  });

  describe('getErrorCode', () => {
    it('should use existing error code if present', () => {
      const error = { code: 'CUSTOM_ERROR', message: 'Custom error' };
      const code = ErrorHandler.getErrorCode(error);

      expect(code).toBe('CUSTOM_ERROR');
    });

    it('should map ThemeValidationError to THEME_VALIDATION_FAILED', () => {
      const error = { name: 'ThemeValidationError', message: 'Invalid theme' };
      const code = ErrorHandler.getErrorCode(error);

      expect(code).toBe(ErrorCode.THEME_VALIDATION_FAILED);
    });

    it('should map repository errors correctly', () => {
      const error1 = { message: 'Repository not found' };
      expect(ErrorHandler.getErrorCode(error1)).toBe(ErrorCode.REPOSITORY_NOT_FOUND);

      const error2 = { message: 'Invalid repository path' };
      expect(ErrorHandler.getErrorCode(error2)).toBe(ErrorCode.INVALID_REPOSITORY);
    });

    it('should map git errors correctly', () => {
      const error = { message: 'Git operation failed' };
      const code = ErrorHandler.getErrorCode(error);

      expect(code).toBe(ErrorCode.GIT_OPERATION_FAILED);
    });

    it('should return UNKNOWN_ERROR for unrecognized errors', () => {
      const error = { message: 'Some random error' };
      const code = ErrorHandler.getErrorCode(error);

      expect(code).toBe(ErrorCode.UNKNOWN_ERROR);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should preserve user-friendly messages', () => {
      const error = { message: 'Please check your input' };
      const message = ErrorHandler.getUserFriendlyMessage(error, ErrorCode.VALIDATION_ERROR);

      expect(message).toBe('Please check your input');
    });

    it('should generate friendly message for INVALID_REPOSITORY', () => {
      const error = { message: 'Not a repo' };
      const message = ErrorHandler.getUserFriendlyMessage(error, ErrorCode.INVALID_REPOSITORY);

      expect(message).toContain('valid git repository');
      expect(message).toContain('.git folder');
    });

    it('should generate friendly message for THEME_VALIDATION_FAILED', () => {
      const error = { message: 'Missing field' };
      const message = ErrorHandler.getUserFriendlyMessage(error, ErrorCode.THEME_VALIDATION_FAILED);

      expect(message).toContain('Theme validation failed');
      expect(message).toContain('Missing field');
    });

    it('should generate friendly message for GIT_OPERATION_FAILED', () => {
      const error = { message: 'Git command failed' };
      const message = ErrorHandler.getUserFriendlyMessage(error, ErrorCode.GIT_OPERATION_FAILED);

      expect(message).toContain('Git operation failed');
      expect(message).toContain('Git command failed');
    });
  });

  describe('createError', () => {
    it('should create SystemError with all fields', () => {
      const error = ErrorHandler.createError(
        'TEST_ERROR',
        'Test message',
        'TestComponent',
        { extra: 'data' }
      );

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test message');
      expect(error.component).toBe('TestComponent');
      expect(error.details).toEqual({ extra: 'data' });
      expect(error.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('isSystemError', () => {
    it('should return true for valid SystemError', () => {
      const error = {
        code: 'TEST',
        message: 'Test',
        component: 'Test',
        timestamp: new Date()
      };

      expect(ErrorHandler.isSystemError(error)).toBe(true);
    });

    it('should return false for generic error', () => {
      const error = new Error('Test');

      expect(ErrorHandler.isSystemError(error)).toBe(false);
    });

    it('should return false for incomplete error object', () => {
      const error = { code: 'TEST', message: 'Test' };

      expect(ErrorHandler.isSystemError(error)).toBe(false);
    });
  });

  describe('extractGitErrorDetails', () => {
    it('should extract git-specific error information', () => {
      const error = {
        message: 'Git failed',
        stack: 'stack trace',
        git: {
          command: 'git log',
          exitCode: 128,
          stderr: 'fatal: not a git repository'
        }
      };

      const details = ErrorHandler.extractGitErrorDetails(error);

      expect(details.message).toBe('Git failed');
      expect(details.stack).toBe('stack trace');
      expect(details.gitCommand).toBe('git log');
      expect(details.exitCode).toBe(128);
      expect(details.stderr).toBe('fatal: not a git repository');
    });

    it('should handle errors without git-specific info', () => {
      const error = { message: 'Generic error' };
      const details = ErrorHandler.extractGitErrorDetails(error);

      expect(details.message).toBe('Generic error');
      expect(details.gitCommand).toBeUndefined();
    });

    it('should return null for null error', () => {
      const details = ErrorHandler.extractGitErrorDetails(null);

      expect(details).toBeNull();
    });
  });

  // Feature: phantom-patch-notes, Property 31: Error context capture
  // Validates: Requirements 10.1, 10.2
  describe('Property 31: Error context capture', () => {
    test.prop([
      fc.string({ minLength: 1 }), // error message
      fc.string({ minLength: 1 }), // component name
      fc.option(fc.dictionary(fc.string(), fc.anything()), { nil: undefined }) // optional context
    ], { numRuns: 100 })(
      'For any error, the system should capture error with component name, error type, and contextual information',
      (errorMessage: string, componentName: string, context: Record<string, any> | undefined) => {
        // Create an error
        const error = new Error(errorMessage);
        
        // Handle the error with optional context
        const systemError = context 
          ? ErrorHandler.handle(error, componentName, context)
          : ErrorHandler.handle(error, componentName);

        // Verify all required fields are present
        expect(systemError.code).toBeDefined();
        expect(typeof systemError.code).toBe('string');
        expect(systemError.code.length).toBeGreaterThan(0);

        expect(systemError.message).toBeDefined();
        expect(typeof systemError.message).toBe('string');
        expect(systemError.message.length).toBeGreaterThan(0);

        expect(systemError.component).toBe(componentName);
        
        expect(systemError.timestamp).toBeInstanceOf(Date);
        
        expect(systemError.details).toBeDefined();
        expect(typeof systemError.details).toBe('object');
        
        // Verify original error is captured in details
        expect(systemError.details.originalError).toBeDefined();
        
        // Verify context is included if provided
        if (context) {
          for (const key in context) {
            expect(systemError.details[key]).toBe(context[key]);
          }
        }
      }
    );
  });
});

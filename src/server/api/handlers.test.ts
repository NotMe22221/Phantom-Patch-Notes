/**
 * API Handlers Tests
 * Tests for API request handlers including property-based tests
 */

import { describe, it, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import type { SystemError } from '../../shared/types.js';

// Mock request and response objects for testing
function createMockRequest(body: any = {}) {
  return {
    body,
    method: 'POST',
    path: '/api/test'
  };
}

function createMockResponse() {
  let statusCode = 200;
  let jsonData: any = null;

  return {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      jsonData = data;
      return this;
    },
    getStatus() {
      return statusCode;
    },
    getJson() {
      return jsonData;
    }
  };
}

// Import handlers
import * as handlers from './handlers.js';

describe('API Handlers', () => {
  describe('Error Handling', () => {
    // Feature: phantom-patch-notes, Property 16: Plugin API structured error handling
    // Validates: Requirements 5.3
    test.prop([
      fc.constantFrom('VALIDATION_ERROR', 'GIT_OPERATION_FAILED', 'INVALID_REPOSITORY', 'UNKNOWN_ERROR'),
      fc.string({ minLength: 1, maxLength: 200 }),
      fc.constantFrom('API', 'CommitParser', 'PatchNoteGenerator', 'ExportSystem', 'ThemeEngine')
    ], { numRuns: 100 })(
      'should return structured error with code, message, component, and timestamp',
      async (errorCode: string, errorMessage: string, component: string) => {
        // Test parseRepository with invalid input
        const req = createMockRequest({ repoPath: '' });
        const res = createMockResponse();

        await handlers.parseRepository(req as any, res as any);

        const response = res.getJson();
        const status = res.getStatus();

        // Verify error response structure
        expect(status).toBeGreaterThanOrEqual(400);
        expect(response).toBeDefined();
        expect(response).toHaveProperty('code');
        expect(response).toHaveProperty('message');
        expect(response).toHaveProperty('component');
        expect(response).toHaveProperty('timestamp');

        // Verify types
        expect(typeof response.code).toBe('string');
        expect(typeof response.message).toBe('string');
        expect(typeof response.component).toBe('string');
        expect(response.timestamp).toBeInstanceOf(Date);
      }
    );

    it('should handle missing repoPath in parse request', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();

      await handlers.parseRepository(req as any, res as any);

      const response = res.getJson() as SystemError;
      expect(res.getStatus()).toBe(400);
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.message).toContain('repoPath');
      expect(response.component).toBe('API');
    });

    it('should handle missing commits in generate request', async () => {
      const req = createMockRequest({});
      const res = createMockResponse();

      await handlers.generatePatchNotes(req as any, res as any);

      const response = res.getJson() as SystemError;
      expect(res.getStatus()).toBe(400);
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.message).toContain('commits');
      expect(response.component).toBe('API');
    });

    it('should handle invalid commits array in generate request', async () => {
      const req = createMockRequest({ commits: 'not-an-array' });
      const res = createMockResponse();

      await handlers.generatePatchNotes(req as any, res as any);

      const response = res.getJson() as SystemError;
      expect(res.getStatus()).toBe(400);
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.component).toBe('API');
    });

    it('should handle missing patchNote in export request', async () => {
      const req = createMockRequest({ format: 'markdown' });
      const res = createMockResponse();

      await handlers.exportPatchNotes(req as any, res as any);

      const response = res.getJson() as SystemError;
      expect(res.getStatus()).toBe(400);
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.message).toContain('patchNote');
      expect(response.component).toBe('API');
    });

    it('should handle missing format in export request', async () => {
      const req = createMockRequest({ 
        patchNote: { 
          version: 'v1.0.0', 
          date: new Date(), 
          sections: [], 
          originalCommits: [] 
        } 
      });
      const res = createMockResponse();

      await handlers.exportPatchNotes(req as any, res as any);

      const response = res.getJson() as SystemError;
      expect(res.getStatus()).toBe(400);
      expect(response.code).toBe('VALIDATION_ERROR');
      expect(response.message).toContain('format');
      expect(response.component).toBe('API');
    });
  });

  describe('Success Cases', () => {
    it('should list themes successfully', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handlers.listThemes(req as any, res as any);

      const response = res.getJson();
      expect(res.getStatus()).toBe(200);
      expect(response).toHaveProperty('themes');
      expect(Array.isArray(response.themes)).toBe(true);
      expect(response.themes.length).toBeGreaterThan(0);
    });

    it('should get preview data successfully', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handlers.getPreviewData(req as any, res as any);

      const response = res.getJson();
      expect(res.getStatus()).toBe(200);
      expect(response).toHaveProperty('commits');
      expect(response).toHaveProperty('synthetic');
      expect(Array.isArray(response.commits)).toBe(true);
      expect(response.synthetic).toBe(true);
    });
  });
});

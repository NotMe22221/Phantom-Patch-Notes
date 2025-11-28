/**
 * Property-based tests for API client
 * Tests universal properties that should hold across all valid executions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { parseRepository, generatePatchNotes, exportPatchNotes, getPreviewData } from './api-client.js';
import type { CommitData, PatchNote } from '../shared/types.js';

// Feature: phantom-patch-notes, Property 26: Frontend triggers backend operations
// For any repository selection, the Frontend should trigger commit parsing and note generation via API calls
// Validates: Requirements 8.2

describe('API Client - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset fetch mock
    (globalThis as any).fetch = vi.fn();
  });

  test.prop([
    fc.string({ minLength: 1, maxLength: 100 })
  ], { numRuns: 100 })(
    'Property 26: parseRepository triggers backend parse operation',
    async (repoPath: string) => {
      // Mock successful response
      const mockCommits: CommitData[] = [{
        hash: 'abc123',
        author: 'Test Author',
        email: 'test@example.com',
        timestamp: new Date(),
        message: 'Test commit',
        changedFiles: ['file.txt']
      }];

      ((globalThis as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCommits
      });

      // Call parseRepository
      const result = await parseRepository(repoPath);

      // Verify fetch was called with correct parameters
      expect((globalThis as any).fetch).toHaveBeenCalledWith(
        '/api/parse',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining(repoPath)
        })
      );

      // Verify result
      expect(result).toEqual(mockCommits);
    }
  );

  test.prop([
    fc.array(
      fc.record({
        hash: fc.hexaString({ minLength: 40, maxLength: 40 }),
        author: fc.string({ minLength: 1, maxLength: 50 }),
        email: fc.emailAddress(),
        timestamp: fc.date(),
        message: fc.string({ minLength: 1, maxLength: 100 }),
        changedFiles: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 })
      }),
      { minLength: 1, maxLength: 10 }
    )
  ], { numRuns: 100 })(
    'Property 26: generatePatchNotes triggers backend generation operation',
    async (commits: CommitData[]) => {
      // Mock successful response
      const mockPatchNote: PatchNote = {
        version: 'v1.0.0',
        date: new Date(),
        sections: [],
        originalCommits: commits
      };

      ((globalThis as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatchNote
      });

      // Call generatePatchNotes
      const result = await generatePatchNotes(commits);

      // Verify fetch was called with correct parameters
      expect((globalThis as any).fetch).toHaveBeenCalledWith(
        '/api/generate',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      // Verify result
      expect(result).toEqual(mockPatchNote);
    }
  );

  test.prop([
    fc.record({
      version: fc.string({ minLength: 1 }),
      date: fc.date(),
      sections: fc.array(fc.record({
        title: fc.string({ minLength: 1 }),
        type: fc.constantFrom('features' as const, 'fixes' as const, 'breaking' as const, 'other' as const),
        entries: fc.array(fc.record({
          themed: fc.string({ minLength: 1 }),
          original: fc.string({ minLength: 1 }),
          commitHash: fc.hexaString({ minLength: 40, maxLength: 40 })
        }))
      })),
      originalCommits: fc.constant([])
    }),
    fc.constantFrom('markdown' as const, 'html' as const, 'json' as const)
  ], { numRuns: 100 })(
    'Property 26: exportPatchNotes triggers backend export operation',
    async (patchNote: PatchNote, format: 'markdown' | 'html' | 'json') => {
      // Mock successful response
      const mockExportResult = {
        content: 'exported content',
        mimeType: 'text/plain',
        filename: 'patch-notes.txt'
      };

      ((globalThis as any).fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockExportResult
      });

      // Call exportPatchNotes
      const result = await exportPatchNotes(patchNote, format);

      // Verify fetch was called with correct parameters
      expect((globalThis as any).fetch).toHaveBeenCalledWith(
        '/api/export',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      // Verify result
      expect(result).toEqual(mockExportResult);
    }
  );

  it('Property 26: getPreviewData triggers backend preview operation', async () => {
    // Mock successful response
    const mockPreviewData = {
      commits: [{
        hash: 'abc123',
        author: 'Test Author',
        email: 'test@example.com',
        timestamp: new Date(),
        message: 'Test commit',
        changedFiles: ['file.txt']
      }],
      synthetic: true
    };

    ((globalThis as any).fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPreviewData
    });

    // Call getPreviewData
    const result = await getPreviewData();

    // Verify fetch was called with correct parameters
    expect((globalThis as any).fetch).toHaveBeenCalledWith(
      '/api/preview',
      expect.objectContaining({
        method: 'GET'
      })
    );

    // Verify result
    expect(result).toEqual(mockPreviewData);
  });

  test.prop([
    fc.record({
      response: fc.record({
        data: fc.record({
          error: fc.record({
            component: fc.string({ minLength: 1 }),
            message: fc.string({ minLength: 1 }),
            code: fc.string({ minLength: 1 })
          })
        })
      })
    })
  ], { numRuns: 100 })(
    'Property 26: API client propagates errors from backend',
    async (error: any) => {
      // Mock error response
      ((globalThis as any).fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => error.response.data
      });

      // Call parseRepository and expect error
      await expect(parseRepository('/test/path')).rejects.toEqual(error.response.data);
    }
  );
});

/**
 * Tests for Export System module
 */

import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';
import { ExportSystem } from './export.js';
import type { PatchNote, PatchNoteSection, PatchNoteEntry, CommitData } from '../../shared/types.js';

// ============================================================================
// Generators for property-based testing
// ============================================================================

/**
 * Generates arbitrary commit data
 */
const commitDataArb = fc.record({
  hash: fc.hexaString({ minLength: 40, maxLength: 40 }),
  author: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  timestamp: fc.date(),
  message: fc.string({ minLength: 1, maxLength: 200 }),
  changedFiles: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 0, maxLength: 10 })
});

/**
 * Generates arbitrary patch note entry
 */
const patchNoteEntryArb = fc.record({
  themed: fc.string({ minLength: 1, maxLength: 300 }),
  original: fc.string({ minLength: 1, maxLength: 200 }),
  commitHash: fc.hexaString({ minLength: 40, maxLength: 40 })
});

/**
 * Generates arbitrary patch note section
 */
const patchNoteSectionArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  type: fc.constantFrom('features' as const, 'fixes' as const, 'breaking' as const, 'other' as const),
  entries: fc.array(patchNoteEntryArb, { minLength: 1, maxLength: 10 })
});

/**
 * Generates arbitrary patch note
 */
const patchNoteArb = fc.record({
  version: fc.string({ minLength: 1, maxLength: 20 }),
  date: fc.date(),
  sections: fc.array(patchNoteSectionArb, { minLength: 1, maxLength: 5 }),
  originalCommits: fc.array(commitDataArb, { minLength: 1, maxLength: 20 })
});

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('ExportSystem', () => {
  describe('Markdown Export', () => {
    // Feature: phantom-patch-notes, Property 7: Markdown export validity
    // Validates: Requirements 3.1
    it('should export valid Markdown for any patch note', () => {
      fc.assert(
        fc.property(patchNoteArb, (patchNote: PatchNote) => {
          const exporter = new ExportSystem();
          const result = exporter.exportMarkdown(patchNote);

          // Verify result structure
          expect(result).toHaveProperty('content');
          expect(result).toHaveProperty('mimeType');
          expect(result).toHaveProperty('filename');

          // Verify MIME type
          expect(result.mimeType).toBe('text/markdown');

          // Verify filename format
          expect(result.filename).toMatch(/^patch-notes-.+\.md$/);

          // Verify content is non-empty string
          expect(typeof result.content).toBe('string');
          expect(result.content.length).toBeGreaterThan(0);

          // Verify Markdown structure - should contain version
          expect(result.content).toContain(patchNote.version);

          // Verify all sections are present
          for (const section of patchNote.sections) {
            expect(result.content).toContain(section.title);
            
            // Verify all entries in section are present
            for (const entry of section.entries) {
              expect(result.content).toContain(entry.themed);
              expect(result.content).toContain(entry.original);
              expect(result.content).toContain(entry.commitHash.substring(0, 7));
            }
          }

          // Verify Markdown formatting elements are present
          expect(result.content).toMatch(/^#\s/m); // Headers
          expect(result.content).toMatch(/^-\s/m); // List items
          expect(result.content).toMatch(/\*\*/); // Bold text
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('HTML Export', () => {
    // Feature: phantom-patch-notes, Property 8: HTML export validity with CSS
    // Validates: Requirements 3.2, 3.4
    it('should export valid HTML with embedded CSS for any patch note', () => {
      fc.assert(
        fc.property(patchNoteArb, (patchNote: PatchNote) => {
          const exporter = new ExportSystem();
          const result = exporter.exportHTML(patchNote, true);

          // Verify result structure
          expect(result).toHaveProperty('content');
          expect(result).toHaveProperty('mimeType');
          expect(result).toHaveProperty('filename');

          // Verify MIME type
          expect(result.mimeType).toBe('text/html');

          // Verify filename format
          expect(result.filename).toMatch(/^patch-notes-.+\.html$/);

          // Verify content is non-empty string
          expect(typeof result.content).toBe('string');
          expect(result.content.length).toBeGreaterThan(0);

          // Verify HTML5 structure
          expect(result.content).toContain('<!DOCTYPE html>');
          expect(result.content).toContain('<html');
          expect(result.content).toContain('<head>');
          expect(result.content).toContain('</head>');
          expect(result.content).toContain('<body>');
          expect(result.content).toContain('</body>');
          expect(result.content).toContain('</html>');

          // Verify meta tags
          expect(result.content).toContain('<meta charset="UTF-8">');
          expect(result.content).toContain('<meta name="viewport"');

          // Verify title contains version
          expect(result.content).toContain(`<title>Patch Notes ${patchNote.version}</title>`);

          // Verify embedded CSS is present
          expect(result.content).toContain('<style>');
          expect(result.content).toContain('</style>');
          
          // Verify horror-themed CSS elements
          expect(result.content).toMatch(/background.*gradient/i);
          expect(result.content).toMatch(/color.*#/);

          // Verify content includes version
          expect(result.content).toContain(patchNote.version);

          // Verify all sections are present in HTML
          for (const section of patchNote.sections) {
            expect(result.content).toContain(section.title);
            
            // Verify all entries in section are present
            for (const entry of section.entries) {
              expect(result.content).toContain(entry.themed);
              expect(result.content).toContain(entry.original);
            }
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should export HTML without styles when includeStyles is false', () => {
      fc.assert(
        fc.property(patchNoteArb, (patchNote: PatchNote) => {
          const exporter = new ExportSystem();
          const result = exporter.exportHTML(patchNote, false);

          // Verify HTML structure is present
          expect(result.content).toContain('<!DOCTYPE html>');
          expect(result.content).toContain('<html');

          // Verify no embedded styles
          expect(result.content).not.toContain('<style>');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('JSON Export', () => {
    // Feature: phantom-patch-notes, Property 9: JSON round-trip preservation
    // Validates: Requirements 3.3, 3.5
    it('should preserve all metadata and structure in JSON round-trip for any patch note', () => {
      fc.assert(
        fc.property(patchNoteArb, (patchNote: PatchNote) => {
          const exporter = new ExportSystem();
          
          // Export to JSON
          const result = exporter.exportJSON(patchNote, false);

          // Verify result structure
          expect(result).toHaveProperty('content');
          expect(result).toHaveProperty('mimeType');
          expect(result).toHaveProperty('filename');

          // Verify MIME type
          expect(result.mimeType).toBe('application/json');

          // Verify filename format
          expect(result.filename).toMatch(/^patch-notes-.+\.json$/);

          // Verify content is valid JSON
          expect(() => JSON.parse(result.content)).not.toThrow();

          // Parse back to object
          const parsed = JSON.parse(result.content);

          // Verify round-trip preservation - version
          expect(parsed.version).toBe(patchNote.version);

          // Verify date (dates are serialized as strings in JSON)
          expect(new Date(parsed.date).getTime()).toBe(patchNote.date.getTime());

          // Verify sections count
          expect(parsed.sections).toHaveLength(patchNote.sections.length);

          // Verify each section
          for (let i = 0; i < patchNote.sections.length; i++) {
            const originalSection = patchNote.sections[i];
            const parsedSection = parsed.sections[i];

            expect(parsedSection.title).toBe(originalSection.title);
            expect(parsedSection.type).toBe(originalSection.type);
            expect(parsedSection.entries).toHaveLength(originalSection.entries.length);

            // Verify each entry
            for (let j = 0; j < originalSection.entries.length; j++) {
              const originalEntry = originalSection.entries[j];
              const parsedEntry = parsedSection.entries[j];

              expect(parsedEntry.themed).toBe(originalEntry.themed);
              expect(parsedEntry.original).toBe(originalEntry.original);
              expect(parsedEntry.commitHash).toBe(originalEntry.commitHash);
            }
          }

          // Verify original commits count
          expect(parsed.originalCommits).toHaveLength(patchNote.originalCommits.length);

          // Verify each original commit
          for (let i = 0; i < patchNote.originalCommits.length; i++) {
            const originalCommit = patchNote.originalCommits[i];
            const parsedCommit = parsed.originalCommits[i];

            expect(parsedCommit.hash).toBe(originalCommit.hash);
            expect(parsedCommit.author).toBe(originalCommit.author);
            expect(parsedCommit.email).toBe(originalCommit.email);
            expect(new Date(parsedCommit.timestamp).getTime()).toBe(originalCommit.timestamp.getTime());
            expect(parsedCommit.message).toBe(originalCommit.message);
            expect(parsedCommit.changedFiles).toEqual(originalCommit.changedFiles);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should format JSON with indentation when pretty is true', () => {
      fc.assert(
        fc.property(patchNoteArb, (patchNote: PatchNote) => {
          const exporter = new ExportSystem();
          
          // Export with pretty printing
          const prettyResult = exporter.exportJSON(patchNote, true);
          
          // Export without pretty printing
          const compactResult = exporter.exportJSON(patchNote, false);

          // Pretty printed should have newlines and indentation
          expect(prettyResult.content).toContain('\n');
          expect(prettyResult.content).toMatch(/\n\s+/); // Newline followed by spaces

          // Compact should be shorter
          expect(compactResult.content.length).toBeLessThan(prettyResult.content.length);

          // Both should parse to equivalent objects
          const prettyParsed = JSON.parse(prettyResult.content);
          const compactParsed = JSON.parse(compactResult.content);
          
          expect(prettyParsed.version).toBe(compactParsed.version);
          expect(prettyParsed.sections.length).toBe(compactParsed.sections.length);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Unified Export Interface', () => {
    it('should route to correct exporter based on format', () => {
      fc.assert(
        fc.property(patchNoteArb, (patchNote: PatchNote) => {
          const exporter = new ExportSystem();

          // Test markdown format
          const mdResult = exporter.export(patchNote, { format: 'markdown' });
          expect(mdResult.mimeType).toBe('text/markdown');
          expect(mdResult.filename).toMatch(/\.md$/);

          // Test HTML format
          const htmlResult = exporter.export(patchNote, { format: 'html' });
          expect(htmlResult.mimeType).toBe('text/html');
          expect(htmlResult.filename).toMatch(/\.html$/);

          // Test JSON format
          const jsonResult = exporter.export(patchNote, { format: 'json' });
          expect(jsonResult.mimeType).toBe('application/json');
          expect(jsonResult.filename).toMatch(/\.json$/);
        }),
        { numRuns: 100 }
      );
    });
  });
});

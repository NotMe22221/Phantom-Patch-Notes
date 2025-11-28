/**
 * Property-based tests for error resilience
 * Tests that the system maintains state and prevents data corruption on errors
 */

import { describe, it, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { ThemeEngine } from './theme-engine.js';
import { ExportSystem } from './export.js';
import type { PatchNote, ThemeConfig } from '../../shared/types.js';

// Feature: phantom-patch-notes, Property 34: Error resilience maintains state
// For any critical error, the system should maintain consistent state and prevent data corruption.
// Validates: Requirements 10.5

describe('Error Resilience - Property-Based Tests', () => {
  describe('Property 34: Error resilience maintains state', () => {
    test.prop([
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 20 }),
        // Intentionally create invalid theme configs to trigger errors
        vocabulary: fc.oneof(
          fc.constant(null), // Invalid: null vocabulary
          fc.constant({}), // Invalid: empty vocabulary
          fc.record({
            verbs: fc.oneof(fc.constant(null), fc.constant([]), fc.array(fc.string(), { maxLength: 2 })),
            adjectives: fc.oneof(fc.constant(null), fc.constant([]), fc.array(fc.string(), { maxLength: 2 })),
            nouns: fc.oneof(fc.constant(null), fc.constant([]), fc.array(fc.string(), { maxLength: 2 }))
          })
        ),
        patterns: fc.oneof(
          fc.constant(null), // Invalid: null patterns
          fc.constant([]) // Invalid: empty patterns
        )
      })
    ], { numRuns: 100 })(
      'ThemeEngine should maintain default theme state when loading invalid themes',
      (invalidThemeConfig: any) => {
        // Arrange
        const engine = new ThemeEngine();
        const initialTheme = engine.getActiveTheme();
        const initialThemeName = initialTheme.name;

        // Act - Try to load invalid theme
        try {
          engine.loadTheme(invalidThemeConfig as ThemeConfig);
        } catch (error) {
          // Expected to throw
        }

        // Assert - State should be maintained (default theme should still be active)
        const currentTheme = engine.getActiveTheme();
        expect(currentTheme).toBeDefined();
        expect(currentTheme.name).toBe(initialThemeName);
        expect(currentTheme.vocabulary).toBeDefined();
        expect(currentTheme.vocabulary.verbs).toBeDefined();
        expect(Array.isArray(currentTheme.vocabulary.verbs)).toBe(true);
        expect(currentTheme.vocabulary.verbs.length).toBeGreaterThan(0);
        expect(currentTheme.patterns).toBeDefined();
        expect(Array.isArray(currentTheme.patterns)).toBe(true);
        expect(currentTheme.patterns.length).toBeGreaterThan(0);

        // Verify theme engine is still functional
        const result = engine.applyTheme('test message', 'addition');
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
      }
    );

    test.prop([
      fc.string({ minLength: 1, maxLength: 30 })
    ], { numRuns: 100 })(
      'ThemeEngine should maintain state when loading non-existent themes by name',
      (nonExistentThemeName: string) => {
        // Arrange
        const engine = new ThemeEngine();
        const initialTheme = engine.getActiveTheme();
        const initialThemeName = initialTheme.name;

        // Act - Try to load non-existent theme
        engine.loadThemeByName(nonExistentThemeName);

        // Assert - Should fall back to default theme and remain functional
        const currentTheme = engine.getActiveTheme();
        expect(currentTheme).toBeDefined();
        expect(currentTheme.name).toBe(initialThemeName);
        
        // Verify theme engine is still functional
        const result = engine.applyTheme('test message', 'fix');
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        
        // Verify we can still list themes
        const themes = engine.listAvailableThemes();
        expect(Array.isArray(themes)).toBe(true);
        expect(themes.length).toBeGreaterThan(0);
      }
    );

    test.prop([
      fc.record({
        version: fc.string({ minLength: 1, maxLength: 10 }),
        date: fc.date(),
        sections: fc.array(
          fc.record({
            title: fc.string({ minLength: 1, maxLength: 30 }),
            type: fc.constantFrom('features', 'fixes', 'breaking', 'other'),
            entries: fc.array(
              fc.record({
                themed: fc.string({ minLength: 1, maxLength: 50 }),
                original: fc.string({ minLength: 1, maxLength: 50 }),
                commitHash: fc.hexaString({ minLength: 7, maxLength: 40 })
              }),
              { minLength: 1, maxLength: 3 }
            )
          }),
          { minLength: 1, maxLength: 3 }
        ),
        originalCommits: fc.constant([])
      }),
      fc.constantFrom('markdown', 'html', 'json', 'invalid-format' as any)
    ], { numRuns: 100 })(
      'ExportSystem should handle errors gracefully without corrupting data',
      (patchNote: PatchNote, format: any) => {
        // Arrange
        const exportSystem = new ExportSystem();
        const originalPatchNote = JSON.parse(JSON.stringify(patchNote)); // Deep clone

        // Act
        try {
          exportSystem.export(patchNote, { format });
        } catch (error: any) {
          // Expected for invalid formats
          if (format === 'invalid-format') {
            // Verify error is structured
            expect(error).toBeDefined();
            expect(error.code).toBeDefined();
            expect(error.message).toBeDefined();
            expect(error.component).toBe('ExportSystem');
          }
        }

        // Assert - Original patch note should not be modified
        expect(patchNote.version).toBe(originalPatchNote.version);
        expect(patchNote.sections.length).toBe(originalPatchNote.sections.length);
        
        // Verify export system is still functional with valid format
        const validResult = exportSystem.export(patchNote, { format: 'json' });
        expect(validResult).toBeDefined();
        expect(validResult.content).toBeDefined();
        expect(validResult.mimeType).toBe('application/json');
      }
    );

    test.prop([
      fc.string({ minLength: 1, maxLength: 100 }),
      fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking', 'invalid-type' as any)
    ], { numRuns: 100 })(
      'ThemeEngine should handle invalid change types without corrupting state',
      (text: string, changeType: any) => {
        // Arrange
        const engine = new ThemeEngine();
        const initialTheme = engine.getActiveTheme();

        // Act - Apply theme with potentially invalid change type
        const result = engine.applyTheme(text, changeType);

        // Assert - Should return a valid result (either themed or original text)
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        
        // Verify theme engine state is maintained
        const currentTheme = engine.getActiveTheme();
        expect(currentTheme.name).toBe(initialTheme.name);
        
        // Verify engine is still functional
        const validResult = engine.applyTheme('test', 'addition');
        expect(validResult).toBeDefined();
        expect(typeof validResult).toBe('string');
      }
    );

    it('ExportSystem should maintain functionality after multiple error scenarios', () => {
      // Arrange
      const exportSystem = new ExportSystem();
      const validPatchNote: PatchNote = {
        version: '1.0.0',
        date: new Date(),
        sections: [{
          title: 'Test',
          type: 'features',
          entries: [{
            themed: 'Test themed',
            original: 'Test original',
            commitHash: 'abc123'
          }]
        }],
        originalCommits: []
      };

      // Act - Trigger multiple errors
      const errors: any[] = [];
      
      try {
        exportSystem.export(validPatchNote, { format: 'invalid' as any });
      } catch (e) {
        errors.push(e);
      }

      try {
        exportSystem.export(validPatchNote, { format: 'another-invalid' as any });
      } catch (e) {
        errors.push(e);
      }

      // Assert - All errors should be structured
      expect(errors.length).toBe(2);
      for (const error of errors) {
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.component).toBe('ExportSystem');
      }

      // Verify export system is still functional
      const markdownResult = exportSystem.exportMarkdown(validPatchNote);
      expect(markdownResult.content).toBeDefined();
      expect(markdownResult.mimeType).toBe('text/markdown');

      const htmlResult = exportSystem.exportHTML(validPatchNote);
      expect(htmlResult.content).toBeDefined();
      expect(htmlResult.mimeType).toBe('text/html');

      const jsonResult = exportSystem.exportJSON(validPatchNote);
      expect(jsonResult.content).toBeDefined();
      expect(jsonResult.mimeType).toBe('application/json');
    });

    it('ThemeEngine should maintain functionality after multiple error scenarios', () => {
      // Arrange
      const engine = new ThemeEngine();
      const initialThemeName = engine.getActiveTheme().name;

      // Act - Trigger multiple errors
      const invalidThemes = [
        { name: 'invalid1', vocabulary: null, patterns: null },
        { name: 'invalid2', vocabulary: {}, patterns: [] },
        { name: 'invalid3', vocabulary: { verbs: null }, patterns: null }
      ];

      for (const invalidTheme of invalidThemes) {
        try {
          engine.loadTheme(invalidTheme as any);
        } catch (e) {
          // Expected
        }
      }

      // Try to load non-existent themes
      engine.loadThemeByName('nonexistent1');
      engine.loadThemeByName('nonexistent2');

      // Assert - Theme engine should still be functional
      const currentTheme = engine.getActiveTheme();
      expect(currentTheme.name).toBe(initialThemeName);

      // Verify all operations still work
      const applyResult = engine.applyTheme('test message', 'addition');
      expect(applyResult).toBeDefined();

      const themes = engine.listAvailableThemes();
      expect(themes.length).toBeGreaterThan(0);

      const changeType = engine.detectChangeType('fix: bug');
      expect(changeType).toBe('fix');
    });
  });
});

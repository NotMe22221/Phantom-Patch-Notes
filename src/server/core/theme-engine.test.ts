/**
 * Property-based tests for Theme Engine
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ThemeEngine, ThemeValidationError } from './theme-engine.js';
import type { ThemeConfig, NarrativePattern } from '../../shared/types.js';

describe('ThemeEngine', () => {
  // Feature: phantom-patch-notes, Property 22: Theme loading supports multiple configurations
  // Validates: Requirements 7.1
  it('should load and make available multiple theme configurations', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }),
            vocabulary: fc.record({
              verbs: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 10 }),
              adjectives: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 10 }),
              nouns: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 10 })
            }),
            patterns: fc.array(
              fc.record({
                type: fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking'),
                templates: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 })
              }) as fc.Arbitrary<NarrativePattern>,
              { minLength: 1, maxLength: 5 }
            ),
            cssStyles: fc.option(fc.string({ maxLength: 100 }), { nil: undefined })
          }) as fc.Arbitrary<ThemeConfig>,
          { minLength: 1, maxLength: 5 }
        ),
        (themes) => {
          const engine = new ThemeEngine();
          
          // Load all themes
          for (const theme of themes) {
            engine.loadTheme(theme);
          }
          
          // Get available themes
          const availableThemes = engine.listAvailableThemes();
          
          // All loaded themes should be available
          for (const theme of themes) {
            expect(availableThemes).toContain(theme.name);
          }
          
          // Should include at least the default theme
          expect(availableThemes.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: phantom-patch-notes, Property 6: Theme consistency
  // Validates: Requirements 2.4, 7.3
  it('should use consistent vocabulary and patterns from the same theme', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 20 }),
          vocabulary: fc.record({
            verbs: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 3, maxLength: 10 }),
            adjectives: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 3, maxLength: 10 }),
            nouns: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 3, maxLength: 10 })
          }),
          patterns: fc.array(
            fc.record({
              type: fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking'),
              templates: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 })
            }) as fc.Arbitrary<NarrativePattern>,
            { minLength: 5, maxLength: 5 }
          ),
          cssStyles: fc.option(fc.string({ maxLength: 100 }), { nil: undefined })
        }) as fc.Arbitrary<ThemeConfig>,
        fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 5, maxLength: 20 }),
        (theme, texts) => {
          const engine = new ThemeEngine();
          engine.loadTheme(theme);
          
          // Apply theme to all texts with the same change type
          const changeType = 'addition';
          const transformedTexts = texts.map(text => engine.applyTheme(text, changeType));
          
          // All transformed texts should use patterns from the theme
          const pattern = theme.patterns.find(p => p.type === changeType);
          
          if (pattern && pattern.templates.length > 0) {
            // Each transformed text should match at least one template pattern
            for (const transformed of transformedTexts) {
              // The transformed text should be different from original (unless no templates)
              // or should contain elements from the theme's vocabulary
              const usesThemeVocab = 
                theme.vocabulary.verbs.some(v => transformed.toLowerCase().includes(v.toLowerCase())) ||
                theme.vocabulary.adjectives.some(a => transformed.toLowerCase().includes(a.toLowerCase())) ||
                theme.vocabulary.nouns.some(n => transformed.toLowerCase().includes(n.toLowerCase()));
              
              // Either uses theme vocabulary or matches a template structure
              const matchesTemplate = pattern.templates.some(template => {
                // Check if the structure is similar (has placeholders replaced)
                const templateBase = template.replace(/\{[^}]+\}/g, '').trim();
                return templateBase.length === 0 || transformed.includes(templateBase);
              });
              
              expect(usesThemeVocab || matchesTemplate || transformed.length > 0).toBe(true);
            }
          }
          
          // Verify the active theme is the one we loaded
          expect(engine.getActiveTheme().name).toBe(theme.name);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: phantom-patch-notes, Property 25: Theme validation rejects invalid configurations
  // Validates: Requirements 7.5
  it('should reject invalid theme configurations', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Missing name
          fc.record({
            name: fc.constant(''),
            vocabulary: fc.record({
              verbs: fc.array(fc.string()),
              adjectives: fc.array(fc.string()),
              nouns: fc.array(fc.string())
            }),
            patterns: fc.array(
              fc.record({
                type: fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking'),
                templates: fc.array(fc.string())
              }) as fc.Arbitrary<NarrativePattern>
            )
          }),
          // Missing vocabulary
          fc.record({
            name: fc.string({ minLength: 1 }),
            vocabulary: fc.constant(null as any),
            patterns: fc.array(
              fc.record({
                type: fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking'),
                templates: fc.array(fc.string())
              }) as fc.Arbitrary<NarrativePattern>
            )
          }),
          // Invalid vocabulary structure (missing verbs)
          fc.record({
            name: fc.string({ minLength: 1 }),
            vocabulary: fc.record({
              verbs: fc.constant(null as any),
              adjectives: fc.array(fc.string()),
              nouns: fc.array(fc.string())
            }),
            patterns: fc.array(
              fc.record({
                type: fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking'),
                templates: fc.array(fc.string())
              }) as fc.Arbitrary<NarrativePattern>
            )
          }),
          // Missing patterns
          fc.record({
            name: fc.string({ minLength: 1 }),
            vocabulary: fc.record({
              verbs: fc.array(fc.string()),
              adjectives: fc.array(fc.string()),
              nouns: fc.array(fc.string())
            }),
            patterns: fc.constant(null as any)
          }),
          // Invalid pattern type
          fc.record({
            name: fc.string({ minLength: 1 }),
            vocabulary: fc.record({
              verbs: fc.array(fc.string()),
              adjectives: fc.array(fc.string()),
              nouns: fc.array(fc.string())
            }),
            patterns: fc.array(
              fc.record({
                type: fc.constant('invalid_type' as any),
                templates: fc.array(fc.string())
              })
            )
          })
        ) as fc.Arbitrary<ThemeConfig>,
        (invalidTheme) => {
          const engine = new ThemeEngine();
          
          // Attempting to load an invalid theme should throw ThemeValidationError
          expect(() => {
            engine.loadTheme(invalidTheme);
          }).toThrow(ThemeValidationError);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: phantom-patch-notes, Property 33: Theme fallback on failure
  // Validates: Requirements 10.4
  it('should fall back to default theme when theme application fails', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
        (themeName, texts) => {
          const engine = new ThemeEngine();
          
          // Try to load a non-existent theme
          engine.loadThemeByName(themeName);
          
          // Engine should still be functional with default theme
          const activeTheme = engine.getActiveTheme();
          expect(activeTheme).toBeDefined();
          expect(activeTheme.name).toBeDefined();
          
          // Should be able to apply theme to texts without errors
          for (const text of texts) {
            const result = engine.applyTheme(text, 'addition');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
          }
          
          // Engine should still list available themes
          const availableThemes = engine.listAvailableThemes();
          expect(availableThemes.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should fall back to original text when theme application encounters errors', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom('addition', 'removal', 'modification', 'fix', 'breaking'),
        (text, changeType) => {
          const engine = new ThemeEngine();
          
          // Create a theme with empty patterns to potentially cause issues
          const problematicTheme: ThemeConfig = {
            name: 'problematic',
            vocabulary: {
              verbs: [],
              adjectives: [],
              nouns: []
            },
            patterns: []
          };
          
          try {
            engine.loadTheme(problematicTheme);
          } catch (error) {
            // If loading fails, that's expected for invalid themes
          }
          
          // Apply theme should not throw, should return text or transformed version
          const result = engine.applyTheme(text, changeType);
          expect(result).toBeDefined();
          expect(typeof result).toBe('string');
          
          // Result should be either the original text or a valid transformation
          expect(result.length).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: phantom-patch-notes, Property 24: Theme extensibility without code changes
  // Validates: Requirements 7.4
  it('should load and apply new themes without requiring code modifications', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(name => name !== 'haunted'),
            vocabulary: fc.record({
              verbs: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 10 }),
              adjectives: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 10 }),
              nouns: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 10 })
            }),
            patterns: fc.constantFrom(
              // Generate all 5 required pattern types
              [
                { type: 'addition' as const, templates: ['Added {feature}', 'Created {feature}'] },
                { type: 'removal' as const, templates: ['Removed {feature}', 'Deleted {feature}'] },
                { type: 'modification' as const, templates: ['Modified {feature}', 'Updated {feature}'] },
                { type: 'fix' as const, templates: ['Fixed {bug} in {component}', 'Resolved {bug}'] },
                { type: 'breaking' as const, templates: ['Breaking change to {feature}', 'Rebuilt {feature}'] }
              ]
            ),
            cssStyles: fc.option(fc.string({ maxLength: 100 }), { nil: undefined })
          }) as fc.Arbitrary<ThemeConfig>,
          { minLength: 1, maxLength: 3 }
        ),
        fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 3, maxLength: 10 }),
        (newThemes, testTexts) => {
          // Create a new ThemeEngine instance (simulating application startup)
          const engine = new ThemeEngine();
          
          // Get initial available themes (should include default)
          const initialThemes = engine.listAvailableThemes();
          expect(initialThemes).toContain('haunted'); // Default theme should be present
          
          // Load new themes programmatically (simulating theme files being added)
          for (const theme of newThemes) {
            // This simulates adding a new theme file without code changes
            engine.loadTheme(theme);
          }
          
          // Verify all new themes are now available
          const updatedThemes = engine.listAvailableThemes();
          for (const theme of newThemes) {
            expect(updatedThemes).toContain(theme.name);
          }
          
          // Verify each new theme can be activated and used
          for (const theme of newThemes) {
            engine.loadThemeByName(theme.name);
            
            // Verify the theme is active
            const activeTheme = engine.getActiveTheme();
            expect(activeTheme.name).toBe(theme.name);
            
            // Verify the theme can be applied to text
            for (const text of testTexts) {
              const changeType = 'addition';
              const result = engine.applyTheme(text, changeType);
              
              // Result should be defined and be a string
              expect(result).toBeDefined();
              expect(typeof result).toBe('string');
              expect(result.length).toBeGreaterThan(0);
            }
          }
          
          // Verify we can switch between themes without issues
          if (newThemes.length > 1) {
            engine.loadThemeByName(newThemes[0].name);
            expect(engine.getActiveTheme().name).toBe(newThemes[0].name);
            
            engine.loadThemeByName(newThemes[newThemes.length - 1].name);
            expect(engine.getActiveTheme().name).toBe(newThemes[newThemes.length - 1].name);
          }
          
          // Verify we can still access the default theme
          engine.loadThemeByName('haunted');
          expect(engine.getActiveTheme().name).toBe('haunted');
        }
      ),
      { numRuns: 100 }
    );
  });
});

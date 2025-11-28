/**
 * Theme Engine - Applies horror-themed styling and narrative patterns
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ThemeConfig, ThemeVocabulary, NarrativePattern } from '../../shared/types.js';
import { ErrorHandler } from './error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Default haunted theme configuration
 */
const DEFAULT_THEME: ThemeConfig = {
  name: 'haunted',
  vocabulary: {
    verbs: ['summoned', 'banished', 'cursed', 'conjured', 'exorcised', 'manifested', 'vanished'],
    adjectives: ['spectral', 'eldritch', 'haunted', 'ethereal', 'cursed', 'phantom', 'ghostly'],
    nouns: ['phantom', 'specter', 'wraith', 'spirit', 'apparition', 'entity', 'shade']
  },
  patterns: [
    {
      type: 'addition',
      templates: [
        'Summoned {feature} from the void',
        'Conjured {feature} into existence',
        'Manifested {feature} from the shadows'
      ]
    },
    {
      type: 'removal',
      templates: [
        'Banished {feature} to the shadow realm',
        'Exorcised {feature} from the codebase',
        'Vanished {feature} into the mist'
      ]
    },
    {
      type: 'modification',
      templates: [
        'Transformed {feature} with dark magic',
        'Cursed {feature} with new powers',
        'Reshaped {feature} through spectral forces'
      ]
    },
    {
      type: 'fix',
      templates: [
        'Exorcised the {bug} haunting {component}',
        'Banished the curse afflicting {component}',
        'Purified {component} of its {bug}'
      ]
    },
    {
      type: 'breaking',
      templates: [
        'Shattered {feature} in a ritual of renewal',
        'Obliterated {feature} to summon something greater',
        'Sacrificed {feature} for dark purposes'
      ]
    }
  ]
};

/**
 * Theme validation error
 */
export class ThemeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThemeValidationError';
  }
}

/**
 * Theme Engine implementation
 */
export class ThemeEngine {
  private activeTheme: ThemeConfig;
  private availableThemes: Map<string, ThemeConfig>;
  private themesPath: string;
  private readonly defaultTheme: ThemeConfig;

  constructor() {
    this.defaultTheme = DEFAULT_THEME;
    this.activeTheme = DEFAULT_THEME;
    this.availableThemes = new Map();
    this.availableThemes.set(DEFAULT_THEME.name, DEFAULT_THEME);
    
    // Path to themes directory
    this.themesPath = join(__dirname, '../../../src/themes');
    
    // Load all available themes
    this.loadAvailableThemes();
  }

  /**
   * Load all theme files from the themes directory
   */
  private loadAvailableThemes(): void {
    try {
      const files = readdirSync(this.themesPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const themePath = join(this.themesPath, file);
            const themeData = readFileSync(themePath, 'utf-8');
            const theme = JSON.parse(themeData) as ThemeConfig;
            
            // Store the theme
            this.availableThemes.set(theme.name, theme);
          } catch (error) {
            // Log error with context but continue loading other themes
            const systemError = ErrorHandler.handle(error, 'ThemeEngine', { 
              file, 
              operation: 'loadTheme' 
            });
            console.warn(`Failed to load theme from ${file}:`, systemError.message);
          }
        }
      }
    } catch (error) {
      // Log error but don't fail - we have default theme
      const systemError = ErrorHandler.handle(error, 'ThemeEngine', { 
        themesPath: this.themesPath,
        operation: 'loadAvailableThemes' 
      });
      console.warn('Failed to load themes directory:', systemError.message);
    }
  }

  /**
   * Validate theme configuration structure
   */
  validateTheme(config: ThemeConfig): boolean {
    // Check required fields
    if (!config.name || typeof config.name !== 'string') {
      throw new ThemeValidationError('Theme must have a valid name');
    }

    if (!config.vocabulary || typeof config.vocabulary !== 'object') {
      throw new ThemeValidationError('Theme must have a vocabulary object');
    }

    if (!Array.isArray(config.vocabulary.verbs)) {
      throw new ThemeValidationError('Theme vocabulary must have a verbs array');
    }

    if (!Array.isArray(config.vocabulary.adjectives)) {
      throw new ThemeValidationError('Theme vocabulary must have an adjectives array');
    }

    if (!Array.isArray(config.vocabulary.nouns)) {
      throw new ThemeValidationError('Theme vocabulary must have a nouns array');
    }

    if (!Array.isArray(config.patterns)) {
      throw new ThemeValidationError('Theme must have a patterns array');
    }

    // Validate patterns
    for (const pattern of config.patterns) {
      if (!pattern.type || !['addition', 'removal', 'modification', 'fix', 'breaking'].includes(pattern.type)) {
        throw new ThemeValidationError(`Invalid pattern type: ${pattern.type}`);
      }

      if (!Array.isArray(pattern.templates)) {
        throw new ThemeValidationError('Pattern must have a templates array');
      }
    }

    return true;
  }

  /**
   * Load and activate a specific theme with validation and fallback
   */
  loadTheme(config: ThemeConfig): void {
    try {
      // Validate the theme
      this.validateTheme(config);
      
      // If valid, set as active theme
      this.activeTheme = config;
      this.availableThemes.set(config.name, config);
    } catch (error) {
      // Create structured error
      const systemError = ErrorHandler.handle(error, 'ThemeEngine', { 
        themeName: config.name,
        operation: 'loadTheme' 
      });
      
      // Log the error
      console.error('Theme validation failed, falling back to default theme:', systemError.message);
      
      // Fall back to default theme
      this.activeTheme = this.defaultTheme;
      
      // Re-throw if it's a validation error so caller knows
      if (error instanceof ThemeValidationError) {
        throw error;
      }
    }
  }

  /**
   * Safely load a theme by name with fallback
   */
  loadThemeByName(themeName: string): void {
    const theme = this.availableThemes.get(themeName);
    
    if (!theme) {
      const systemError = ErrorHandler.createError(
        'THEME_NOT_FOUND',
        `Theme "${themeName}" not found, using default theme`,
        'ThemeEngine',
        { themeName, availableThemes: this.listAvailableThemes() }
      );
      console.warn(systemError.message);
      this.activeTheme = this.defaultTheme;
      return;
    }

    try {
      this.loadTheme(theme);
    } catch (error) {
      const systemError = ErrorHandler.handle(error, 'ThemeEngine', { 
        themeName,
        operation: 'loadThemeByName' 
      });
      console.error(`Failed to load theme "${themeName}", using default theme:`, systemError.message);
      this.activeTheme = this.defaultTheme;
    }
  }

  /**
   * Get the currently active theme
   */
  getActiveTheme(): ThemeConfig {
    return this.activeTheme;
  }

  /**
   * List all available theme names
   */
  listAvailableThemes(): string[] {
    return Array.from(this.availableThemes.keys());
  }

  /**
   * Apply theme transformation to text based on change type with fallback
   */
  applyTheme(text: string, changeType: string): string {
    try {
      // Find patterns for the change type
      const pattern = this.activeTheme.patterns.find(p => p.type === changeType);
      
      if (!pattern || pattern.templates.length === 0) {
        return text;
      }

      // Select a random template
      const template = pattern.templates[Math.floor(Math.random() * pattern.templates.length)];
      
      // Extract feature/component name from commit message
      const extracted = this.extractFeatureName(text);
      
      // Apply vocabulary substitution
      let result = this.applyVocabularySubstitution(template);
      
      // Replace placeholders with extracted content
      result = result.replace('{feature}', extracted);
      result = result.replace('{component}', extracted);
      result = result.replace('{bug}', this.extractBugName(text));
      
      return result;
    } catch (error) {
      // If theme application fails, fall back to original text
      const systemError = ErrorHandler.handle(error, 'ThemeEngine', { 
        text,
        changeType,
        themeName: this.activeTheme.name,
        operation: 'applyTheme' 
      });
      console.error('Theme application failed, returning original text:', systemError.message);
      return text;
    }
  }

  /**
   * Extract feature name from commit message
   */
  private extractFeatureName(message: string): string {
    // Remove common prefixes
    let cleaned = message.replace(/^(feat|feature|add|added|implement|implemented):\s*/i, '');
    cleaned = cleaned.replace(/^(fix|fixed|bug|bugfix):\s*/i, '');
    cleaned = cleaned.replace(/^(update|updated|modify|modified|change|changed):\s*/i, '');
    cleaned = cleaned.replace(/^(remove|removed|delete|deleted):\s*/i, '');
    cleaned = cleaned.replace(/^(break|breaking):\s*/i, '');
    
    // Take first meaningful part
    const parts = cleaned.split(/[,;.]/);
    return parts[0].trim() || message;
  }

  /**
   * Extract bug name from commit message
   */
  private extractBugName(message: string): string {
    // Look for bug-related keywords
    const bugMatch = message.match(/bug|issue|error|problem|crash|fail/i);
    if (bugMatch) {
      return bugMatch[0].toLowerCase();
    }
    return 'bug';
  }

  /**
   * Apply vocabulary substitution to text
   * Replaces generic words with themed vocabulary
   */
  private applyVocabularySubstitution(text: string): string {
    let result = text;
    
    // Replace generic verbs with themed verbs
    const genericVerbs = ['added', 'removed', 'changed', 'fixed', 'updated', 'created', 'deleted'];
    for (const verb of genericVerbs) {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      if (regex.test(result) && this.activeTheme.vocabulary.verbs.length > 0) {
        const themedVerb = this.activeTheme.vocabulary.verbs[
          Math.floor(Math.random() * this.activeTheme.vocabulary.verbs.length)
        ];
        result = result.replace(regex, themedVerb);
      }
    }
    
    return result;
  }

  /**
   * Detect change type from commit message keywords
   */
  detectChangeType(message: string): 'addition' | 'removal' | 'modification' | 'fix' | 'breaking' {
    const lowerMessage = message.toLowerCase();
    
    // Check for breaking changes
    if (lowerMessage.includes('breaking') || lowerMessage.includes('break:')) {
      return 'breaking';
    }
    
    // Check for fixes
    if (lowerMessage.match(/\b(fix|fixed|bug|bugfix|patch|resolve|resolved)\b/)) {
      return 'fix';
    }
    
    // Check for removals
    if (lowerMessage.match(/\b(remove|removed|delete|deleted|drop|dropped)\b/)) {
      return 'removal';
    }
    
    // Check for additions
    if (lowerMessage.match(/\b(add|added|feat|feature|new|create|created|implement|implemented)\b/)) {
      return 'addition';
    }
    
    // Default to modification
    return 'modification';
  }
}

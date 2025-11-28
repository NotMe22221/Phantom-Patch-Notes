/**
 * Patch Note Generator module
 * Transforms commit data into themed patch notes
 */

import type { CommitData, PatchNote, PatchNoteSection, PatchNoteEntry, GeneratorOptions } from '../../shared/types.js';
import { ThemeEngine } from './theme-engine.js';

/**
 * Commit type for grouping
 */
export type CommitType = 'features' | 'fixes' | 'breaking' | 'other';

/**
 * PatchNoteGenerator class for transforming commits into themed patch notes
 */
export class PatchNoteGenerator {
  private themeEngine: ThemeEngine;

  constructor(themeEngine?: ThemeEngine) {
    this.themeEngine = themeEngine || new ThemeEngine();
  }

  /**
   * Groups commits by type based on keyword detection
   * @param commits - Array of commits to group
   * @returns Map of commit type to array of commits
   */
  groupCommits(commits: CommitData[]): Map<CommitType, CommitData[]> {
    const groups = new Map<CommitType, CommitData[]>();
    
    // Initialize all groups
    groups.set('features', []);
    groups.set('fixes', []);
    groups.set('breaking', []);
    groups.set('other', []);

    for (const commit of commits) {
      const type = this.detectCommitType(commit.message);
      groups.get(type)!.push(commit);
    }

    return groups;
  }

  /**
   * Detects commit type from message using keyword matching
   * @param message - Commit message
   * @returns Commit type
   */
  private detectCommitType(message: string): CommitType {
    const lowerMessage = message.toLowerCase();

    // Check for breaking changes (highest priority)
    if (lowerMessage.includes('breaking') || lowerMessage.includes('break:') || lowerMessage.match(/^breaking[\s:]/)) {
      return 'breaking';
    }

    // Check for fixes
    if (lowerMessage.match(/\b(fix|fixed|bug|bugfix|patch|resolve|resolved|hotfix)\b/)) {
      return 'fixes';
    }

    // Check for features/additions
    if (lowerMessage.match(/\b(feat|feature|add|added|new|create|created|implement|implemented)\b/)) {
      return 'features';
    }

    // Default to other
    return 'other';
  }

  /**
   * Generates a section title using theme vocabulary
   * @param type - Section type
   * @returns Themed section title
   */
  private generateSectionTitle(type: CommitType): string {
    const theme = this.themeEngine.getActiveTheme();
    const vocab = theme.vocabulary;

    // Select random vocabulary words for variety
    const adjective = vocab.adjectives[Math.floor(Math.random() * vocab.adjectives.length)];
    const noun = vocab.nouns[Math.floor(Math.random() * vocab.nouns.length)];

    switch (type) {
      case 'features':
        return `${adjective.charAt(0).toUpperCase() + adjective.slice(1)} Summonings`;
      case 'fixes':
        return `Banished ${noun.charAt(0).toUpperCase() + noun.slice(1)}s`;
      case 'breaking':
        return `Cataclysmic Rituals`;
      case 'other':
        return `${adjective.charAt(0).toUpperCase() + adjective.slice(1)} Transformations`;
    }
  }

  /**
   * Generates patch notes from commits
   * @param options - Generator options
   * @returns Promise resolving to complete patch note
   */
  async generate(options: GeneratorOptions): Promise<PatchNote> {
    const { commits, version, themeName } = options;

    // Load theme if specified
    if (themeName) {
      this.themeEngine.loadThemeByName(themeName);
    }

    // Group commits by type
    const groupedCommits = this.groupCommits(commits);

    // Create sections
    const sections: PatchNoteSection[] = [];

    for (const [type, typeCommits] of groupedCommits.entries()) {
      if (typeCommits.length === 0) {
        continue; // Skip empty sections
      }

      const entries: PatchNoteEntry[] = typeCommits.map(commit => {
        // Detect change type for theme application
        const changeType = this.themeEngine.detectChangeType(commit.message);
        
        // Apply theme transformation
        const themed = this.themeEngine.applyTheme(commit.message, changeType);

        return {
          themed,
          original: commit.message,
          commitHash: commit.hash
        };
      });

      sections.push({
        title: this.generateSectionTitle(type),
        type,
        entries
      });
    }

    // Generate version number if not provided
    const patchVersion = version || this.generateVersion(commits);

    // Create patch note
    const patchNote: PatchNote = {
      version: patchVersion,
      date: new Date(),
      sections,
      originalCommits: commits
    };

    return patchNote;
  }

  /**
   * Generates a version number based on commits
   * @param commits - Array of commits
   * @returns Version string
   */
  private generateVersion(commits: CommitData[]): string {
    // Simple version generation based on date
    const now = new Date();
    return `v${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
  }
}

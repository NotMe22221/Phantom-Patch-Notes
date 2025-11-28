/**
 * Preview Mode module
 * Manages switching between synthetic and real repository data
 */

import type { CommitData, ParseOptions } from '../../shared/types.js';
import { generateSampleCommits, isSyntheticData } from '../../preview/sample-commits.js';
import { CommitParser } from './commit-parser.js';

/**
 * Preview mode state
 */
export interface PreviewModeState {
  enabled: boolean;
  lastDataSource: 'synthetic' | 'real' | null;
}

/**
 * PreviewMode class for managing data source switching
 */
export class PreviewMode {
  private state: PreviewModeState;
  private commitParser: CommitParser;

  constructor() {
    this.state = {
      enabled: false,
      lastDataSource: null
    };
    this.commitParser = new CommitParser();
  }

  /**
   * Enable preview mode (use synthetic data)
   */
  enable(): void {
    this.state.enabled = true;
  }

  /**
   * Disable preview mode (use real repository data)
   */
  disable(): void {
    this.state.enabled = false;
  }

  /**
   * Toggle preview mode on/off
   * @returns New state of preview mode
   */
  toggle(): boolean {
    this.state.enabled = !this.state.enabled;
    return this.state.enabled;
  }

  /**
   * Check if preview mode is enabled
   * @returns True if preview mode is enabled
   */
  isEnabled(): boolean {
    return this.state.enabled;
  }

  /**
   * Get current state
   * @returns Current preview mode state
   */
  getState(): PreviewModeState {
    return { ...this.state };
  }

  /**
   * Get commits based on current mode
   * If preview mode is enabled, returns synthetic data
   * If preview mode is disabled, parses real repository
   * @param options - Parse options (only used when preview mode is disabled)
   * @returns Promise resolving to commit data
   */
  async getCommits(options?: ParseOptions): Promise<CommitData[]> {
    if (this.state.enabled) {
      // Preview mode: return synthetic data
      this.state.lastDataSource = 'synthetic';
      return generateSampleCommits();
    } else {
      // Real mode: parse repository
      if (!options) {
        throw new Error('ParseOptions required when preview mode is disabled');
      }
      this.state.lastDataSource = 'real';
      return await this.commitParser.parseRepository(options);
    }
  }

  /**
   * Verify that commits match the current mode
   * @param commits - Commits to verify
   * @returns True if commits match the expected data source
   */
  verifyDataSource(commits: CommitData[]): boolean {
    const isSynthetic = isSyntheticData(commits);
    
    if (this.state.enabled) {
      // Preview mode should have synthetic data
      return isSynthetic;
    } else {
      // Real mode should have real data
      return !isSynthetic;
    }
  }
}

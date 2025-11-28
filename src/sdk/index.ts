/**
 * Plugin API / SDK entry point
 * Enables CI/CD integration and programmatic access
 */

import type { PluginConfig, PluginResult } from '../shared/types.js';
import { CommitParser } from '../server/core/commit-parser.js';
import { PatchNoteGenerator } from '../server/core/generator.js';
import { ExportSystem } from '../server/core/export.js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { mkdirSync } from 'fs';

export interface PluginAPI {
  generate(config: PluginConfig): Promise<PluginResult>;
  validateConfig(config: PluginConfig): boolean;
}

/**
 * Implementation of the Plugin API
 */
class PluginAPIImpl implements PluginAPI {
  private commitParser: CommitParser;
  private generator: PatchNoteGenerator;
  private exportSystem: ExportSystem;

  constructor() {
    this.commitParser = new CommitParser();
    this.generator = new PatchNoteGenerator();
    this.exportSystem = new ExportSystem();
  }

  /**
   * Merges configuration with environment variables
   * Environment variables take precedence over config values
   * @param config - Base configuration
   * @returns Merged configuration with environment variables
   */
  private mergeWithEnv(config: PluginConfig): PluginConfig {
    const env = config.env || process.env;

    return {
      repoPath: env.REPO_PATH || config.repoPath,
      outputPath: env.OUTPUT_PATH || config.outputPath,
      format: (env.OUTPUT_FORMAT as any) || config.format,
      version: env.VERSION || config.version,
      theme: env.THEME || config.theme,
      env: config.env
    };
  }

  /**
   * Validates plugin configuration
   * @param config - Plugin configuration to validate
   * @returns true if configuration is valid, false otherwise
   */
  validateConfig(config: PluginConfig): boolean {
    // Check required fields
    if (!config.repoPath || typeof config.repoPath !== 'string') {
      return false;
    }

    if (!config.outputPath || typeof config.outputPath !== 'string') {
      return false;
    }

    if (!config.format || !['markdown', 'html', 'json'].includes(config.format)) {
      return false;
    }

    // Optional fields validation
    if (config.version !== undefined && typeof config.version !== 'string') {
      return false;
    }

    if (config.theme !== undefined && typeof config.theme !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * Generates patch notes and exports them
   * @param config - Plugin configuration
   * @returns Promise resolving to plugin result
   */
  async generate(config: PluginConfig): Promise<PluginResult> {
    try {
      // Merge configuration with environment variables
      const mergedConfig = this.mergeWithEnv(config);

      // Validate configuration
      if (!this.validateConfig(mergedConfig)) {
        return {
          success: false,
          error: {
            code: 'INVALID_CONFIG',
            message: 'Invalid plugin configuration. Required fields: repoPath, outputPath, format',
            details: { config: mergedConfig }
          }
        };
      }

      // Parse commits from repository
      const commits = await this.commitParser.parseRepository({
        repoPath: mergedConfig.repoPath
      });

      if (commits.length === 0) {
        return {
          success: false,
          error: {
            code: 'NO_COMMITS',
            message: 'No commits found in repository',
            details: { repoPath: mergedConfig.repoPath }
          }
        };
      }

      // Generate patch notes
      const patchNote = await this.generator.generate({
        commits,
        version: mergedConfig.version,
        themeName: mergedConfig.theme
      });

      // Export patch notes
      const exportResult = this.exportSystem.export(patchNote, {
        format: mergedConfig.format,
        includeStyles: true,
        pretty: true
      });

      // Resolve output path
      const outputPath = resolve(mergedConfig.outputPath);

      // Ensure output directory exists
      const outputDir = dirname(outputPath);
      try {
        mkdirSync(outputDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, ignore error
      }

      // Write to file
      writeFileSync(outputPath, exportResult.content, 'utf-8');

      return {
        success: true,
        outputPath
      };

    } catch (error: any) {
      // Handle errors from various components
      if (error.component) {
        // SystemError from our components
        return {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details
          }
        };
      }

      // Generic error
      return {
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: error.message || 'Failed to generate patch notes',
          details: { error: error.toString() }
        }
      };
    }
  }
}

// Create and export singleton instance
const pluginAPI = new PluginAPIImpl();

export { pluginAPI };

// Re-export all types for SDK consumers
export * from './types.js';

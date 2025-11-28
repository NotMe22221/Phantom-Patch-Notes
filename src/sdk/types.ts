/**
 * Public TypeScript type definitions for Phantom Patch Notes SDK
 * 
 * This file exports all types that SDK consumers need to use the Plugin API.
 * Import these types in your CI/CD scripts or automation tools.
 * 
 * @example
 * ```typescript
 * import { pluginAPI, PluginConfig, PluginResult } from 'phantom-patch-notes';
 * 
 * const config: PluginConfig = {
 *   repoPath: './my-repo',
 *   outputPath: './CHANGELOG.md',
 *   format: 'markdown',
 *   version: 'v1.0.0',
 *   theme: 'haunted'
 * };
 * 
 * const result: PluginResult = await pluginAPI.generate(config);
 * if (result.success) {
 *   console.log('Patch notes generated at:', result.outputPath);
 * } else {
 *   console.error('Error:', result.error?.message);
 * }
 * ```
 */

// ============================================================================
// Re-export all shared types
// ============================================================================

export type {
  // Commit Data Types
  CommitData,
  ParseOptions,
  
  // Theme Types
  ThemeVocabulary,
  NarrativePattern,
  ThemeConfig,
  
  // Patch Note Types
  PatchNoteEntry,
  PatchNoteSection,
  PatchNote,
  GeneratorOptions,
  
  // Export Types
  ExportFormat,
  ExportOptions,
  ExportResult,
  
  // Timeline Types (for frontend integration)
  TimelineEntry,
  TimelineState,
  
  // Plugin API Types (PRIMARY SDK TYPES)
  PluginConfig,
  PluginResult,
  
  // Error Types
  SystemError,
  
  // API Types (for advanced usage)
  ParseRequest,
  GenerateRequest,
  ExportRequest,
  ThemesResponse,
  PreviewResponse
} from '../shared/types.js';

// ============================================================================
// SDK-specific type aliases and utilities
// ============================================================================

/**
 * Supported output formats for patch notes
 */
export type OutputFormat = 'markdown' | 'html' | 'json';

/**
 * Environment variable names used by the SDK
 */
export interface SDKEnvironmentVariables {
  /** Path to the git repository */
  REPO_PATH?: string;
  
  /** Path where the output file should be written */
  OUTPUT_PATH?: string;
  
  /** Output format (markdown, html, or json) */
  OUTPUT_FORMAT?: OutputFormat;
  
  /** Version string for the patch notes */
  VERSION?: string;
  
  /** Theme name to use for generation */
  THEME?: string;
}

/**
 * Minimal configuration required to generate patch notes
 */
export interface MinimalPluginConfig {
  /** Path to the git repository */
  repoPath: string;
  
  /** Path where the output file should be written */
  outputPath: string;
  
  /** Output format */
  format: OutputFormat;
}

/**
 * Full configuration with all optional parameters
 */
export interface FullPluginConfig extends MinimalPluginConfig {
  /** Version string for the patch notes */
  version?: string;
  
  /** Theme name to use for generation */
  theme?: string;
  
  /** Environment variables to use (overrides process.env) */
  env?: Record<string, string>;
}

/**
 * Success result from plugin API
 */
export interface PluginSuccessResult {
  success: true;
  outputPath: string;
}

/**
 * Error result from plugin API
 */
export interface PluginErrorResult {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Type guard to check if result is successful
 */
export function isSuccessResult(result: PluginSuccessResult | PluginErrorResult): result is PluginSuccessResult {
  return result.success === true;
}

/**
 * Type guard to check if result is an error
 */
export function isErrorResult(result: PluginSuccessResult | PluginErrorResult): result is PluginErrorResult {
  return result.success === false;
}

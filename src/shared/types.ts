/**
 * Core type definitions for Phantom Patch Notes
 * Shared across server, client, SDK, and other modules
 */

// ============================================================================
// Commit Data Types
// ============================================================================

/**
 * Structured representation of a git commit
 */
export interface CommitData {
  hash: string;
  author: string;
  email: string;
  timestamp: Date;
  message: string;
  changedFiles: string[];
}

/**
 * Options for parsing commits from a repository
 */
export interface ParseOptions {
  repoPath: string;
  dateRange?: { from: Date; to: Date };
  tags?: string[];
  maxCount?: number;
}

// ============================================================================
// Theme Types
// ============================================================================

/**
 * Horror-themed vocabulary for patch note generation
 */
export interface ThemeVocabulary {
  verbs: string[];        // e.g., "summoned", "banished", "cursed"
  adjectives: string[];   // e.g., "haunted", "spectral", "eldritch"
  nouns: string[];        // e.g., "phantom", "specter", "wraith"
}

/**
 * Narrative pattern for different types of changes
 */
export interface NarrativePattern {
  type: 'addition' | 'removal' | 'modification' | 'fix' | 'breaking';
  templates: string[];    // e.g., "Summoned {feature} from the void"
}

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  name: string;
  vocabulary: ThemeVocabulary;
  patterns: NarrativePattern[];
  cssStyles?: string;
}

// ============================================================================
// Patch Note Types
// ============================================================================

/**
 * Individual entry in a patch note section
 */
export interface PatchNoteEntry {
  themed: string;         // Horror-themed description
  original: string;       // Original commit message
  commitHash: string;
}

/**
 * Section grouping related changes
 */
export interface PatchNoteSection {
  title: string;          // e.g., "Spectral Summonings", "Banished Bugs"
  type: 'features' | 'fixes' | 'breaking' | 'other';
  entries: PatchNoteEntry[];
}

/**
 * Complete patch note for a release
 */
export interface PatchNote {
  version: string;
  date: Date;
  sections: PatchNoteSection[];
  originalCommits: CommitData[];
}

/**
 * Options for generating patch notes
 */
export interface GeneratorOptions {
  commits: CommitData[];
  version?: string;
  themeName?: string;
}

// ============================================================================
// Export Types
// ============================================================================

/**
 * Supported export formats
 */
export type ExportFormat = 'markdown' | 'html' | 'json';

/**
 * Options for exporting patch notes
 */
export interface ExportOptions {
  format: ExportFormat;
  includeStyles?: boolean;  // For HTML export
  pretty?: boolean;         // For JSON export
}

/**
 * Result of an export operation
 */
export interface ExportResult {
  content: string;
  mimeType: string;
  filename: string;
}

// ============================================================================
// Timeline Types (Frontend)
// ============================================================================

/**
 * Entry in the release timeline
 */
export interface TimelineEntry {
  version: string;
  date: Date;
  summary: string;
  patchNote: PatchNote;
}

/**
 * State of the timeline component
 */
export interface TimelineState {
  entries: TimelineEntry[];
  selectedEntry: TimelineEntry | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Plugin API Types
// ============================================================================

/**
 * Configuration for the plugin API
 */
export interface PluginConfig {
  repoPath: string;
  outputPath: string;
  format: ExportFormat;
  version?: string;
  theme?: string;
  env?: Record<string, string>;
}

/**
 * Result of a plugin API operation
 */
export interface PluginResult {
  success: boolean;
  outputPath?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Structured error information
 */
export interface SystemError {
  code: string;
  message: string;
  component: string;
  details?: any;
  timestamp: Date;
}

// ============================================================================
// API Types (Backend)
// ============================================================================

/**
 * Request body for parsing commits
 */
export interface ParseRequest {
  repoPath: string;
  dateRange?: { from: string; to: string };
  tags?: string[];
  maxCount?: number;
}

/**
 * Request body for generating patch notes
 */
export interface GenerateRequest {
  commits: CommitData[];
  version?: string;
  themeName?: string;
}

/**
 * Request body for exporting patch notes
 */
export interface ExportRequest {
  patchNote: PatchNote;
  format: ExportFormat;
  includeStyles?: boolean;
  pretty?: boolean;
}

/**
 * Response for listing available themes
 */
export interface ThemesResponse {
  themes: string[];
}

/**
 * Response for preview mode
 */
export interface PreviewResponse {
  commits: CommitData[];
  synthetic: boolean;
}

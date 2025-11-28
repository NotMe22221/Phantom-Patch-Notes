# Design Document: Phantom Patch Notes

## Overview

Phantom Patch Notes is a TypeScript-based application that transforms git commit history into atmospheric, horror-themed patch notes. The system consists of a backend API for commit parsing and note generation, a frontend UI for browsing and exporting notes, and a plugin SDK for CI/CD integration.

The architecture follows a modular design with clear separation between:
- Data extraction (Commit Parser)
- Content transformation (Patch Note Generator + Theme Engine)
- Presentation (Export System + Frontend UI)
- Integration (Plugin API)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend App                          │
│  (Vite + TypeScript + HTML/CSS)                             │
│  - Repository selection UI                                   │
│  - Release Timeline view                                     │
│  - Export controls                                           │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────────────────┐
│                      Backend API                             │
│  (Express + TypeScript)                                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Commit     │  │  Patch Note  │  │    Export    │     │
│  │   Parser     │─▶│  Generator   │─▶│    System    │     │
│  └──────────────┘  └──────┬───────┘  └──────────────┘     │
│                            │                                 │
│                     ┌──────▼───────┐                        │
│                     │    Theme     │                        │
│                     │    Engine    │                        │
│                     └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      Plugin API / SDK                        │
│  (Exported TypeScript module)                               │
│  - CI/CD integration interface                              │
│  - Programmatic access to generation                        │
└─────────────────────────────────────────────────────────────┘
```

### Module Dependencies

```
Frontend ──▶ Backend API
Backend API ──▶ Commit Parser ──▶ simple-git
Backend API ──▶ Patch Note Generator ──▶ Theme Engine
Backend API ──▶ Export System ──▶ marked (for HTML)
Plugin SDK ──▶ Backend API (or direct module access)
```

## Components and Interfaces

### 1. Commit Parser

**Purpose:** Extract and structure git commit data from repositories.

**Interface:**

```typescript
interface CommitData {
  hash: string;
  author: string;
  email: string;
  timestamp: Date;
  message: string;
  changedFiles: string[];
}

interface ParseOptions {
  repoPath: string;
  dateRange?: { from: Date; to: Date };
  tags?: string[];
  maxCount?: number;
}

interface CommitParser {
  parseRepository(options: ParseOptions): Promise<CommitData[]>;
  validateRepository(repoPath: string): Promise<boolean>;
}
```

**Implementation Notes:**
- Uses `simple-git` library for git operations
- Validates repository path before parsing
- Supports filtering by date range and tags
- Returns structured commit data array

### 2. Theme Engine

**Purpose:** Define and apply horror-themed styling and narrative patterns.

**Interface:**

```typescript
interface ThemeVocabulary {
  verbs: string[];        // e.g., "summoned", "banished", "cursed"
  adjectives: string[];   // e.g., "haunted", "spectral", "eldritch"
  nouns: string[];        // e.g., "phantom", "specter", "wraith"
}

interface NarrativePattern {
  type: 'addition' | 'removal' | 'modification' | 'fix' | 'breaking';
  templates: string[];    // e.g., "Summoned {feature} from the void"
}

interface ThemeConfig {
  name: string;
  vocabulary: ThemeVocabulary;
  patterns: NarrativePattern[];
  cssStyles?: string;
}

interface ThemeEngine {
  loadTheme(config: ThemeConfig): void;
  getActiveTheme(): ThemeConfig;
  applyTheme(text: string, changeType: string): string;
  listAvailableThemes(): string[];
}
```

**Implementation Notes:**
- Themes stored as JSON configuration files
- Default "haunted" theme included
- Expandable through theme file addition
- Pattern matching based on commit message keywords

### 3. Patch Note Generator

**Purpose:** Transform commit data into themed patch notes.

**Interface:**

```typescript
interface PatchNote {
  version: string;
  date: Date;
  sections: PatchNoteSection[];
  originalCommits: CommitData[];
}

interface PatchNoteSection {
  title: string;          // e.g., "Spectral Summonings", "Banished Bugs"
  type: 'features' | 'fixes' | 'breaking' | 'other';
  entries: PatchNoteEntry[];
}

interface PatchNoteEntry {
  themed: string;         // Horror-themed description
  original: string;       // Original commit message
  commitHash: string;
}

interface GeneratorOptions {
  commits: CommitData[];
  version?: string;
  themeName?: string;
}

interface PatchNoteGenerator {
  generate(options: GeneratorOptions): Promise<PatchNote>;
  groupCommits(commits: CommitData[]): Map<string, CommitData[]>;
}
```

**Implementation Notes:**
- Groups commits by type (feature, fix, breaking, etc.)
- Uses Theme Engine for text transformation
- Preserves original commit messages alongside themed versions
- Generates section titles using theme vocabulary

### 4. Export System

**Purpose:** Output patch notes in multiple formats.

**Interface:**

```typescript
interface ExportOptions {
  format: 'markdown' | 'html' | 'json';
  includeStyles?: boolean;  // For HTML export
  pretty?: boolean;         // For JSON export
}

interface ExportResult {
  content: string;
  mimeType: string;
  filename: string;
}

interface ExportSystem {
  exportMarkdown(patchNote: PatchNote): ExportResult;
  exportHTML(patchNote: PatchNote, includeStyles: boolean): ExportResult;
  exportJSON(patchNote: PatchNote, pretty: boolean): ExportResult;
  export(patchNote: PatchNote, options: ExportOptions): ExportResult;
}
```

**Implementation Notes:**
- Markdown: Clean, readable format with themed headers
- HTML: Includes embedded CSS for horror styling
- JSON: Preserves full structure and metadata
- Uses `marked` library for Markdown to HTML conversion

### 5. Release Timeline (Frontend Component)

**Purpose:** Display chronological release history with horror-themed UI.

**Interface:**

```typescript
interface TimelineEntry {
  version: string;
  date: Date;
  summary: string;
  patchNote: PatchNote;
}

interface TimelineState {
  entries: TimelineEntry[];
  selectedEntry: TimelineEntry | null;
  loading: boolean;
  error: string | null;
}

// Component methods
interface ReleaseTimeline {
  loadReleases(): Promise<void>;
  selectRelease(version: string): void;
  exportCurrent(format: ExportOptions): void;
}
```

**Implementation Notes:**
- Vanilla TypeScript with DOM manipulation
- CSS-based horror theme (dark colors, gothic fonts, animations)
- Responsive design for different screen sizes
- Smooth transitions between releases

### 6. Plugin API / SDK

**Purpose:** Enable CI/CD integration and programmatic access.

**Interface:**

```typescript
interface PluginConfig {
  repoPath: string;
  outputPath: string;
  format: 'markdown' | 'html' | 'json';
  version?: string;
  theme?: string;
  env?: Record<string, string>;
}

interface PluginResult {
  success: boolean;
  outputPath?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface PluginAPI {
  generate(config: PluginConfig): Promise<PluginResult>;
  validateConfig(config: PluginConfig): boolean;
}
```

**Implementation Notes:**
- Exported as npm package
- Supports environment variable configuration
- Returns structured results for CI/CD parsing
- Includes TypeScript type definitions

## Data Models

### Core Data Structures

```typescript
// Commit representation
interface CommitData {
  hash: string;
  author: string;
  email: string;
  timestamp: Date;
  message: string;
  changedFiles: string[];
}

// Patch note structure
interface PatchNote {
  version: string;
  date: Date;
  sections: PatchNoteSection[];
  originalCommits: CommitData[];
}

interface PatchNoteSection {
  title: string;
  type: 'features' | 'fixes' | 'breaking' | 'other';
  entries: PatchNoteEntry[];
}

interface PatchNoteEntry {
  themed: string;
  original: string;
  commitHash: string;
}

// Theme configuration
interface ThemeConfig {
  name: string;
  vocabulary: ThemeVocabulary;
  patterns: NarrativePattern[];
  cssStyles?: string;
}
```

### Data Flow

```
Git Repository
    ↓ (Commit Parser)
CommitData[]
    ↓ (Patch Note Generator + Theme Engine)
PatchNote
    ↓ (Export System)
Markdown | HTML | JSON
    ↓ (Frontend / Plugin)
User Output
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Complete commit extraction
*For any* valid git repository, parsing should extract all commits with complete metadata including hash, author, email, timestamp, message, and changed files in a standardized format.
**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Invalid repository error handling
*For any* invalid repository path, the Commit Parser should signal an error with a descriptive message rather than failing silently.
**Validates: Requirements 1.4**

### Property 3: Commit filtering correctness
*For any* repository and date range or tag filter, all returned commits should fall within the specified filter criteria.
**Validates: Requirements 1.5**

### Property 4: Theme transformation preserves original
*For any* commit data, the generated patch note should include both the original commit message and the themed version.
**Validates: Requirements 2.2, 2.5**

### Property 5: Commit grouping by type
*For any* set of commits, the generator should group them into sections by type (features, fixes, breaking, other) such that all commits in a section share the same type.
**Validates: Requirements 2.3**

### Property 6: Theme consistency
*For any* set of texts transformed using the same theme, the vocabulary and patterns used should be consistent and drawn from the theme's configuration.
**Validates: Requirements 2.4, 7.3**

### Property 7: Markdown export validity
*For any* patch note, exporting to Markdown should produce valid Markdown that can be parsed without errors.
**Validates: Requirements 3.1**

### Property 8: HTML export validity with CSS
*For any* patch note, exporting to HTML should produce valid HTML that includes embedded CSS styling.
**Validates: Requirements 3.2, 3.4**

### Property 9: JSON round-trip preservation
*For any* patch note, serializing to JSON and then deserializing should produce an equivalent patch note with all metadata and structure preserved.
**Validates: Requirements 3.3, 3.5**

### Property 10: Timeline chronological ordering
*For any* set of releases, the timeline should display them in chronological order by date.
**Validates: Requirements 4.1**

### Property 11: Release display completeness
*For any* release in the timeline, the display should include the release date, version, and themed summary.
**Validates: Requirements 4.2**

### Property 12: Release selection updates display
*For any* release, selecting it should update the display to show the full patch notes for that specific release.
**Validates: Requirements 4.3**

### Property 13: Timeline navigation functionality
*For any* timeline with multiple releases, navigation methods should allow moving between adjacent releases.
**Validates: Requirements 4.5**

### Property 14: Plugin API accepts required configuration
*For any* valid configuration with repository path and output format, the Plugin API should accept and process it.
**Validates: Requirements 5.1**

### Property 15: Plugin API returns results
*For any* successful API execution, the result should include a success status and output location.
**Validates: Requirements 5.2, 5.4**

### Property 16: Plugin API structured error handling
*For any* error during API execution, the error should include a code, message, and optional details.
**Validates: Requirements 5.3**

### Property 17: Plugin API environment variable support
*For any* configuration parameter, the Plugin API should support reading it from environment variables.
**Validates: Requirements 5.5**

### Property 18: Preview mode generates synthetic data
*For any* preview mode activation, the system should generate synthetic commit data with all required fields.
**Validates: Requirements 6.1, 6.2**

### Property 19: Preview mode demonstrates theme capabilities
*For any* preview mode execution, the generated notes should exercise different theme patterns (additions, removals, modifications, fixes).
**Validates: Requirements 6.3**

### Property 20: Preview mode data marking
*For any* preview mode output, the data should be clearly marked as synthetic.
**Validates: Requirements 6.4**

### Property 21: Preview mode toggle switches data source
*For any* system state, toggling preview mode should switch between synthetic and real repository data sources.
**Validates: Requirements 6.5**

### Property 22: Theme loading supports multiple configurations
*For any* set of valid theme files, the Theme Engine should load and make available all themes.
**Validates: Requirements 7.1**

### Property 23: Theme structure validation
*For any* theme configuration, it should specify vocabulary, narrative patterns, and styling rules to be considered valid.
**Validates: Requirements 7.2**

### Property 24: Theme extensibility without code changes
*For any* new theme file added to the themes directory, the Theme Engine should load and apply it without requiring code modifications.
**Validates: Requirements 7.4**

### Property 25: Theme validation rejects invalid configurations
*For any* theme configuration missing required fields, the Theme Engine should reject it with a validation error.
**Validates: Requirements 7.5**

### Property 26: Frontend triggers backend operations
*For any* repository selection, the Frontend should trigger commit parsing and note generation via API calls.
**Validates: Requirements 8.2**

### Property 27: Frontend displays generated notes
*For any* successfully generated patch notes, the Frontend should display them in the Release Timeline.
**Validates: Requirements 8.3**

### Property 28: Frontend export functionality
*For any* export request with a format selection, the Frontend should trigger the appropriate export and provide download functionality.
**Validates: Requirements 8.4**

### Property 29: Frontend error display
*For any* error from backend operations, the Frontend should display a user-friendly error message.
**Validates: Requirements 8.5**

### Property 30: Module pipeline compatibility
*For any* data flowing through the system, the output of the Commit Parser should be valid input for the Patch Note Generator, and the output of the Patch Note Generator should be valid input for the Export System.
**Validates: Requirements 9.2, 9.3**

### Property 31: Error context capture
*For any* error in any component, the error should include the component name, error type, and contextual information.
**Validates: Requirements 10.1, 10.2**

### Property 32: Git error specificity
*For any* git operation failure, the error should include specific git error information.
**Validates: Requirements 10.3**

### Property 33: Theme fallback on failure
*For any* theme application failure, the Theme Engine should fall back to the default theme rather than failing completely.
**Validates: Requirements 10.4**

### Property 34: Error resilience maintains state
*For any* critical error, the system should maintain consistent state and prevent data corruption.
**Validates: Requirements 10.5**

## Error Handling

### Error Categories

1. **Repository Errors**
   - Invalid repository path
   - Git operation failures
   - Permission issues
   - Missing commits or tags

2. **Theme Errors**
   - Invalid theme configuration
   - Missing theme files
   - Theme application failures

3. **Export Errors**
   - Invalid output path
   - File write failures
   - Format conversion errors

4. **API Errors**
   - Invalid configuration
   - Missing required parameters
   - Network failures (for remote repos)

### Error Handling Strategy

```typescript
interface SystemError {
  code: string;
  message: string;
  component: string;
  details?: any;
  timestamp: Date;
}

class ErrorHandler {
  static handle(error: Error, component: string): SystemError {
    return {
      code: this.getErrorCode(error),
      message: this.getUserFriendlyMessage(error),
      component,
      details: error,
      timestamp: new Date()
    };
  }
  
  static getErrorCode(error: Error): string {
    // Map error types to codes
  }
  
  static getUserFriendlyMessage(error: Error): string {
    // Convert technical errors to user-friendly messages
  }
}
```

### Fallback Behaviors

- **Theme failures**: Fall back to default "haunted" theme
- **Export failures**: Retry with simplified format
- **Parse failures**: Skip problematic commits, log warnings
- **API failures**: Return structured error response

## Testing Strategy

### Unit Testing

The system will use **Vitest** as the testing framework (already configured in package.json).

Unit tests will cover:
- Individual module functions (parsing, theming, exporting)
- Error handling paths
- Edge cases (empty repositories, malformed themes, etc.)
- Integration points between modules

Example unit tests:
- Commit Parser: Test parsing a repository with known commits
- Theme Engine: Test applying a theme to a specific commit message
- Export System: Test exporting a known patch note to each format
- Plugin API: Test API calls with various configurations

### Property-Based Testing

The system will use **fast-check** library for property-based testing in TypeScript.

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Each property-based test MUST be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: phantom-patch-notes, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test

Property-based tests will verify:
- Universal properties that hold across all inputs
- Round-trip properties (JSON serialization, theme application)
- Invariants (commit count preservation, data structure validity)
- Ordering properties (timeline chronology, section grouping)

Example property-based tests:
- **Property 9**: Generate random patch notes, serialize to JSON, deserialize, verify equivalence
- **Property 3**: Generate random date ranges, verify all returned commits fall within range
- **Property 6**: Generate random texts, apply same theme, verify vocabulary consistency
- **Property 10**: Generate random releases, verify timeline sorts chronologically

### Testing Approach

1. **Implementation-first development**: Implement features before writing corresponding tests
2. **Complementary testing**: Unit tests catch specific bugs, property tests verify general correctness
3. **Early validation**: Run tests after each module implementation to catch errors early
4. **Continuous testing**: Use Vitest watch mode during development

## Implementation Considerations

### Technology Stack

- **Language**: TypeScript (ES2020)
- **Frontend**: Vite + vanilla TypeScript + HTML/CSS
- **Backend**: Express.js
- **Git Operations**: simple-git library
- **Markdown Processing**: marked library
- **Testing**: Vitest + fast-check
- **Build**: Vite bundler

### File Structure

```
src/
├── server/
│   ├── index.ts              # Express server entry point
│   ├── api/
│   │   ├── routes.ts         # API route definitions
│   │   └── handlers.ts       # Request handlers
│   └── core/
│       ├── commit-parser.ts  # Commit Parser implementation
│       ├── theme-engine.ts   # Theme Engine implementation
│       ├── generator.ts      # Patch Note Generator
│       └── export.ts         # Export System
├── client/
│   ├── index.html            # Frontend entry point
│   ├── main.ts               # Frontend application logic
│   ├── timeline.ts           # Release Timeline component
│   └── styles.css            # Horror-themed styling
├── sdk/
│   ├── index.ts              # Plugin API entry point
│   └── types.ts              # Exported type definitions
├── themes/
│   ├── haunted.json          # Default horror theme
│   └── README.md             # Theme creation guide
└── preview/
    └── sample-commits.ts     # Preview mode synthetic data
```

### Performance Considerations

- **Lazy loading**: Load themes on demand
- **Caching**: Cache parsed commits for repeated operations
- **Streaming**: Stream large repository parsing results
- **Pagination**: Paginate timeline for repositories with many releases

### Security Considerations

- **Path validation**: Validate repository paths to prevent directory traversal
- **Input sanitization**: Sanitize commit messages before display
- **XSS prevention**: Escape HTML in themed content
- **Rate limiting**: Limit API requests to prevent abuse

### Extensibility Points

1. **Theme System**: Add new themes by creating JSON configuration files
2. **Export Formats**: Add new exporters by implementing ExportSystem interface
3. **AI Integration**: Replace simple pattern matching with LLM-based generation
4. **Git Providers**: Support remote repositories (GitHub, GitLab, etc.)
5. **Custom Sections**: Allow users to define custom patch note sections

## Future Enhancements

- **AI-powered generation**: Integrate with LLM APIs for more sophisticated theming
- **Multiple theme support**: Apply multiple themes simultaneously
- **Interactive timeline**: Add animations and transitions
- **Collaborative features**: Share and vote on themed patch notes
- **Theme marketplace**: Community-contributed themes
- **Version comparison**: Compare changes between releases
- **Search functionality**: Search through patch note history
- **Webhook support**: Trigger generation on git push events

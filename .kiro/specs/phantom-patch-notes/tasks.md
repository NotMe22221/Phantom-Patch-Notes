# Implementation Plan

- [x] 1. Set up project structure and core type definitions
  - Create directory structure for server, client, SDK, themes, and preview
  - Define TypeScript interfaces for CommitData, PatchNote, ThemeConfig, and other core types
  - Set up shared types file for cross-module usage
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Implement Commit Parser module
  - [x] 2.1 Create commit parser with simple-git integration
    - Write CommitParser class with parseRepository and validateRepository methods
    - Implement repository path validation
    - Extract commit metadata (hash, author, email, timestamp, message, changed files)
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 2.2 Write property test for complete commit extraction
    - **Property 1: Complete commit extraction**
    - **Validates: Requirements 1.1, 1.2, 1.3**
  
  - [x] 2.3 Add error handling for invalid repositories
    - Implement descriptive error messages for invalid paths
    - Handle git operation failures gracefully
    - _Requirements: 1.4, 10.3_
  
  - [x] 2.4 Write property test for invalid repository error handling
    - **Property 2: Invalid repository error handling**
    - **Validates: Requirements 1.4**
  
  - [x] 2.5 Implement commit filtering by date range and tags
    - Add date range filtering logic
    - Add tag-based filtering
    - Support maxCount parameter
    - _Requirements: 1.5_
  
  - [x] 2.6 Write property test for commit filtering correctness
    - **Property 3: Commit filtering correctness**
    - **Validates: Requirements 1.5**

- [x] 3. Implement Theme Engine module
  - [x] 3.1 Create theme configuration structure and loader
    - Define ThemeConfig, ThemeVocabulary, and NarrativePattern interfaces
    - Implement theme loading from JSON files
    - Create default "haunted" theme configuration
    - _Requirements: 7.1, 7.2_
  
  - [x] 3.2 Write property test for theme loading
    - **Property 22: Theme loading supports multiple configurations**
    - **Validates: Requirements 7.1**
  
  - [x] 3.3 Implement theme application logic
    - Create pattern matching for commit message keywords
    - Implement vocabulary substitution
    - Apply narrative patterns based on change type
    - _Requirements: 2.4, 7.3_
  
  - [x] 3.4 Write property test for theme consistency
    - **Property 6: Theme consistency**
    - **Validates: Requirements 2.4, 7.3**
  
  - [x] 3.5 Add theme validation and fallback behavior
    - Validate theme structure on load
    - Implement fallback to default theme on errors
    - _Requirements: 7.5, 10.4_
  
  - [x] 3.6 Write property test for theme validation
    - **Property 25: Theme validation rejects invalid configurations**
    - **Validates: Requirements 7.5**
  
  - [x] 3.7 Write property test for theme fallback
    - **Property 33: Theme fallback on failure**
    - **Validates: Requirements 10.4**

- [x] 4. Implement Patch Note Generator module
  - [x] 4.1 Create commit grouping logic
    - Implement keyword-based commit type detection (feature, fix, breaking, other)
    - Group commits by type into sections
    - Generate section titles using theme vocabulary
    - _Requirements: 2.3_
  
  - [x] 4.2 Write property test for commit grouping
    - **Property 5: Commit grouping by type**
    - **Validates: Requirements 2.3**
  
  - [x] 4.3 Implement patch note generation
    - Transform commits using Theme Engine
    - Preserve original commit messages alongside themed versions
    - Create PatchNote structure with sections and entries
    - Generate version numbers and dates
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [x] 4.4 Write property test for theme transformation preservation
    - **Property 4: Theme transformation preserves original**
    - **Validates: Requirements 2.2, 2.5**

- [x] 5. Implement Export System module
  - [x] 5.1 Create Markdown exporter
    - Format patch notes as Markdown with headers and lists
    - Include themed and original commit messages
    - Generate clean, readable output
    - _Requirements: 3.1_
  
  - [x] 5.2 Write property test for Markdown export validity
    - **Property 7: Markdown export validity**
    - **Validates: Requirements 3.1**
  
  - [x] 5.3 Create HTML exporter with embedded CSS
    - Convert Markdown to HTML using marked library
    - Embed horror-themed CSS styling
    - Ensure valid HTML5 output
    - _Requirements: 3.2, 3.4_
  
  - [x] 5.4 Write property test for HTML export validity
    - **Property 8: HTML export validity with CSS**
    - **Validates: Requirements 3.2, 3.4**
  
  - [x] 5.5 Create JSON exporter
    - Serialize PatchNote to JSON
    - Support pretty printing option
    - Preserve all metadata and structure
    - _Requirements: 3.3, 3.5_
  
  - [x] 5.6 Write property test for JSON round-trip
    - **Property 9: JSON round-trip preservation**
    - **Validates: Requirements 3.3, 3.5**
  
  - [x] 5.7 Create unified export interface
    - Implement export method that routes to appropriate exporter
    - Return ExportResult with content, mimeType, and filename
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Implement Preview Mode
  - [x] 6.1 Create synthetic commit generator
    - Generate realistic commit data with varied types
    - Include diverse commit messages demonstrating different patterns
    - Mark synthetic data clearly
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [x] 6.2 Write property test for preview mode data generation
    - **Property 18: Preview mode generates synthetic data**
    - **Validates: Requirements 6.1, 6.2**
  
  - [x] 6.3 Implement preview mode toggle
    - Add mode switching between synthetic and real data
    - Ensure theme capabilities are demonstrated in preview
    - _Requirements: 6.3, 6.5_
  
  - [x] 6.4 Write property test for preview mode toggle
    - **Property 21: Preview mode toggle switches data source**
    - **Validates: Requirements 6.5**

- [x] 7. Checkpoint - Ensure all core modules pass tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement Backend API
  - [x] 8.1 Create Express server setup
    - Set up Express application with TypeScript
    - Configure middleware (JSON parsing, CORS, error handling)
    - Define API routes structure
    - _Requirements: 8.2, 8.3_
  
  - [x] 8.2 Implement API endpoints
    - POST /api/parse - Parse repository and return commits
    - POST /api/generate - Generate patch notes from commits
    - POST /api/export - Export patch notes in specified format
    - GET /api/themes - List available themes
    - GET /api/preview - Get preview mode data
    - _Requirements: 5.1, 5.2, 8.2_
  
  - [x] 8.3 Add API error handling
    - Implement structured error responses
    - Include component name and error type in responses
    - Handle validation errors, git errors, and system errors
    - _Requirements: 5.3, 10.1, 10.2_
  
  - [x] 8.4 Write property test for API error handling
    - **Property 16: Plugin API structured error handling**
    - **Validates: Requirements 5.3**
  
  - [x] 8.5 Write property test for module pipeline compatibility
    - **Property 30: Module pipeline compatibility**
    - **Validates: Requirements 9.2, 9.3**

- [x] 9. Implement Plugin API / SDK
  - [x] 9.1 Create SDK entry point
    - Export PluginAPI interface
    - Implement generate method with configuration support
    - Add configuration validation
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 9.2 Write property test for plugin API configuration
    - **Property 14: Plugin API accepts required configuration**
    - **Validates: Requirements 5.1**
  
  - [x] 9.3 Add environment variable support
    - Read configuration from environment variables
    - Support standard env var naming (REPO_PATH, OUTPUT_PATH, etc.)
    - _Requirements: 5.5_
  
  - [x] 9.4 Write property test for environment variable support
    - **Property 17: Plugin API environment variable support**
    - **Validates: Requirements 5.5**
  
  - [x] 9.5 Export TypeScript type definitions
    - Create types.ts with all public interfaces
    - Ensure SDK is fully typed for consumers
    - _Requirements: 5.1_

- [x] 10. Implement Frontend Application
  - [x] 10.1 Create HTML structure and horror-themed CSS
    - Build index.html with semantic structure
    - Create horror-themed CSS (dark colors, gothic fonts, animations)
    - Ensure responsive design
    - _Requirements: 8.1, 4.4_
  
  - [x] 10.2 Implement repository selection UI
    - Add input for repository path
    - Add preview mode toggle
    - Add generate button
    - _Requirements: 8.1_
  
  - [x] 10.3 Implement Release Timeline component
    - Create timeline rendering logic
    - Display releases in chronological order
    - Show version, date, and summary for each release
    - _Requirements: 4.1, 4.2_
  
  - [x] 10.4 Write property test for timeline ordering
    - **Property 10: Timeline chronological ordering**
    - **Validates: Requirements 4.1**
  
  - [x] 10.5 Add release selection and detail view
    - Implement click handlers for release selection
    - Display full patch notes on selection
    - Add navigation between releases
    - _Requirements: 4.3, 4.5_
  
  - [x] 10.6 Write property test for release selection
    - **Property 12: Release selection updates display**
    - **Validates: Requirements 4.3**
  
  - [x] 10.7 Implement export functionality
    - Add format selection dropdown (Markdown, HTML, JSON)
    - Implement download trigger
    - Call backend export API
    - _Requirements: 8.4_
  
  - [x] 10.8 Add error display
    - Create error message component
    - Display user-friendly error messages
    - Handle API errors gracefully
    - _Requirements: 8.5_
  
  - [x] 10.9 Write property test for frontend error display
    - **Property 29: Frontend error display**
    - **Validates: Requirements 8.5**
  
  - [x] 10.10 Connect frontend to backend API
    - Implement API client functions
    - Handle loading states
    - Trigger backend operations on user actions
    - _Requirements: 8.2, 8.3_
  
  - [x] 10.11 Write property test for frontend API integration
    - **Property 26: Frontend triggers backend operations**
    - **Validates: Requirements 8.2**

- [x] 11. Create default haunted theme
  - [x] 11.1 Design haunted theme vocabulary
    - Define horror-themed verbs (summoned, banished, cursed, etc.)
    - Define atmospheric adjectives (spectral, eldritch, haunted, etc.)
    - Define spooky nouns (phantom, wraith, specter, etc.)
    - _Requirements: 2.1, 7.2_
  
  - [x] 11.2 Create narrative patterns for change types
    - Define patterns for additions (e.g., "Summoned {feature} from the void")
    - Define patterns for removals (e.g., "Banished {feature} to the shadow realm")
    - Define patterns for modifications (e.g., "Transformed {feature} with dark magic")
    - Define patterns for fixes (e.g., "Exorcised the {bug} haunting {component}")
    - Define patterns for breaking changes (e.g., "Shattered {feature} in a ritual of renewal")
    - _Requirements: 2.1, 7.2_
  
  - [x] 11.3 Add CSS styling rules to theme
    - Define color palette (dark purples, blacks, blood reds)
    - Specify gothic fonts
    - Add subtle animations (fade-ins, glows)
    - _Requirements: 3.4, 7.2_
  
  - [x] 11.4 Save theme as JSON configuration
    - Create themes/haunted.json file
    - Validate theme structure
    - _Requirements: 7.1, 7.2, 7.4_

- [x] 12. Add theme extensibility documentation
  - [x] 12.1 Create theme creation guide
    - Document theme JSON structure
    - Provide examples of vocabulary and patterns
    - Explain how to add new themes
    - _Requirements: 7.4_
  
  - [x] 12.2 Write property test for theme extensibility
    - **Property 24: Theme extensibility without code changes**
    - **Validates: Requirements 7.4**

- [x] 13. Implement comprehensive error handling
  - [x] 13.1 Create ErrorHandler utility class
    - Implement error code mapping
    - Create user-friendly error messages
    - Add error context capture
    - _Requirements: 10.1, 10.2_
  
  - [x] 13.2 Write property test for error context capture
    - **Property 31: Error context capture**
    - **Validates: Requirements 10.1, 10.2**
  
  - [x] 13.3 Add error handling to all modules
    - Wrap git operations with try-catch
    - Handle theme loading errors
    - Handle export errors
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [x] 13.4 Write property test for git error specificity
    - **Property 32: Git error specificity**
    - **Validates: Requirements 10.3**
  
  - [x] 13.5 Write property test for error resilience
    - **Property 34: Error resilience maintains state**
    - **Validates: Requirements 10.5**

- [x] 14. Final checkpoint - Integration testing and polish
  - Ensure all tests pass, ask the user if questions arise.

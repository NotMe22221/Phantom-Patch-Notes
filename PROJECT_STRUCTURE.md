# Phantom Patch Notes - Project Structure

## Overview

This document describes the complete project structure for Phantom Patch Notes, a TypeScript-based application that transforms git commit history into atmospheric, horror-themed patch notes.

## Directory Structure

```
phantom-patch-notes/
├── src/
│   ├── shared/              # Shared type definitions
│   │   └── types.ts         # Core TypeScript interfaces
│   │
│   ├── server/              # Backend API
│   │   ├── index.ts         # Express server entry point
│   │   ├── api/
│   │   │   ├── routes.ts    # API route definitions
│   │   │   └── handlers.ts  # Request handlers
│   │   └── core/
│   │       ├── commit-parser.ts   # Git commit extraction
│   │       ├── theme-engine.ts    # Theme application logic
│   │       ├── generator.ts       # Patch note generation
│   │       └── export.ts          # Multi-format export
│   │
│   ├── frontend/            # Frontend application
│   │   ├── index.html       # HTML entry point
│   │   ├── main.ts          # Application logic
│   │   ├── timeline.ts      # Release timeline component
│   │   └── styles.css       # Horror-themed styling
│   │
│   ├── sdk/                 # Plugin API / SDK
│   │   └── index.ts         # SDK entry point and exports
│   │
│   ├── themes/              # Theme configurations
│   │   ├── haunted.json     # Default horror theme
│   │   └── README.md        # Theme creation guide
│   │
│   └── preview/             # Preview mode
│       └── sample-commits.ts # Synthetic data generator
│
├── .kiro/                   # Kiro configuration
│   ├── specs/               # Feature specifications
│   └── steering/            # AI assistant guidance
│
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # Project documentation
```

## Module Descriptions

### Shared Types (`src/shared/`)

Contains all TypeScript type definitions used across the application:
- **CommitData**: Git commit representation
- **ThemeConfig**: Theme configuration structure
- **PatchNote**: Generated patch note structure
- **ExportOptions**: Export format options
- **PluginConfig**: SDK configuration
- And more...

### Server (`src/server/`)

Backend API built with Express.js:
- **core/commit-parser.ts**: Extracts git commits using simple-git
- **core/theme-engine.ts**: Applies horror-themed transformations
- **core/generator.ts**: Generates patch notes from commits
- **core/export.ts**: Exports to Markdown, HTML, and JSON
- **api/routes.ts**: Defines REST API endpoints
- **api/handlers.ts**: Implements request handlers
- **index.ts**: Server entry point

### Frontend (`src/frontend/`)

User interface built with Vite + TypeScript:
- **index.html**: Main HTML structure
- **main.ts**: Application initialization and logic
- **timeline.ts**: Release timeline component
- **styles.css**: Horror-themed CSS styling

### SDK (`src/sdk/`)

Plugin API for CI/CD integration:
- **index.ts**: Exports PluginAPI interface and all types
- Enables programmatic access to patch note generation
- Supports environment variable configuration

### Themes (`src/themes/`)

Theme configuration files:
- **haunted.json**: Default horror theme (to be populated)
- **README.md**: Theme creation guide
- Themes define vocabulary, patterns, and styling

### Preview (`src/preview/`)

Preview mode functionality:
- **sample-commits.ts**: Generates synthetic commit data
- Allows users to explore features without a real repository

## Type System

All modules share types from `src/shared/types.ts`, ensuring type safety across:
- Server ↔ Frontend communication
- SDK ↔ Server integration
- Module ↔ Module data flow

## Build Configuration

- **TypeScript**: ES2020 target, ESNext modules
- **Vite**: Frontend bundler with dev server
- **tsx**: TypeScript execution for backend
- **Vitest**: Testing framework

## Next Steps

This structure is ready for implementation. Subsequent tasks will:
1. Implement the Commit Parser module
2. Implement the Theme Engine module
3. Implement the Patch Note Generator module
4. And so on...

Each module has placeholder files with interface definitions ready to be implemented.

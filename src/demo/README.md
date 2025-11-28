# Demo Module

This directory contains all components and configuration for the Kiroween hackathon demo of Phantom Patch Notes.

## Directory Structure

```
demo/
├── config/              # Demo configuration
│   └── demo-config.ts   # Central configuration file
├── types/               # TypeScript type definitions
│   └── demo-types.ts    # Demo-specific types
├── utils/               # Utility functions
│   └── haunted-repo-loader.ts  # Haunted repository utilities
├── components/          # Demo UI components (to be implemented)
│   ├── intro-screen.ts
│   ├── sound-system.ts
│   ├── animation-engine.ts
│   ├── presentation-mode.ts
│   ├── auto-play-controller.ts
│   ├── theme-showcase.ts
│   ├── statistics-display.ts
│   └── keyboard-controller.ts
├── index.ts            # Module entry point
└── README.md           # This file
```

## Configuration

### Demo Mode Flag

The demo mode can be toggled using:

```typescript
import { enableDemoMode, disableDemoMode, isInDemoMode } from './demo';

// Enable demo features
enableDemoMode();

// Check if demo mode is active
if (isInDemoMode()) {
  // Demo-specific logic
}

// Disable demo features
disableDemoMode();
```

### Haunted Repository

The demo includes a pre-configured "haunted repository" with 20+ curated commits across 3 releases:

- **v1.0.0** - Initial haunting (5 commits)
- **v1.1.0** - The awakening (6 commits)
- **v2.0.0** - The darkness spreads (10 commits)

Access the haunted repository data:

```typescript
import { loadHauntedRepo, getAllCommits, getCommitsByRelease } from './demo';

const repo = loadHauntedRepo();
const allCommits = getAllCommits();
const v1Commits = getCommitsByRelease('1.0.0');
```

### Audio Assets

Five audio files are configured for atmospheric effects:

- `ambient-background` - Looping background music (30% volume)
- `generate-effect` - Patch note generation sound (60% volume)
- `select-effect` - Release selection sound (40% volume)
- `hover-effect` - UI hover sound (20% volume)
- `export-effect` - Export completion sound (70% volume)

### Presentation Mode

Presentation mode configuration:

- Font scale: 1.5x (50% larger)
- Hidden elements: repo input, config panel, footer, debug info
- Theme showcase: visible

### Auto-Play Timing

Auto-play step delays:

- Generate: 2 seconds
- Select release: 3 seconds
- Scroll sections: 4 seconds per section
- Export: 3 seconds
- Complete: 5 seconds

### Intro Screen

Intro screen configuration:

- Logo: `/demo/images/phantom-logo.svg`
- Tagline: "Transform Git History into Horror Stories"
- Animation duration: 2 seconds

## Usage

Import the demo configuration in your application:

```typescript
import { demoConfig, enableDemoMode } from './demo';

// Enable demo mode
enableDemoMode();

// Access configuration
console.log(demoConfig.hauntedRepo);
console.log(demoConfig.sounds);
console.log(demoConfig.presentation);
console.log(demoConfig.autoPlay);
console.log(demoConfig.intro);
```

## Components (To Be Implemented)

The following components will be implemented in subsequent tasks:

1. **Intro Screen** - Branded introduction with logo and tagline
2. **Sound System** - Audio playback management
3. **Animation Engine** - Visual effects orchestration
4. **Presentation Mode** - Full-screen presentation layout
5. **Auto-Play Controller** - Automated demo sequence
6. **Theme Showcase** - Side-by-side commit comparison
7. **Statistics Display** - Live transformation metrics
8. **Keyboard Controller** - Keyboard shortcut handling

## Requirements

This demo infrastructure satisfies requirements:

- **1.1** - Pre-configured repository path
- **1.2** - 20+ curated commits
- **1.3** - Diverse commit types
- **1.5** - 3+ distinct release versions

## Next Steps

1. Implement Sound System component (Task 3)
2. Implement Animation Engine component (Task 4)
3. Implement Presentation Mode Manager (Task 5)
4. Continue with remaining demo components

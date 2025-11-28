# Design Document

## Overview

The Kiroween Demo is an enhanced, presentation-ready version of Phantom Patch Notes designed to deliver a compelling hackathon demonstration. It extends the existing application with atmospheric features including sound effects, enhanced animations, presentation mode, auto-play capabilities, and a theme showcase. The demo leverages the existing architecture while adding new presentation-focused components that can be toggled on/off for demo purposes.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Demo Application Layer                      │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Intro Screen   │  │ Presentation │  │  Auto-Play        │  │
│  │ Component      │  │ Mode Manager │  │  Controller       │  │
│  └────────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Sound System   │  │ Animation    │  │  Theme Showcase   │  │
│  │                │  │ Engine       │  │  Component        │  │
│  └────────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Statistics     │  │ Keyboard     │  │  Haunted Repo     │  │
│  │ Display        │  │ Controller   │  │  Config           │  │
│  └────────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Existing Application Core                      │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Timeline       │  │ API Client   │  │  Error Handler    │  │
│  │ Component      │  │              │  │                   │  │
│  └────────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend API                               │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Commit Parser  │  │ Generator    │  │  Export System    │  │
│  └────────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action → Keyboard Controller → Demo Components → Existing App → Backend
     ↓              ↓                      ↓              ↓
Sound System   Auto-Play          Animation Engine   API Client
     ↓              ↓                      ↓              ↓
Audio Files    Timer Events       CSS Animations    HTTP Requests
```

## Components and Interfaces

### 1. Haunted Repository Configuration

**Purpose**: Provides pre-configured repository data for consistent demo experience.

**Interface**:
```typescript
interface HauntedRepoConfig {
  repoPath: string;
  commits: CommitData[];
  releases: ReleaseConfig[];
}

interface ReleaseConfig {
  version: string;
  date: Date;
  commitHashes: string[];
}
```

**Key Methods**:
- `loadHauntedRepo(): HauntedRepoConfig` - Loads pre-configured demo data
- `getCommitsByRelease(version: string): CommitData[]` - Gets commits for a release

### 2. Sound System

**Purpose**: Manages audio playback for atmospheric effects.

**Interface**:
```typescript
interface SoundSystem {
  initialize(): Promise<void>;
  play(soundId: SoundId): void;
  stop(soundId: SoundId): void;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
}

type SoundId = 
  | 'ambient-background'
  | 'generate-effect'
  | 'select-effect'
  | 'hover-effect'
  | 'export-effect';

interface AudioAsset {
  id: SoundId;
  url: string;
  volume: number;
  loop: boolean;
}
```

**Key Methods**:
- `initialize()` - Preloads all audio assets
- `play(soundId)` - Plays specified sound effect
- `setVolume(volume)` - Adjusts master volume (0-1)

### 3. Animation Engine

**Purpose**: Orchestrates visual effects and transitions.

**Interface**:
```typescript
interface AnimationEngine {
  playRevealAnimation(element: HTMLElement): Promise<void>;
  playCascadeAnimation(elements: HTMLElement[]): Promise<void>;
  playTransformAnimation(from: string, to: string, element: HTMLElement): Promise<void>;
  playExportAnimation(element: HTMLElement): Promise<void>;
}

interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
}
```

**Key Methods**:
- `playRevealAnimation()` - Dramatic reveal for patch notes
- `playCascadeAnimation()` - Staggered entrance for timeline
- `playTransformAnimation()` - Shows text transformation effect

### 4. Presentation Mode Manager

**Purpose**: Controls full-screen presentation layout.

**Interface**:
```typescript
interface PresentationMode {
  isActive: boolean;
  activate(): void;
  deactivate(): void;
  getFontScale(): number;
}

interface PresentationConfig {
  fontScale: number;
  hiddenElements: string[];
  showcaseVisible: boolean;
}
```

**Key Methods**:
- `activate()` - Enters presentation mode
- `deactivate()` - Exits presentation mode
- `getFontScale()` - Returns current font scaling factor

### 5. Auto-Play Controller

**Purpose**: Automates demo sequence for hands-free presentation.

**Interface**:
```typescript
interface AutoPlayController {
  isActive: boolean;
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getCurrentStep(): DemoStep;
}

type DemoStep = 
  | 'generate'
  | 'select-release'
  | 'scroll-sections'
  | 'export'
  | 'complete';

interface AutoPlayConfig {
  stepDelays: Record<DemoStep, number>;
  loopOnComplete: boolean;
}
```

**Key Methods**:
- `start()` - Begins auto-play sequence
- `stop()` - Stops and resets auto-play
- `getCurrentStep()` - Returns current demo step

### 6. Theme Showcase Component

**Purpose**: Displays side-by-side comparison of original and themed commits.

**Interface**:
```typescript
interface ThemeShowcase {
  render(container: HTMLElement): void;
  update(commits: CommitData[], patchNotes: PatchNoteEntry[]): void;
  highlightTransformations(): void;
}

interface ShowcaseEntry {
  original: string;
  themed: string;
  highlights: TextHighlight[];
}

interface TextHighlight {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'verb' | 'adjective' | 'noun';
}
```

**Key Methods**:
- `render()` - Creates showcase UI
- `update()` - Updates with new commit data
- `highlightTransformations()` - Emphasizes transformed words

### 7. Statistics Display

**Purpose**: Shows live transformation metrics.

**Interface**:
```typescript
interface StatisticsDisplay {
  render(container: HTMLElement): void;
  update(stats: TransformationStats): void;
  animateCounters(): void;
}

interface TransformationStats {
  totalCommits: number;
  horrorWordsApplied: number;
  transformationPercentage: number;
  breakdown: {
    verbs: number;
    adjectives: number;
    nouns: number;
  };
}
```

**Key Methods**:
- `update()` - Updates statistics display
- `animateCounters()` - Animates numbers counting up

### 8. Keyboard Controller

**Purpose**: Handles keyboard shortcuts for demo control.

**Interface**:
```typescript
interface KeyboardController {
  initialize(): void;
  registerShortcut(key: string, handler: () => void): void;
  unregisterShortcut(key: string): void;
}

interface KeyboardShortcut {
  key: string;
  description: string;
  handler: () => void;
}
```

**Key Methods**:
- `initialize()` - Sets up keyboard event listeners
- `registerShortcut()` - Adds new keyboard shortcut

### 9. Intro Screen Component

**Purpose**: Displays branded introduction before demo.

**Interface**:
```typescript
interface IntroScreen {
  show(): Promise<void>;
  hide(): Promise<void>;
  onBeginDemo(callback: () => void): void;
}

interface IntroConfig {
  logoUrl: string;
  tagline: string;
  animationDuration: number;
}
```

**Key Methods**:
- `show()` - Displays intro screen with animation
- `hide()` - Transitions to main demo interface

## Data Models

### Extended Types for Demo

```typescript
// Demo-specific configuration
interface DemoConfig {
  hauntedRepo: HauntedRepoConfig;
  sounds: AudioAsset[];
  presentation: PresentationConfig;
  autoPlay: AutoPlayConfig;
  intro: IntroConfig;
}

// Demo state management
interface DemoState {
  introComplete: boolean;
  presentationMode: boolean;
  autoPlayActive: boolean;
  currentStep: DemoStep;
  soundsMuted: boolean;
  statistics: TransformationStats;
}

// Export enhancement
interface EnhancedExportResult extends ExportResult {
  statistics: TransformationStats;
  timestamp: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable criteria, most are specific examples testing particular UI interactions and configurations. However, several properties emerged that test universal behaviors:

- Properties 8.1, 8.2 (keyboard toggles) are redundant with property 4.5 (presentation mode round-trip) - they all test toggle behavior
- Properties 8.3 and 8.4 (navigation) can be combined into a single navigation round-trip property
- Properties 9.1, 9.2, 9.3 all test statistics accuracy and can be combined into one comprehensive property

After consolidation, we have 5 unique properties that provide universal validation:

Property 1: Presentation mode round-trip (combines 4.5, 8.2)
Property 2: Auto-play toggle round-trip (8.1)
Property 3: Demo navigation round-trip (8.3, 8.4)
Property 4: Reset idempotence (8.5)
Property 5: Statistics accuracy (9.1, 9.2, 9.3)

### Correctness Properties

Property 1: Presentation mode round-trip
*For any* initial UI state, activating presentation mode then deactivating it should restore the original font sizes, element visibility, and layout configuration
**Validates: Requirements 4.5, 8.2**

Property 2: Auto-play toggle round-trip
*For any* auto-play state (active or inactive), toggling auto-play twice should return to the original state
**Validates: Requirements 8.1**

Property 3: Demo navigation round-trip
*For any* demo step (except first and last), navigating forward then backward should return to the original step
**Validates: Requirements 8.3, 8.4**

Property 4: Reset idempotence
*For any* demo state, pressing reset once or multiple times should result in the same initial state
**Validates: Requirements 8.5**

Property 5: Statistics accuracy
*For any* set of commits and generated patch notes, the displayed statistics (commit count, themed word count, transformation percentage) should accurately reflect the actual transformation data
**Validates: Requirements 9.1, 9.2, 9.3**

## Error Handling

### Demo-Specific Error Scenarios

1. **Audio Loading Failures**
   - Gracefully degrade if audio files fail to load
   - Display optional notification that sounds are unavailable
   - Continue demo functionality without audio

2. **Animation Performance Issues**
   - Detect low frame rates or performance issues
   - Automatically reduce animation complexity
   - Provide option to disable animations

3. **Haunted Repository Loading Failures**
   - Fall back to preview mode if haunted repo unavailable
   - Display clear error message
   - Allow manual repository selection as backup

4. **Keyboard Shortcut Conflicts**
   - Detect and handle conflicts with browser shortcuts
   - Provide alternative keyboard shortcuts
   - Display keyboard shortcut help overlay

5. **Full-Screen API Unavailability**
   - Detect if full-screen API is not supported
   - Fall back to maximized window mode
   - Maintain presentation mode features without full-screen

### Error Recovery Strategies

- All demo features should degrade gracefully
- Core functionality (patch note generation) must work even if demo features fail
- Provide clear visual feedback when features are unavailable
- Log errors to console for debugging without disrupting presentation

## Testing Strategy

### Unit Testing Approach

Unit tests will focus on specific examples and edge cases:

1. **Configuration Loading**
   - Test haunted repo loads with correct structure
   - Test audio assets load with correct properties
   - Test demo config has all required fields

2. **UI Interactions**
   - Test keyboard shortcuts trigger correct actions
   - Test button clicks trigger correct behaviors
   - Test hover effects apply correctly

3. **Component Rendering**
   - Test intro screen displays correct content
   - Test showcase renders original and themed text
   - Test statistics display formats numbers correctly

4. **State Management**
   - Test presentation mode activation changes state
   - Test auto-play progression through steps
   - Test reset returns to initial state

### Property-Based Testing Approach

Property-based tests will verify universal behaviors using fast-check library:

1. **Property 1: Presentation Mode Round-Trip**
   - Generate random UI states (font sizes, element visibility)
   - Activate then deactivate presentation mode
   - Verify state is restored exactly

2. **Property 2: Auto-Play Toggle Round-Trip**
   - Generate random auto-play states
   - Toggle twice
   - Verify original state is restored

3. **Property 3: Demo Navigation Round-Trip**
   - Generate random demo steps (excluding boundaries)
   - Navigate forward then backward
   - Verify original step is restored

4. **Property 4: Reset Idempotence**
   - Generate random demo states
   - Apply reset 1-5 times randomly
   - Verify all result in same initial state

5. **Property 5: Statistics Accuracy**
   - Generate random commit sets
   - Generate patch notes with random theming
   - Calculate expected statistics
   - Verify displayed statistics match calculations

### Testing Configuration

- Property-based tests will run 100 iterations minimum
- Each property test will be tagged with format: `**Feature: kiroween-demo, Property {number}: {description}**`
- Tests will use Vitest as the testing framework
- Tests will use fast-check for property-based testing
- Tests will be co-located with source files using `.test.ts` suffix

### Integration Testing

Integration tests will verify:
- Demo components integrate correctly with existing app
- Sound system coordinates with UI interactions
- Animation engine synchronizes with state changes
- Auto-play controller orchestrates all components
- Keyboard controller doesn't interfere with normal input

### Manual Testing Checklist

Before hackathon presentation:
- [ ] All audio files play correctly
- [ ] All animations run smoothly at 60fps
- [ ] Presentation mode displays clearly on projector
- [ ] Auto-play timing feels natural
- [ ] Keyboard shortcuts work reliably
- [ ] Theme showcase highlights are visible
- [ ] Statistics animate smoothly
- [ ] Export effects are impressive
- [ ] Intro screen loads quickly
- [ ] Demo resets cleanly

## Implementation Notes

### Performance Considerations

1. **Audio Preloading**
   - Preload all audio during intro screen
   - Use Web Audio API for precise timing
   - Implement audio sprite for efficiency

2. **Animation Optimization**
   - Use CSS transforms for hardware acceleration
   - Avoid layout thrashing
   - Use requestAnimationFrame for smooth animations
   - Implement animation pooling for repeated effects

3. **Memory Management**
   - Clean up event listeners when components unmount
   - Release audio buffers when not needed
   - Limit number of simultaneous animations

### Browser Compatibility

- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use Full-Screen API with fallbacks
- Use Web Audio API with fallbacks to HTML5 audio
- Test on presentation laptop before hackathon

### Accessibility Considerations

- Provide option to disable animations for motion sensitivity
- Ensure keyboard shortcuts don't interfere with screen readers
- Provide visual alternatives to audio cues
- Maintain sufficient color contrast in presentation mode

### Demo Data Curation

The haunted repository should include commits that:
- Showcase diverse horror vocabulary
- Demonstrate clear before/after transformations
- Tell a coherent "story" across releases
- Include all commit types (features, fixes, breaking changes)
- Have memorable, quotable themed outputs

Example curated commits:
- "Add user authentication" → "Summoned spectral guardians from the void"
- "Fix memory leak" → "Banished the phantom that haunted our memory"
- "Remove deprecated API" → "Cast the cursed relics into eternal darkness"
- "Improve performance" → "Accelerated the ritual with eldritch optimizations"

## Deployment Considerations

### Demo Package Contents

The demo should be packaged with:
- Pre-built frontend bundle
- Haunted repository data embedded
- Audio files optimized and compressed
- Fonts embedded for offline use
- Standalone HTML file for easy deployment

### Presentation Setup

1. Test on presentation laptop beforehand
2. Have offline backup ready
3. Ensure audio output is configured
4. Test full-screen mode on projector
5. Have keyboard shortcut cheat sheet ready
6. Practice auto-play timing with narration

### Fallback Plan

If technical issues occur:
- Have video recording of demo as backup
- Prepare static screenshots of key moments
- Have manual mode ready (no auto-play)
- Be ready to explain features without showing them

## Future Enhancements

Potential improvements beyond hackathon:

1. **Interactive Tutorial Mode**
   - Guided walkthrough of features
   - Tooltips explaining each component
   - Practice mode for presenters

2. **Customizable Demo Scripts**
   - Allow different demo sequences
   - Configurable timing for auto-play
   - Multiple haunted repositories

3. **Recording Capability**
   - Record demo as video
   - Export demo as animated GIF
   - Share demo link

4. **Audience Interaction**
   - QR code for audience to try demo
   - Live voting on favorite themed commits
   - Real-time commit submission

5. **Analytics**
   - Track which features get most attention
   - Measure audience engagement
   - A/B test different demo sequences

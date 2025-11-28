/**
 * Demo Type Definitions
 * 
 * TypeScript interfaces and types for the Kiroween demo system.
 * These extend the core application types with demo-specific functionality.
 */

import type { CommitData } from '../../shared/types';

/**
 * Demo Step Types
 * Represents the different stages of the automated demo sequence
 */
export type DemoStep = 
  | 'generate'
  | 'select-release'
  | 'scroll-sections'
  | 'export'
  | 'complete';

/**
 * Sound Effect Identifiers
 * Available audio assets for the demo
 */
export type SoundId = 
  | 'ambient-background'
  | 'generate-effect'
  | 'select-effect'
  | 'hover-effect'
  | 'export-effect';

/**
 * Haunted Repository Configuration
 * Pre-configured repository data for consistent demo experience
 */
export interface HauntedRepoConfig {
  repoPath: string;
  commits: CommitData[];
  releases: ReleaseConfig[];
}

/**
 * Release Configuration
 * Defines a release version with associated commits
 */
export interface ReleaseConfig {
  version: string;
  date: Date;
  commitHashes: string[];
}

/**
 * Audio Asset Configuration
 * Defines an audio file and its playback settings
 */
export interface AudioAsset {
  id: SoundId;
  url: string;
  volume: number;
  loop: boolean;
}

/**
 * Presentation Mode Configuration
 * Settings for full-screen presentation display
 */
export interface PresentationConfig {
  fontScale: number;
  hiddenElements: string[];
  showcaseVisible: boolean;
}

/**
 * Auto-Play Configuration
 * Timing and behavior for automated demo sequence
 */
export interface AutoPlayConfig {
  stepDelays: Record<DemoStep, number>;
  loopOnComplete: boolean;
}

/**
 * Intro Screen Configuration
 * Branding and animation settings for demo introduction
 */
export interface IntroConfig {
  logoUrl: string;
  tagline: string;
  animationDuration: number;
}

/**
 * Complete Demo Configuration
 * Aggregates all demo settings
 */
export interface DemoConfig {
  hauntedRepo: HauntedRepoConfig;
  sounds: AudioAsset[];
  presentation: PresentationConfig;
  autoPlay: AutoPlayConfig;
  intro: IntroConfig;
}

/**
 * Demo State
 * Tracks the current state of the demo system
 */
export interface DemoState {
  introComplete: boolean;
  presentationMode: boolean;
  autoPlayActive: boolean;
  currentStep: DemoStep;
  soundsMuted: boolean;
  statistics: TransformationStats;
}

/**
 * Transformation Statistics
 * Metrics about the horror-themed transformation
 */
export interface TransformationStats {
  totalCommits: number;
  horrorWordsApplied: number;
  transformationPercentage: number;
  breakdown: {
    verbs: number;
    adjectives: number;
    nouns: number;
  };
}

/**
 * Text Highlight
 * Represents a highlighted portion of transformed text
 */
export interface TextHighlight {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'verb' | 'adjective' | 'noun';
}

/**
 * Showcase Entry
 * Side-by-side comparison of original and themed text
 */
export interface ShowcaseEntry {
  original: string;
  themed: string;
  highlights: TextHighlight[];
}

/**
 * Animation Configuration
 * Settings for visual effects
 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
}

/**
 * Keyboard Shortcut
 * Defines a keyboard shortcut and its handler
 */
export interface KeyboardShortcut {
  key: string;
  description: string;
  handler: () => void;
}

/**
 * Sound System Interface
 * Manages audio playback for atmospheric effects
 */
export interface SoundSystem {
  initialize(): Promise<void>;
  play(soundId: SoundId): void;
  stop(soundId: SoundId): void;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
}

/**
 * Animation Engine Interface
 * Orchestrates visual effects and transitions
 */
export interface AnimationEngine {
  playRevealAnimation(element: HTMLElement): Promise<void>;
  playCascadeAnimation(elements: HTMLElement[]): Promise<void>;
  playTransformAnimation(from: string, to: string, element: HTMLElement): Promise<void>;
  playExportAnimation(element: HTMLElement): Promise<void>;
}

/**
 * Presentation Mode Interface
 * Controls full-screen presentation layout
 */
export interface PresentationMode {
  isActive: boolean;
  activate(): void;
  deactivate(): void;
  toggle(): void;
  getFontScale(): number;
}

/**
 * Auto-Play Controller Interface
 * Automates demo sequence for hands-free presentation
 */
export interface AutoPlayController {
  isActive: boolean;
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getCurrentStep(): DemoStep;
  nextStep(): void;
  previousStep(): void;
  reset(): void;
}

/**
 * Theme Showcase Interface
 * Displays side-by-side comparison of original and themed commits
 */
export interface ThemeShowcase {
  render(container: HTMLElement): void;
  update(commits: CommitData[], patchNotes: any[]): void;
  highlightTransformations(): void;
}

/**
 * Statistics Display Interface
 * Shows live transformation metrics
 */
export interface StatisticsDisplay {
  render(container: HTMLElement): void;
  update(stats: TransformationStats): void;
  animateCounters(): void;
}

/**
 * Keyboard Controller Interface
 * Handles keyboard shortcuts for demo control
 */
export interface KeyboardController {
  initialize(): void;
  registerShortcut(key: string, handler: () => void): void;
  unregisterShortcut(key: string): void;
}

/**
 * Intro Screen Interface
 * Displays branded introduction before demo
 */
export interface IntroScreen {
  show(): Promise<void>;
  hide(): Promise<void>;
  onBeginDemo(callback: () => void): void;
}

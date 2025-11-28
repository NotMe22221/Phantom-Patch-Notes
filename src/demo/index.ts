/**
 * Demo Module Entry Point
 * 
 * Exports all demo configuration, types, and utilities for the
 * Kiroween hackathon demo.
 */

// Configuration
export {
  demoConfig,
  hauntedRepoConfig,
  audioAssets,
  presentationConfig,
  autoPlayConfig,
  introConfig,
  isDemoMode,
  enableDemoMode,
  disableDemoMode,
  isInDemoMode
} from './config/demo-config';

// Types (interfaces only, not classes)
export type {
  DemoConfig,
  DemoState,
  DemoStep,
  SoundId,
  HauntedRepoConfig,
  ReleaseConfig,
  AudioAsset,
  PresentationConfig,
  AutoPlayConfig,
  IntroConfig,
  TransformationStats,
  TextHighlight,
  ShowcaseEntry,
  AnimationConfig,
  KeyboardShortcut
} from './types/demo-types';

// Interface types for components (not the implementations)
export type {
  SoundSystem as ISoundSystem,
  AnimationEngine as IAnimationEngine,
  PresentationMode as IPresentationMode,
  AutoPlayController as IAutoPlayController,
  ThemeShowcase as IThemeShowcase,
  StatisticsDisplay as IStatisticsDisplay,
  KeyboardController as IKeyboardController,
  IntroScreen as IIntroScreen
} from './types/demo-types';

// Utilities
export {
  loadHauntedRepo,
  getAllCommits,
  getCommitsByRelease,
  getAllReleases,
  getReleaseByVersion,
  getLatestRelease,
  getCommitByHash,
  getRepoPath,
  validateHauntedRepo
} from './utils/haunted-repo-loader';

export {
  createSilentAudioDataURL,
  getPlaceholderAudioURLs
} from './utils/placeholder-audio';

// Components
export { SoundSystem } from './components/sound-system';
export { AnimationEngine } from './components/animation-engine';
export { PresentationModeManager } from './components/presentation-mode';
export { AutoPlayController } from './components/auto-play-controller';
export { ThemeShowcase } from './components/theme-showcase';
export { StatisticsDisplay } from './components/statistics-display';
export { KeyboardController } from './components/keyboard-controller';
export { IntroScreen } from './components/intro-screen';

// Demo App
export { DemoApp, createDemoApp, type MainAppHandlers } from './demo-app';

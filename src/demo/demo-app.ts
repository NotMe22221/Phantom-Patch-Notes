/**
 * Demo Application Wrapper
 * 
 * Integrates all demo components into the main application.
 * Manages component lifecycle, event coordination, and state management.
 * Provides demo mode toggle for switching between normal and demo mode.
 * 
 * Requirements: All demo requirements (1.1-10.5)
 */

import { IntroScreen } from './components/intro-screen';
import { SoundSystem } from './components/sound-system';
import { AnimationEngine } from './components/animation-engine';
import { PresentationModeManager } from './components/presentation-mode';
import { AutoPlayController } from './components/auto-play-controller';
import { ThemeShowcase } from './components/theme-showcase';
import { StatisticsDisplay } from './components/statistics-display';
import { KeyboardController } from './components/keyboard-controller';
import { loadHauntedRepo } from './utils/haunted-repo-loader';
import { getPlaceholderAudioURLs } from './utils/placeholder-audio';
import { PerformanceMonitor } from './utils/performance-monitor';
import { 
  demoConfig, 
  enableDemoMode, 
  disableDemoMode, 
  isInDemoMode 
} from './config/demo-config';

import type { 
  DemoState, 
  TransformationStats,
  DemoStep 
} from './types/demo-types';
import type { CommitData, PatchNote } from '../shared/types';

/**
 * Demo Application Class
 * Central coordinator for all demo components
 */
export class DemoApp {
  // Component instances
  private introScreen: IntroScreen;
  private soundSystem: SoundSystem;
  private animationEngine: AnimationEngine;
  private presentationMode: PresentationModeManager;
  private autoPlayController: AutoPlayController;
  private themeShowcase: ThemeShowcase;
  private statisticsDisplay: StatisticsDisplay;
  private keyboardController: KeyboardController;
  private performanceMonitor: PerformanceMonitor;

  // State
  private state: DemoState;
  private isInitialized: boolean = false;
  private mainAppHandlers: MainAppHandlers | null = null;
  private performanceCheckInterval: number | null = null;

  constructor() {
    // Initialize state
    this.state = {
      introComplete: false,
      presentationMode: false,
      autoPlayActive: false,
      currentStep: 'generate',
      soundsMuted: false,
      statistics: {
        totalCommits: 0,
        horrorWordsApplied: 0,
        transformationPercentage: 0,
        breakdown: {
          verbs: 0,
          adjectives: 0,
          nouns: 0
        }
      }
    };

    // Initialize components
    this.introScreen = new IntroScreen(demoConfig.intro);
    
    // Use placeholder audio URLs for demo
    const audioAssets = demoConfig.sounds.map(asset => ({
      ...asset,
      url: getPlaceholderAudioURLs()[asset.id] || asset.url
    }));
    this.soundSystem = new SoundSystem(audioAssets);
    
    this.animationEngine = new AnimationEngine();
    this.presentationMode = new PresentationModeManager(demoConfig.presentation);
    this.autoPlayController = new AutoPlayController(
      demoConfig.autoPlay,
      this.soundSystem,
      this.animationEngine
    );
    this.themeShowcase = new ThemeShowcase();
    this.statisticsDisplay = new StatisticsDisplay();
    this.keyboardController = new KeyboardController(
      this.autoPlayController,
      this.presentationMode
    );
    
    this.performanceMonitor = new PerformanceMonitor({
      targetFPS: 60,
      enableFallbacks: true,
      maxConcurrentAnimations: 10
    });

    console.log('🎃 DemoApp instance created');
  }

  /**
   * Initialize the demo application
   * Sets up all components and event listeners
   */
  async initialize(mainAppHandlers: MainAppHandlers): Promise<void> {
    if (this.isInitialized) {
      console.warn('DemoApp already initialized');
      return;
    }

    try {
      console.log('🎃 Initializing DemoApp...');

      // Store main app handlers
      this.mainAppHandlers = mainAppHandlers;

      // Enable demo mode
      enableDemoMode();

      // Show intro screen
      await this.introScreen.show();

      // Set up intro screen callback
      this.introScreen.onBeginDemo(async () => {
        await this.onIntroComplete();
      });

      // Initialize sound system (preload audio during intro)
      await this.soundSystem.initialize();

      // Initialize keyboard controller
      this.keyboardController.initialize();

      // Set up event listeners
      this.setupEventListeners();

      // Start performance monitoring
      this.performanceMonitor.start();
      this.startPerformanceChecks();

      this.isInitialized = true;
      console.log('✓ DemoApp initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DemoApp:', error);
      // Gracefully degrade - continue without demo features
      this.handleInitializationError(error);
    }
  }

  /**
   * Start periodic performance checks
   */
  private startPerformanceChecks(): void {
    // Check performance every 5 seconds
    this.performanceCheckInterval = window.setInterval(() => {
      const metrics = this.performanceMonitor.getMetrics();
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Performance:', {
          fps: metrics.fps.toFixed(1),
          frameTime: metrics.frameTime.toFixed(2) + 'ms',
          memory: metrics.memoryUsage ? (metrics.memoryUsage * 100).toFixed(1) + '%' : 'N/A'
        });
      }

      // Warn if performance is poor
      if (!this.performanceMonitor.isPerformanceGood()) {
        console.warn('⚠️ Performance degraded:', metrics.fps.toFixed(1), 'FPS');
      }
    }, 5000);
  }

  /**
   * Handle intro screen completion
   */
  private async onIntroComplete(): Promise<void> {
    try {
      this.state.introComplete = true;

      // Render demo UI components
      this.renderDemoComponents();

      // Load haunted repository
      await this.loadHauntedRepository();

      // Start ambient background music
      if (!this.state.soundsMuted) {
        this.soundSystem.play('ambient-background');
      }

      console.log('✓ Intro complete, demo ready');

      // Dispatch event
      window.dispatchEvent(new CustomEvent('demoReady'));
    } catch (error) {
      console.error('Error completing intro:', error);
      this.handleError(error);
    }
  }

  /**
   * Render demo UI components
   */
  private renderDemoComponents(): void {
    // Find or create containers for demo components
    const mainContainer = document.querySelector('.app-main') || document.body;

    // Create demo components container
    let demoContainer = document.querySelector('.demo-components') as HTMLElement;
    if (!demoContainer) {
      demoContainer = document.createElement('div');
      demoContainer.className = 'demo-components';
      demoContainer.style.cssText = `
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      `;
      
      // Insert before timeline section
      const timelineSection = document.querySelector('.timeline-section');
      if (timelineSection && timelineSection.parentNode) {
        timelineSection.parentNode.insertBefore(demoContainer, timelineSection);
      } else {
        mainContainer.appendChild(demoContainer);
      }
    }

    // Render theme showcase
    this.themeShowcase.render(demoContainer);

    // Render statistics display
    this.statisticsDisplay.render(demoContainer);

    console.log('✓ Demo components rendered');
  }

  /**
   * Load haunted repository data
   */
  private async loadHauntedRepository(): Promise<void> {
    try {
      const hauntedRepo = await loadHauntedRepo();
      console.log(`✓ Loaded haunted repository with ${hauntedRepo.commits.length} commits`);

      // Notify main app to use haunted repo
      if (this.mainAppHandlers?.onHauntedRepoLoaded) {
        this.mainAppHandlers.onHauntedRepoLoaded(hauntedRepo.commits);
      }
    } catch (error) {
      console.error('Failed to load haunted repository:', error);
      // Continue without haunted repo - fall back to normal mode
    }
  }

  /**
   * Set up event listeners for demo coordination
   */
  private setupEventListeners(): void {
    // Auto-play events
    window.addEventListener('generatePatchNotes', () => {
      this.handleGeneratePatchNotes();
    });

    window.addEventListener('selectFirstRelease', () => {
      this.handleSelectFirstRelease();
    });

    window.addEventListener('scrollSections', () => {
      this.handleScrollSections();
    });

    window.addEventListener('triggerExport', () => {
      this.handleTriggerExport();
    });

    window.addEventListener('demoComplete', () => {
      this.handleDemoComplete();
    });

    // Presentation mode events
    window.addEventListener('presentationModeChanged', ((event: CustomEvent) => {
      this.state.presentationMode = event.detail.active;
      console.log(`Presentation mode: ${this.state.presentationMode ? 'ON' : 'OFF'}`);
    }) as EventListener);

    // Auto-play state events
    window.addEventListener('autoPlayStarted', () => {
      this.state.autoPlayActive = true;
      console.log('Auto-play started');
    });

    window.addEventListener('autoPlayStopped', () => {
      this.state.autoPlayActive = false;
      console.log('Auto-play stopped');
    });

    // Demo reset event
    window.addEventListener('demoReset', () => {
      this.handleDemoReset();
    });

    console.log('✓ Event listeners set up');
  }

  /**
   * Handle generate patch notes step
   */
  private handleGeneratePatchNotes(): void {
    console.log('→ Auto-play: Generating patch notes');
    
    if (this.mainAppHandlers?.onGenerate) {
      this.mainAppHandlers.onGenerate();
    }
  }

  /**
   * Handle select first release step
   */
  private handleSelectFirstRelease(): void {
    console.log('→ Auto-play: Selecting first release');
    
    if (this.mainAppHandlers?.onSelectFirstRelease) {
      this.mainAppHandlers.onSelectFirstRelease();
    }
  }

  /**
   * Handle scroll sections step
   */
  private handleScrollSections(): void {
    console.log('→ Auto-play: Scrolling sections');
    
    if (this.mainAppHandlers?.onScrollSections) {
      this.mainAppHandlers.onScrollSections();
    }
  }

  /**
   * Handle trigger export step
   */
  private handleTriggerExport(): void {
    console.log('→ Auto-play: Triggering export');
    
    if (this.mainAppHandlers?.onExport) {
      this.mainAppHandlers.onExport();
    }
  }

  /**
   * Handle demo complete step
   */
  private handleDemoComplete(): void {
    console.log('✓ Demo sequence complete');
    
    // Show completion message
    this.showCompletionMessage();
  }

  /**
   * Handle demo reset
   */
  private handleDemoReset(): void {
    console.log('↻ Resetting demo');
    
    // Reset statistics
    this.statisticsDisplay.reset();
    
    // Reset state
    this.state.currentStep = 'generate';
    
    // Notify main app
    if (this.mainAppHandlers?.onReset) {
      this.mainAppHandlers.onReset();
    }
  }

  /**
   * Show completion message
   */
  private showCompletionMessage(): void {
    const message = document.createElement('div');
    message.className = 'demo-completion-message';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-shadow, #1a1a1a);
      border: 3px solid var(--color-blood, #8b0000);
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 0 50px rgba(139, 0, 0, 0.8);
      animation: fadeIn 0.5s ease-out;
    `;

    message.innerHTML = `
      <h2 style="
        font-family: 'Creepster', cursive;
        font-size: 2.5rem;
        color: var(--color-blood, #8b0000);
        margin-bottom: 1rem;
        text-shadow: 0 0 20px rgba(139, 0, 0, 0.8);
      ">Demo Complete!</h2>
      <p style="
        color: var(--color-ghost, #e0e0e0);
        font-size: 1.2rem;
        margin-bottom: 2rem;
      ">The horror transformation has been revealed</p>
      <button id="restart-demo-btn" style="
        padding: 1rem 2rem;
        font-size: 1.1rem;
        background: var(--color-spectral, #4a0e4e);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(74, 14, 78, 0.5);
      ">Restart Demo</button>
    `;

    document.body.appendChild(message);

    // Add restart handler
    const restartBtn = message.querySelector('#restart-demo-btn');
    restartBtn?.addEventListener('click', () => {
      message.remove();
      this.autoPlayController.reset();
      this.autoPlayController.start();
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 10000);
  }

  /**
   * Update demo with patch notes data
   * Called by main app when patch notes are generated
   */
  updateWithPatchNotes(commits: CommitData[], patchNote: PatchNote): void {
    try {
      // Calculate statistics
      const stats = this.calculateStatistics(commits, patchNote);
      this.state.statistics = stats;

      // Update statistics display
      this.statisticsDisplay.update(stats);

      // Update theme showcase
      const patchNoteEntries = this.extractPatchNoteEntries(patchNote);
      this.themeShowcase.update(commits, patchNoteEntries);

      console.log('✓ Demo updated with patch notes', stats);
    } catch (error) {
      console.error('Error updating demo with patch notes:', error);
      this.handleError(error);
    }
  }

  /**
   * Calculate transformation statistics
   */
  private calculateStatistics(commits: CommitData[], patchNote: PatchNote): TransformationStats {
    const stats: TransformationStats = {
      totalCommits: commits.length,
      horrorWordsApplied: 0,
      transformationPercentage: 0,
      breakdown: {
        verbs: 0,
        adjectives: 0,
        nouns: 0
      }
    };

    // Horror vocabulary patterns
    const patterns = {
      verbs: /\b(summoned|banished|cursed|haunted|possessed|conjured|manifested|awakened|unleashed|invoked|exorcised|transformed|corrupted|consumed|devoured|emerged|lurked|whispered|screamed|crawled|slithered|vanished)\b/gi,
      adjectives: /\b(spectral|eldritch|haunted|cursed|phantom|ghostly|ethereal|sinister|ominous|macabre|ghastly|eerie|uncanny|dreadful|malevolent|supernatural|otherworldly|arcane|forbidden|ancient|dark)\b/gi,
      nouns: /\b(phantom|specter|wraith|spirit|demon|entity|creature|horror|nightmare|abyss|void|shadow|darkness|ritual|curse|spell|incantation|portal|dimension|realm|crypt|tomb|grave)\b/gi
    };

    // Count horror words in patch note
    let totalWords = 0;
    let horrorWords = 0;

    patchNote.sections.forEach(section => {
      section.entries.forEach(entry => {
        const text = entry.themed;
        totalWords += text.split(/\s+/).length;

        // Count each type
        Object.entries(patterns).forEach(([type, pattern]) => {
          const matches = text.match(pattern);
          if (matches) {
            const count = matches.length;
            stats.breakdown[type as keyof typeof stats.breakdown] += count;
            horrorWords += count;
          }
        });
      });
    });

    stats.horrorWordsApplied = horrorWords;
    stats.transformationPercentage = totalWords > 0 
      ? Math.round((horrorWords / totalWords) * 100) 
      : 0;

    return stats;
  }

  /**
   * Extract patch note entries for showcase
   */
  private extractPatchNoteEntries(patchNote: PatchNote): any[] {
    const entries: any[] = [];

    patchNote.sections.forEach(section => {
      section.entries.forEach(entry => {
        entries.push({
          themed: entry.themed,
          original: entry.original,
          commitHash: entry.commitHash || ''
        });
      });
    });

    return entries;
  }

  /**
   * Toggle demo mode on/off
   */
  toggleDemoMode(): void {
    if (isInDemoMode()) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  /**
   * Activate demo mode
   */
  private activate(): void {
    enableDemoMode();
    console.log('🎃 Demo mode activated');
    
    // Show demo components
    this.themeShowcase.show();
    this.statisticsDisplay.show();
  }

  /**
   * Deactivate demo mode
   */
  deactivate(): void {
    disableDemoMode();
    console.log('Demo mode deactivated');
    
    // Stop auto-play
    if (this.autoPlayController.isActive) {
      this.autoPlayController.stop();
    }
    
    // Exit presentation mode
    if (this.presentationMode.isActive) {
      this.presentationMode.deactivate();
    }
    
    // Stop sounds
    this.soundSystem.mute();
    
    // Hide demo components
    this.themeShowcase.hide();
    this.statisticsDisplay.hide();
  }

  /**
   * Get current demo state
   */
  getState(): DemoState {
    return { ...this.state };
  }

  /**
   * Get component instances (for external access if needed)
   */
  getComponents() {
    return {
      introScreen: this.introScreen,
      soundSystem: this.soundSystem,
      animationEngine: this.animationEngine,
      presentationMode: this.presentationMode,
      autoPlayController: this.autoPlayController,
      themeShowcase: this.themeShowcase,
      statisticsDisplay: this.statisticsDisplay,
      keyboardController: this.keyboardController
    };
  }

  /**
   * Handle initialization error
   */
  private handleInitializationError(error: any): void {
    console.error('Demo initialization failed, continuing in normal mode:', error);
    
    // Disable demo mode
    disableDemoMode();
    
    // Show error message to user
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
    `;
    errorMsg.textContent = 'Demo features unavailable. Continuing in normal mode.';
    document.body.appendChild(errorMsg);
    
    setTimeout(() => errorMsg.remove(), 5000);
  }

  /**
   * Handle runtime errors
   */
  private handleError(error: any): void {
    console.error('Demo error:', error);
    
    // Continue gracefully - don't break the app
    // Just log the error and continue
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return {
      monitor: this.performanceMonitor.getMetrics(),
      animations: this.animationEngine.getStats()
    };
  }

  /**
   * Clean up and dispose of all resources
   */
  dispose(): void {
    console.log('Disposing DemoApp...');
    
    // Stop performance monitoring
    if (this.performanceCheckInterval !== null) {
      clearInterval(this.performanceCheckInterval);
      this.performanceCheckInterval = null;
    }
    this.performanceMonitor.stop();
    this.performanceMonitor.dispose();
    
    // Dispose all components
    this.introScreen.dispose();
    this.soundSystem.dispose();
    this.animationEngine.dispose();
    this.presentationMode.dispose();
    this.autoPlayController.dispose();
    this.themeShowcase.dispose();
    this.statisticsDisplay.dispose();
    this.keyboardController.dispose();
    
    // Disable demo mode
    disableDemoMode();
    
    this.isInitialized = false;
    console.log('✓ DemoApp disposed');
  }
}

/**
 * Main App Handlers Interface
 * Callbacks for demo to interact with main application
 */
export interface MainAppHandlers {
  onHauntedRepoLoaded?: (commits: CommitData[]) => void;
  onGenerate?: () => void;
  onSelectFirstRelease?: () => void;
  onScrollSections?: () => void;
  onExport?: () => void;
  onReset?: () => void;
}

/**
 * Create and initialize demo app
 * Convenience function for easy integration
 */
export async function createDemoApp(handlers: MainAppHandlers): Promise<DemoApp> {
  const demoApp = new DemoApp();
  await demoApp.initialize(handlers);
  return demoApp;
}

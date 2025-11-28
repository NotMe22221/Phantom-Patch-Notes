/**
 * Auto-Play Controller Component
 * 
 * Automates demo sequence for hands-free presentation.
 * Manages step sequencing, timing delays, and event emission.
 * Integrates with Sound System for audio cues and Animation Engine for visual effects.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import type { 
  AutoPlayController as IAutoPlayController, 
  AutoPlayConfig, 
  DemoStep,
  SoundSystem,
  AnimationEngine
} from '../types/demo-types';

/**
 * Step Event Detail
 * Data emitted with step transition events
 */
interface StepEventDetail {
  step: DemoStep;
  previousStep: DemoStep | null;
}

/**
 * Auto-Play Controller Implementation
 * Provides automated demonstration sequence with configurable timing
 */
export class AutoPlayController implements IAutoPlayController {
  private _isActive: boolean = false;
  private _isPaused: boolean = false;
  private currentStepIndex: number = 0;
  private stepTimer: number | null = null;
  private config: AutoPlayConfig;
  private soundSystem: SoundSystem | null = null;
  private animationEngine: AnimationEngine | null = null;

  // Demo step sequence
  private readonly steps: DemoStep[] = [
    'generate',
    'select-release',
    'scroll-sections',
    'export',
    'complete'
  ];

  // Default timing delays for each step (in milliseconds)
  private readonly defaultDelays: Record<DemoStep, number> = {
    'generate': 2000,        // 2 seconds
    'select-release': 3000,  // 3 seconds
    'scroll-sections': 4000, // 4 seconds
    'export': 3000,          // 3 seconds
    'complete': 0            // No delay for complete
  };

  constructor(
    config?: Partial<AutoPlayConfig>,
    soundSystem?: SoundSystem,
    animationEngine?: AnimationEngine
  ) {
    this.config = {
      stepDelays: this.defaultDelays,
      loopOnComplete: false,
      ...config
    };

    this.soundSystem = soundSystem || null;
    this.animationEngine = animationEngine || null;
  }

  /**
   * Check if auto-play is currently active
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Check if auto-play is currently paused
   */
  get isPaused(): boolean {
    return this._isPaused;
  }

  /**
   * Start auto-play sequence
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
   * 
   * Begins automated demonstration from the first step
   */
  start(): void {
    if (this._isActive) {
      console.warn('Auto-play already active');
      return;
    }

    console.log('▶ Starting auto-play sequence');
    this._isActive = true;
    this._isPaused = false;
    this.currentStepIndex = 0;

    // Dispatch start event
    this.dispatchEvent('autoPlayStarted', {
      step: this.getCurrentStep(),
      previousStep: null
    });

    // Begin the sequence
    this.executeCurrentStep();
  }

  /**
   * Stop auto-play sequence
   * 
   * Stops and resets the auto-play sequence
   */
  stop(): void {
    if (!this._isActive) {
      console.warn('Auto-play not active');
      return;
    }

    console.log('■ Stopping auto-play sequence');
    
    // Clear any pending timers
    this.clearTimer();

    // Reset state
    this._isActive = false;
    this._isPaused = false;
    this.currentStepIndex = 0;

    // Dispatch stop event
    this.dispatchEvent('autoPlayStopped', {
      step: this.getCurrentStep(),
      previousStep: null
    });
  }

  /**
   * Pause auto-play sequence
   * 
   * Pauses the sequence at the current step
   */
  pause(): void {
    if (!this._isActive) {
      console.warn('Auto-play not active');
      return;
    }

    if (this._isPaused) {
      console.warn('Auto-play already paused');
      return;
    }

    console.log('⏸ Pausing auto-play sequence');
    this._isPaused = true;

    // Clear the timer but keep the state
    this.clearTimer();

    // Dispatch pause event
    this.dispatchEvent('autoPlayPaused', {
      step: this.getCurrentStep(),
      previousStep: null
    });
  }

  /**
   * Resume auto-play sequence
   * 
   * Resumes the sequence from where it was paused
   */
  resume(): void {
    if (!this._isActive) {
      console.warn('Auto-play not active');
      return;
    }

    if (!this._isPaused) {
      console.warn('Auto-play not paused');
      return;
    }

    console.log('▶ Resuming auto-play sequence');
    this._isPaused = false;

    // Dispatch resume event
    this.dispatchEvent('autoPlayResumed', {
      step: this.getCurrentStep(),
      previousStep: null
    });

    // Continue from current step
    this.scheduleNextStep();
  }

  /**
   * Get current demo step
   */
  getCurrentStep(): DemoStep {
    return this.steps[this.currentStepIndex];
  }

  /**
   * Advance to next step manually
   * 
   * Useful for keyboard shortcuts or manual control
   */
  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.clearTimer();
      this.currentStepIndex++;
      this.executeCurrentStep();
    }
  }

  /**
   * Go to previous step manually
   * 
   * Useful for keyboard shortcuts or manual control
   */
  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.clearTimer();
      this.currentStepIndex--;
      this.executeCurrentStep();
    }
  }

  /**
   * Reset to initial step
   * 
   * Returns to the beginning of the sequence
   */
  reset(): void {
    this.clearTimer();
    const wasActive = this._isActive;
    
    this.currentStepIndex = 0;
    this._isPaused = false;

    // Dispatch reset event
    this.dispatchEvent('autoPlayReset', {
      step: this.getCurrentStep(),
      previousStep: null
    });

    // If was active, restart
    if (wasActive) {
      this.executeCurrentStep();
    }
  }

  /**
   * Execute the current step
   * 
   * Performs the action for the current step and schedules the next one
   */
  private executeCurrentStep(): void {
    if (!this._isActive || this._isPaused) {
      return;
    }

    const currentStep = this.getCurrentStep();
    const previousStep = this.currentStepIndex > 0 
      ? this.steps[this.currentStepIndex - 1] 
      : null;

    console.log(`→ Executing step: ${currentStep}`);

    // Dispatch step event
    this.dispatchEvent('stepChanged', {
      step: currentStep,
      previousStep
    });

    // Perform step-specific actions
    this.performStepAction(currentStep);

    // Schedule next step if not complete
    if (currentStep !== 'complete') {
      this.scheduleNextStep();
    } else {
      this.handleCompletion();
    }
  }

  /**
   * Perform actions for a specific step
   * 
   * Integrates with Sound System and Animation Engine
   */
  private performStepAction(step: DemoStep): void {
    switch (step) {
      case 'generate':
        // Requirements: 5.1 - Generate patch notes after 2 seconds
        this.dispatchEvent('generatePatchNotes', { step, previousStep: null });
        if (this.soundSystem) {
          this.soundSystem.play('generate-effect');
        }
        break;

      case 'select-release':
        // Requirements: 5.2 - Select first release after 3 seconds
        this.dispatchEvent('selectFirstRelease', { step, previousStep: null });
        if (this.soundSystem) {
          this.soundSystem.play('select-effect');
        }
        break;

      case 'scroll-sections':
        // Requirements: 5.3 - Scroll through sections every 4 seconds
        this.dispatchEvent('scrollSections', { step, previousStep: null });
        break;

      case 'export':
        // Requirements: 5.4 - Trigger export after 3 seconds
        this.dispatchEvent('triggerExport', { step, previousStep: null });
        if (this.soundSystem) {
          this.soundSystem.play('export-effect');
        }
        break;

      case 'complete':
        // Requirements: 5.5 - Display completion message
        this.dispatchEvent('demoComplete', { step, previousStep: null });
        break;
    }
  }

  /**
   * Schedule the next step with appropriate delay
   */
  private scheduleNextStep(): void {
    if (!this._isActive || this._isPaused) {
      return;
    }

    const currentStep = this.getCurrentStep();
    const delay = this.config.stepDelays[currentStep];

    // Schedule next step
    this.stepTimer = window.setTimeout(() => {
      if (this._isActive && !this._isPaused) {
        this.currentStepIndex++;
        
        if (this.currentStepIndex < this.steps.length) {
          this.executeCurrentStep();
        }
      }
    }, delay);
  }

  /**
   * Handle completion of the demo sequence
   * Requirements: 5.5
   */
  private handleCompletion(): void {
    console.log('✓ Auto-play sequence complete');

    if (this.config.loopOnComplete) {
      // Restart from beginning
      console.log('↻ Looping auto-play sequence');
      setTimeout(() => {
        this.currentStepIndex = 0;
        this.executeCurrentStep();
      }, 2000); // 2 second pause before restart
    } else {
      // Stop auto-play
      this._isActive = false;
    }
  }

  /**
   * Clear the step timer
   */
  private clearTimer(): void {
    if (this.stepTimer !== null) {
      window.clearTimeout(this.stepTimer);
      this.stepTimer = null;
    }
  }

  /**
   * Dispatch custom event
   * 
   * Emits events that other components can listen to
   */
  private dispatchEvent(eventName: string, detail: StepEventDetail): void {
    const event = new CustomEvent(eventName, { 
      detail,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AutoPlayConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): AutoPlayConfig {
    return { ...this.config };
  }

  /**
   * Set sound system integration
   */
  setSoundSystem(soundSystem: SoundSystem): void {
    this.soundSystem = soundSystem;
  }

  /**
   * Set animation engine integration
   */
  setAnimationEngine(animationEngine: AnimationEngine): void {
    this.animationEngine = animationEngine;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    this.soundSystem = null;
    this.animationEngine = null;
  }
}

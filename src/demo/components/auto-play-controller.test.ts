/**
 * Auto-Play Controller Tests
 * 
 * Tests for the Auto-Play Controller component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AutoPlayController } from './auto-play-controller';
import type { DemoStep } from '../types/demo-types';

describe('AutoPlayController', () => {
  let controller: AutoPlayController;

  beforeEach(() => {
    controller = new AutoPlayController();
    vi.useFakeTimers();
  });

  afterEach(() => {
    controller.dispose();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should start inactive', () => {
      expect(controller.isActive).toBe(false);
    });

    it('should start at generate step', () => {
      expect(controller.getCurrentStep()).toBe('generate');
    });

    it('should not be paused initially', () => {
      expect(controller.isPaused).toBe(false);
    });
  });

  describe('Start', () => {
    it('should set isActive to true when started', () => {
      controller.start();
      expect(controller.isActive).toBe(true);
    });

    it('should emit autoPlayStarted event', () => {
      const listener = vi.fn();
      window.addEventListener('autoPlayStarted', listener);

      controller.start();

      expect(listener).toHaveBeenCalled();
      window.removeEventListener('autoPlayStarted', listener);
    });

    it('should emit stepChanged event for first step', () => {
      const listener = vi.fn();
      window.addEventListener('stepChanged', listener);

      controller.start();

      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.step).toBe('generate');
      
      window.removeEventListener('stepChanged', listener);
    });

    it('should not start twice', () => {
      const listener = vi.fn();
      window.addEventListener('autoPlayStarted', listener);

      controller.start();
      controller.start();

      expect(listener).toHaveBeenCalledTimes(1);
      window.removeEventListener('autoPlayStarted', listener);
    });
  });

  describe('Stop', () => {
    it('should set isActive to false when stopped', () => {
      controller.start();
      controller.stop();
      expect(controller.isActive).toBe(false);
    });

    it('should emit autoPlayStopped event', () => {
      const listener = vi.fn();
      window.addEventListener('autoPlayStopped', listener);

      controller.start();
      controller.stop();

      expect(listener).toHaveBeenCalled();
      window.removeEventListener('autoPlayStopped', listener);
    });

    it('should reset to first step', () => {
      controller.start();
      vi.advanceTimersByTime(2000);
      controller.stop();
      expect(controller.getCurrentStep()).toBe('generate');
    });
  });

  describe('Pause and Resume', () => {
    it('should set isPaused to true when paused', () => {
      controller.start();
      controller.pause();
      expect(controller.isPaused).toBe(true);
    });

    it('should emit autoPlayPaused event', () => {
      const listener = vi.fn();
      window.addEventListener('autoPlayPaused', listener);

      controller.start();
      controller.pause();

      expect(listener).toHaveBeenCalled();
      window.removeEventListener('autoPlayPaused', listener);
    });

    it('should set isPaused to false when resumed', () => {
      controller.start();
      controller.pause();
      controller.resume();
      expect(controller.isPaused).toBe(false);
    });

    it('should emit autoPlayResumed event', () => {
      const listener = vi.fn();
      window.addEventListener('autoPlayResumed', listener);

      controller.start();
      controller.pause();
      controller.resume();

      expect(listener).toHaveBeenCalled();
      window.removeEventListener('autoPlayResumed', listener);
    });

    it('should not advance steps while paused', () => {
      controller.start();
      expect(controller.getCurrentStep()).toBe('generate');
      
      controller.pause();
      vi.advanceTimersByTime(5000);
      
      expect(controller.getCurrentStep()).toBe('generate');
    });

    it('should continue from current step when resumed', () => {
      const listener = vi.fn();
      window.addEventListener('stepChanged', listener);

      controller.start();
      listener.mockClear();
      
      controller.pause();
      vi.advanceTimersByTime(5000);
      
      controller.resume();
      vi.advanceTimersByTime(2000);
      
      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.step).toBe('select-release');
      
      window.removeEventListener('stepChanged', listener);
    });
  });

  describe('Step Sequencing', () => {
    it('should progress through all steps with correct timing', () => {
      const listener = vi.fn();
      window.addEventListener('stepChanged', listener);

      controller.start();
      expect(controller.getCurrentStep()).toBe('generate');

      // After 2 seconds, should move to select-release
      vi.advanceTimersByTime(2000);
      expect(controller.getCurrentStep()).toBe('select-release');

      // After 3 more seconds, should move to scroll-sections
      vi.advanceTimersByTime(3000);
      expect(controller.getCurrentStep()).toBe('scroll-sections');

      // After 4 more seconds, should move to export
      vi.advanceTimersByTime(4000);
      expect(controller.getCurrentStep()).toBe('export');

      // After 3 more seconds, should move to complete
      vi.advanceTimersByTime(3000);
      expect(controller.getCurrentStep()).toBe('complete');

      window.removeEventListener('stepChanged', listener);
    });

    it('should emit correct events for each step', () => {
      const generateListener = vi.fn();
      const selectListener = vi.fn();
      const scrollListener = vi.fn();
      const exportListener = vi.fn();
      const completeListener = vi.fn();

      window.addEventListener('generatePatchNotes', generateListener);
      window.addEventListener('selectFirstRelease', selectListener);
      window.addEventListener('scrollSections', scrollListener);
      window.addEventListener('triggerExport', exportListener);
      window.addEventListener('demoComplete', completeListener);

      controller.start();
      vi.advanceTimersByTime(2000);
      vi.advanceTimersByTime(3000);
      vi.advanceTimersByTime(4000);
      vi.advanceTimersByTime(3000);

      expect(generateListener).toHaveBeenCalled();
      expect(selectListener).toHaveBeenCalled();
      expect(scrollListener).toHaveBeenCalled();
      expect(exportListener).toHaveBeenCalled();
      expect(completeListener).toHaveBeenCalled();

      window.removeEventListener('generatePatchNotes', generateListener);
      window.removeEventListener('selectFirstRelease', selectListener);
      window.removeEventListener('scrollSections', scrollListener);
      window.removeEventListener('triggerExport', exportListener);
      window.removeEventListener('demoComplete', completeListener);
    });
  });

  describe('Manual Navigation', () => {
    it('should advance to next step manually', () => {
      controller.start();
      expect(controller.getCurrentStep()).toBe('generate');
      
      controller.nextStep();
      expect(controller.getCurrentStep()).toBe('select-release');
    });

    it('should go to previous step manually', () => {
      controller.start();
      vi.advanceTimersByTime(2000);
      expect(controller.getCurrentStep()).toBe('select-release');
      
      controller.previousStep();
      expect(controller.getCurrentStep()).toBe('generate');
    });

    it('should not go before first step', () => {
      controller.start();
      expect(controller.getCurrentStep()).toBe('generate');
      
      controller.previousStep();
      expect(controller.getCurrentStep()).toBe('generate');
    });

    it('should not go past last step', () => {
      controller.start();
      vi.advanceTimersByTime(12000); // Advance to complete
      expect(controller.getCurrentStep()).toBe('complete');
      
      controller.nextStep();
      expect(controller.getCurrentStep()).toBe('complete');
    });
  });

  describe('Reset', () => {
    it('should return to first step', () => {
      controller.start();
      vi.advanceTimersByTime(5000);
      
      controller.reset();
      expect(controller.getCurrentStep()).toBe('generate');
    });

    it('should emit autoPlayReset event', () => {
      const listener = vi.fn();
      window.addEventListener('autoPlayReset', listener);

      controller.start();
      vi.advanceTimersByTime(5000);
      controller.reset();

      expect(listener).toHaveBeenCalled();
      window.removeEventListener('autoPlayReset', listener);
    });

    it('should continue playing if was active', () => {
      const listener = vi.fn();
      window.addEventListener('stepChanged', listener);

      controller.start();
      vi.advanceTimersByTime(5000);
      listener.mockClear();
      
      controller.reset();
      vi.advanceTimersByTime(2000);
      
      expect(listener).toHaveBeenCalled();
      window.removeEventListener('stepChanged', listener);
    });
  });

  describe('Configuration', () => {
    it('should use custom step delays', () => {
      const customController = new AutoPlayController({
        stepDelays: {
          'generate': 1000,
          'select-release': 1000,
          'scroll-sections': 1000,
          'export': 1000,
          'complete': 0
        },
        loopOnComplete: false
      });

      customController.start();
      expect(customController.getCurrentStep()).toBe('generate');

      vi.advanceTimersByTime(1000);
      expect(customController.getCurrentStep()).toBe('select-release');

      customController.dispose();
    });

    it('should update configuration', () => {
      controller.updateConfig({
        stepDelays: {
          'generate': 500,
          'select-release': 500,
          'scroll-sections': 500,
          'export': 500,
          'complete': 0
        },
        loopOnComplete: false
      });

      const config = controller.getConfig();
      expect(config.stepDelays.generate).toBe(500);
    });
  });

  describe('Sound System Integration', () => {
    it('should call sound system when provided', () => {
      const mockSoundSystem = {
        initialize: vi.fn(),
        play: vi.fn(),
        stop: vi.fn(),
        setVolume: vi.fn(),
        mute: vi.fn(),
        unmute: vi.fn()
      };

      const controllerWithSound = new AutoPlayController(
        undefined,
        mockSoundSystem
      );

      controllerWithSound.start();
      expect(mockSoundSystem.play).toHaveBeenCalledWith('generate-effect');

      vi.advanceTimersByTime(2000);
      expect(mockSoundSystem.play).toHaveBeenCalledWith('select-effect');

      controllerWithSound.dispose();
    });
  });

  describe('Completion', () => {
    it('should stop when complete and not looping', () => {
      controller.start();
      vi.advanceTimersByTime(12000);
      
      expect(controller.getCurrentStep()).toBe('complete');
      expect(controller.isActive).toBe(false);
    });

    it('should restart when complete and looping enabled', () => {
      const loopingController = new AutoPlayController({
        stepDelays: {
          'generate': 2000,
          'select-release': 3000,
          'scroll-sections': 4000,
          'export': 3000,
          'complete': 0
        },
        loopOnComplete: true
      });

      loopingController.start();
      vi.advanceTimersByTime(12000);
      
      expect(loopingController.getCurrentStep()).toBe('complete');
      
      // Wait for restart delay
      vi.advanceTimersByTime(2000);
      expect(loopingController.getCurrentStep()).toBe('generate');

      loopingController.dispose();
    });
  });

  describe('Dispose', () => {
    it('should stop auto-play when disposed', () => {
      controller.start();
      controller.dispose();
      expect(controller.isActive).toBe(false);
    });

    it('should clear timers when disposed', () => {
      controller.start();
      controller.dispose();
      
      // Advance time and verify no steps occur
      const listener = vi.fn();
      window.addEventListener('stepChanged', listener);
      
      vi.advanceTimersByTime(10000);
      
      // Should only have the initial step event, no more
      expect(listener).not.toHaveBeenCalled();
      
      window.removeEventListener('stepChanged', listener);
    });
  });
});

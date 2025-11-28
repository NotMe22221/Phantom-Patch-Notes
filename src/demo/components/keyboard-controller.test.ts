/**
 * Keyboard Controller Tests
 * 
 * Tests for the Keyboard Controller component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { KeyboardController } from './keyboard-controller';
import { AutoPlayController } from './auto-play-controller';
import { PresentationModeManager } from './presentation-mode';

describe('KeyboardController', () => {
  let controller: KeyboardController;
  let autoPlayController: AutoPlayController;
  let presentationMode: PresentationModeManager;

  beforeEach(() => {
    autoPlayController = new AutoPlayController();
    presentationMode = new PresentationModeManager();
    controller = new KeyboardController(autoPlayController, presentationMode);
  });

  afterEach(() => {
    controller.dispose();
    autoPlayController.dispose();
    presentationMode.dispose();
  });

  describe('Initialization', () => {
    it('should not be initialized before calling initialize()', () => {
      const newController = new KeyboardController();
      expect(() => newController.dispose()).not.toThrow();
    });

    it('should initialize successfully', () => {
      expect(() => controller.initialize()).not.toThrow();
    });

    it('should not initialize twice', () => {
      controller.initialize();
      const consoleSpy = vi.spyOn(console, 'warn');
      controller.initialize();
      expect(consoleSpy).toHaveBeenCalledWith('Keyboard controller already initialized');
      consoleSpy.mockRestore();
    });
  });

  describe('Shortcut Registration', () => {
    beforeEach(() => {
      controller.initialize();
    });

    it('should register a custom shortcut', () => {
      const handler = vi.fn();
      controller.registerShortcut('t', handler, 'Test shortcut');
      
      const shortcuts = controller.getShortcuts();
      const testShortcut = shortcuts.find(s => s.key === 't');
      
      expect(testShortcut).toBeDefined();
      expect(testShortcut?.description).toBe('Test shortcut');
    });

    it('should unregister a shortcut', () => {
      const handler = vi.fn();
      controller.registerShortcut('t', handler, 'Test shortcut');
      controller.unregisterShortcut('t');
      
      const shortcuts = controller.getShortcuts();
      const testShortcut = shortcuts.find(s => s.key === 't');
      
      expect(testShortcut).toBeUndefined();
    });

    it('should have default shortcuts registered', () => {
      const shortcuts = controller.getShortcuts();
      
      // Check for default shortcuts
      expect(shortcuts.some(s => s.key === ' ')).toBe(true); // Space
      expect(shortcuts.some(s => s.key === 'f')).toBe(true); // F
      expect(shortcuts.some(s => s.key === 'ArrowRight')).toBe(true); // Right arrow
      expect(shortcuts.some(s => s.key === 'ArrowLeft')).toBe(true); // Left arrow
      expect(shortcuts.some(s => s.key === 'r')).toBe(true); // R
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      controller.initialize();
    });

    it('should trigger space key handler', () => {
      const startSpy = vi.spyOn(autoPlayController, 'start');
      
      const event = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(event);
      
      expect(startSpy).toHaveBeenCalled();
    });

    it('should trigger F key handler', () => {
      const toggleSpy = vi.spyOn(presentationMode, 'toggle');
      
      const event = new KeyboardEvent('keydown', { key: 'f' });
      document.dispatchEvent(event);
      
      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should trigger right arrow handler', () => {
      const nextStepSpy = vi.spyOn(autoPlayController, 'nextStep');
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);
      
      expect(nextStepSpy).toHaveBeenCalled();
    });

    it('should trigger left arrow handler', () => {
      const previousStepSpy = vi.spyOn(autoPlayController, 'previousStep');
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);
      
      expect(previousStepSpy).toHaveBeenCalled();
    });

    it('should trigger R key handler', () => {
      const resetSpy = vi.spyOn(autoPlayController, 'reset');
      
      const event = new KeyboardEvent('keydown', { key: 'r' });
      document.dispatchEvent(event);
      
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should not trigger shortcuts when typing in input field', () => {
      const startSpy = vi.spyOn(autoPlayController, 'start');
      
      // Create an input element
      const input = document.createElement('input');
      document.body.appendChild(input);
      
      // Dispatch event from input
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      input.dispatchEvent(event);
      
      expect(startSpy).not.toHaveBeenCalled();
      
      document.body.removeChild(input);
    });
  });

  describe('Help Overlay', () => {
    beforeEach(() => {
      controller.initialize();
    });

    it('should show help overlay when ? is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: '?' });
      document.dispatchEvent(event);
      
      const overlay = document.querySelector('.keyboard-help-overlay') as HTMLElement;
      expect(overlay).toBeTruthy();
      expect(overlay.style.display).toBe('flex');
    });

    it('should hide help overlay when Escape is pressed', () => {
      // First show the overlay
      const showEvent = new KeyboardEvent('keydown', { key: '?' });
      document.dispatchEvent(showEvent);
      
      // Then hide it
      const hideEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(hideEvent);
      
      const overlay = document.querySelector('.keyboard-help-overlay') as HTMLElement;
      expect(overlay.style.display).toBe('none');
    });
  });

  describe('Integration', () => {
    beforeEach(() => {
      controller.initialize();
    });

    it('should work without auto-play controller', () => {
      const standaloneController = new KeyboardController();
      standaloneController.initialize();
      
      const consoleSpy = vi.spyOn(console, 'warn');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(event);
      
      expect(consoleSpy).toHaveBeenCalledWith('Auto-play controller not available');
      
      standaloneController.dispose();
      consoleSpy.mockRestore();
    });

    it('should work without presentation mode', () => {
      const standaloneController = new KeyboardController();
      standaloneController.initialize();
      
      const consoleSpy = vi.spyOn(console, 'warn');
      const event = new KeyboardEvent('keydown', { key: 'f' });
      document.dispatchEvent(event);
      
      expect(consoleSpy).toHaveBeenCalledWith('Presentation mode not available');
      
      standaloneController.dispose();
      consoleSpy.mockRestore();
    });

    it('should allow setting controllers after construction', () => {
      const standaloneController = new KeyboardController();
      standaloneController.initialize();
      
      standaloneController.setAutoPlayController(autoPlayController);
      standaloneController.setPresentationMode(presentationMode);
      
      const startSpy = vi.spyOn(autoPlayController, 'start');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(event);
      
      expect(startSpy).toHaveBeenCalled();
      
      standaloneController.dispose();
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on dispose', () => {
      controller.initialize();
      
      const startSpy = vi.spyOn(autoPlayController, 'start');
      
      controller.dispose();
      
      const event = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(event);
      
      expect(startSpy).not.toHaveBeenCalled();
    });

    it('should remove help overlay on dispose', () => {
      controller.initialize();
      
      const event = new KeyboardEvent('keydown', { key: '?' });
      document.dispatchEvent(event);
      
      controller.dispose();
      
      const overlay = document.querySelector('.keyboard-help-overlay');
      expect(overlay).toBeNull();
    });
  });
});

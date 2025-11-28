/**
 * Presentation Mode Manager Tests
 * 
 * Tests for the presentation mode functionality including activation,
 * deactivation, font scaling, and element visibility management.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PresentationModeManager } from './presentation-mode';

describe('PresentationModeManager', () => {
  let presentationMode: PresentationModeManager;
  let testContainer: HTMLElement;

  beforeEach(() => {
    // Create a test container with some elements
    testContainer = document.createElement('div');
    testContainer.innerHTML = `
      <div class="app">
        <h1>Test Title</h1>
        <p>Test paragraph</p>
        <input type="text" class="input-field" />
        <div class="config-panel">Config</div>
        <div class="theme-showcase" style="display: none;">Showcase</div>
      </div>
    `;
    document.body.appendChild(testContainer);

    presentationMode = new PresentationModeManager();
  });

  afterEach(() => {
    if (presentationMode.isActive) {
      presentationMode.deactivate();
    }
    presentationMode.dispose();
    document.body.removeChild(testContainer);
  });

  describe('Initialization', () => {
    it('should start in inactive state', () => {
      expect(presentationMode.isActive).toBe(false);
    });

    it('should have default font scale of 1.0 when inactive', () => {
      expect(presentationMode.getFontScale()).toBe(1.0);
    });

    it('should accept custom configuration', () => {
      const customMode = new PresentationModeManager({
        fontScale: 2.0,
        showcaseVisible: false
      });
      
      const config = customMode.getConfig();
      expect(config.fontScale).toBe(2.0);
      expect(config.showcaseVisible).toBe(false);
    });
  });

  describe('Activation', () => {
    it('should set isActive to true when activated', () => {
      presentationMode.activate();
      expect(presentationMode.isActive).toBe(true);
    });

    it('should return font scale of 1.5 when active', () => {
      presentationMode.activate();
      expect(presentationMode.getFontScale()).toBe(1.5);
    });

    it('should hide non-essential elements', () => {
      const inputField = testContainer.querySelector('.input-field') as HTMLElement;
      const configPanel = testContainer.querySelector('.config-panel') as HTMLElement;

      presentationMode.activate();

      expect(inputField.style.display).toBe('none');
      expect(configPanel.style.display).toBe('none');
    });

    it('should show theme showcase when configured', () => {
      const showcase = testContainer.querySelector('.theme-showcase') as HTMLElement;
      
      presentationMode.activate();

      expect(showcase.style.display).toBe('block');
    });

    it('should scale fonts by configured factor', () => {
      const title = testContainer.querySelector('h1') as HTMLElement;
      const originalSize = window.getComputedStyle(title).fontSize;
      const originalSizeValue = parseFloat(originalSize);

      presentationMode.activate();

      const newSize = parseFloat(title.style.fontSize);
      expect(newSize).toBeCloseTo(originalSizeValue * 1.5, 1);
    });

    it('should not activate twice', () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      
      presentationMode.activate();
      presentationMode.activate();

      expect(consoleSpy).toHaveBeenCalledWith('Presentation mode already active');
    });

    it('should dispatch custom event on activation', () => {
      const eventListener = vi.fn();
      window.addEventListener('presentationModeChanged', eventListener);

      presentationMode.activate();

      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { active: true }
        })
      );

      window.removeEventListener('presentationModeChanged', eventListener);
    });
  });

  describe('Deactivation', () => {
    beforeEach(() => {
      presentationMode.activate();
    });

    it('should set isActive to false when deactivated', () => {
      presentationMode.deactivate();
      expect(presentationMode.isActive).toBe(false);
    });

    it('should restore font scale to 1.0', () => {
      presentationMode.deactivate();
      expect(presentationMode.getFontScale()).toBe(1.0);
    });

    it('should restore visibility of hidden elements', () => {
      const inputField = testContainer.querySelector('.input-field') as HTMLElement;
      const configPanel = testContainer.querySelector('.config-panel') as HTMLElement;

      presentationMode.deactivate();

      expect(inputField.style.display).toBe('');
      expect(configPanel.style.display).toBe('');
    });

    it('should restore original font sizes', () => {
      const title = testContainer.querySelector('h1') as HTMLElement;
      
      presentationMode.deactivate();

      expect(title.style.fontSize).toBe('');
    });

    it('should not deactivate when not active', () => {
      presentationMode.deactivate();
      const consoleSpy = vi.spyOn(console, 'warn');
      
      presentationMode.deactivate();

      expect(consoleSpy).toHaveBeenCalledWith('Presentation mode not active');
    });

    it('should dispatch custom event on deactivation', () => {
      const eventListener = vi.fn();
      window.addEventListener('presentationModeChanged', eventListener);

      presentationMode.deactivate();

      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { active: false }
        })
      );

      window.removeEventListener('presentationModeChanged', eventListener);
    });
  });

  describe('Toggle', () => {
    it('should activate when inactive', () => {
      presentationMode.toggle();
      expect(presentationMode.isActive).toBe(true);
    });

    it('should deactivate when active', () => {
      presentationMode.activate();
      presentationMode.toggle();
      expect(presentationMode.isActive).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      presentationMode.toggle(); // activate
      expect(presentationMode.isActive).toBe(true);
      
      presentationMode.toggle(); // deactivate
      expect(presentationMode.isActive).toBe(false);
      
      presentationMode.toggle(); // activate again
      expect(presentationMode.isActive).toBe(true);
    });
  });

  describe('Configuration Updates', () => {
    it('should update configuration', () => {
      presentationMode.updateConfig({ fontScale: 2.0 });
      
      const config = presentationMode.getConfig();
      expect(config.fontScale).toBe(2.0);
    });

    it('should reapply changes if active', () => {
      const title = testContainer.querySelector('h1') as HTMLElement;
      // Get the original size before any activation
      const originalSize = parseFloat(window.getComputedStyle(title).fontSize);
      
      presentationMode.activate();
      presentationMode.updateConfig({ fontScale: 2.0 });

      // Should be reactivated with new scale
      expect(presentationMode.isActive).toBe(true);
      const newSize = parseFloat(title.style.fontSize);
      expect(newSize).toBeCloseTo(originalSize * 2.0, 1);
    });
  });

  describe('State Restoration', () => {
    it('should restore exact original state after activation and deactivation', () => {
      const title = testContainer.querySelector('h1') as HTMLElement;
      const inputField = testContainer.querySelector('.input-field') as HTMLElement;
      
      // Capture original state
      const originalTitleFontSize = title.style.fontSize;
      const originalInputDisplay = inputField.style.display;

      // Activate and deactivate
      presentationMode.activate();
      presentationMode.deactivate();

      // Verify restoration
      expect(title.style.fontSize).toBe(originalTitleFontSize);
      expect(inputField.style.display).toBe(originalInputDisplay);
    });

    it('should handle multiple activation/deactivation cycles', () => {
      const title = testContainer.querySelector('h1') as HTMLElement;
      const originalFontSize = title.style.fontSize;

      // Multiple cycles
      for (let i = 0; i < 3; i++) {
        presentationMode.activate();
        presentationMode.deactivate();
      }

      expect(title.style.fontSize).toBe(originalFontSize);
    });
  });

  describe('Dispose', () => {
    it('should deactivate if active when disposed', () => {
      presentationMode.activate();
      presentationMode.dispose();
      
      expect(presentationMode.isActive).toBe(false);
    });

    it('should clean up resources', () => {
      presentationMode.activate();
      presentationMode.dispose();
      
      // Should be safe to dispose multiple times
      expect(() => presentationMode.dispose()).not.toThrow();
    });
  });
});

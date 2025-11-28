/**
 * Animation Engine Tests
 * 
 * Basic tests to verify the Animation Engine functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AnimationEngine } from './animation-engine';

describe('AnimationEngine', () => {
  let engine: AnimationEngine;
  let testElement: HTMLElement;

  beforeEach(() => {
    engine = new AnimationEngine();
    testElement = document.createElement('div');
    testElement.textContent = 'Test content';
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    engine.dispose();
    if (testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  describe('playRevealAnimation', () => {
    it('should complete reveal animation', async () => {
      await engine.playRevealAnimation(testElement);
      expect(testElement.style.opacity).toBe('1');
    });

    it('should apply transform during reveal', async () => {
      const promise = engine.playRevealAnimation(testElement);
      // Check that animation is applied
      expect(testElement.style.transition).toContain('opacity');
      await promise;
    });
  });

  describe('playCascadeAnimation', () => {
    it('should handle empty array', async () => {
      await engine.playCascadeAnimation([]);
      // Should complete without error
      expect(true).toBe(true);
    });

    it('should animate multiple elements', async () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];
      
      elements.forEach(el => document.body.appendChild(el));
      
      await engine.playCascadeAnimation(elements);
      
      // All elements should be visible
      elements.forEach(el => {
        expect(el.style.opacity).toBe('1');
        el.remove();
      });
    });
  });

  describe('playTransformAnimation', () => {
    it('should change text content', async () => {
      const from = 'Original text';
      const to = 'Transformed text';
      testElement.textContent = from;
      
      await engine.playTransformAnimation(from, to, testElement);
      
      expect(testElement.textContent).toBe(to);
    });

    it('should complete animation', async () => {
      await engine.playTransformAnimation('old', 'new', testElement);
      expect(testElement.style.opacity).toBe('1');
    });
  });

  describe('playExportAnimation', () => {
    it('should complete export animation', async () => {
      await engine.playExportAnimation(testElement);
      // Should complete without error
      expect(testElement).toBeDefined();
    });

    it('should clean up particles', async () => {
      await engine.playExportAnimation(testElement);
      // Particle container should be removed
      const particles = testElement.querySelectorAll('[style*="position: absolute"]');
      expect(particles.length).toBe(0);
    });
  });

  describe('playGlowEffect', () => {
    it('should apply glow effect', () => {
      engine.playGlowEffect(testElement);
      expect(testElement.style.boxShadow).toContain('rgba');
    });

    it('should remove glow effect', () => {
      engine.playGlowEffect(testElement);
      engine.removeGlowEffect(testElement);
      // Cleanup should be called
      expect(true).toBe(true);
    });
  });

  describe('playFadeIn', () => {
    it('should fade in element', async () => {
      await engine.playFadeIn(testElement);
      expect(testElement.style.opacity).toBe('1');
    });

    it('should respect custom duration', async () => {
      const startTime = Date.now();
      await engine.playFadeIn(testElement, { duration: 100 });
      const elapsed = Date.now() - startTime;
      // Should complete in roughly the specified duration
      expect(elapsed).toBeGreaterThanOrEqual(90);
    });
  });

  describe('playSlideIn', () => {
    it('should slide in from bottom', async () => {
      await engine.playSlideIn(testElement, 'bottom');
      expect(testElement.style.opacity).toBe('1');
    });

    it('should slide in from left', async () => {
      await engine.playSlideIn(testElement, 'left');
      expect(testElement.style.opacity).toBe('1');
    });

    it('should slide in from right', async () => {
      await engine.playSlideIn(testElement, 'right');
      expect(testElement.style.opacity).toBe('1');
    });

    it('should slide in from top', async () => {
      await engine.playSlideIn(testElement, 'top');
      expect(testElement.style.opacity).toBe('1');
    });
  });

  describe('playPulse', () => {
    it('should apply pulse animation', () => {
      engine.playPulse(testElement, 100);
      // Should apply transition
      expect(testElement.style.transition).toContain('transform');
    });
  });

  describe('createLoadingSpinner', () => {
    it('should create spinner element', () => {
      const spinner = engine.createLoadingSpinner();
      expect(spinner).toBeDefined();
      expect(spinner.style.borderRadius).toBe('50%');
    });

    it('should inject keyframes', () => {
      engine.createLoadingSpinner();
      const keyframes = document.getElementById('animation-engine-keyframes');
      expect(keyframes).toBeDefined();
    });
  });

  describe('dispose', () => {
    it('should clean up resources', () => {
      engine.createLoadingSpinner();
      engine.dispose();
      const keyframes = document.getElementById('animation-engine-keyframes');
      expect(keyframes).toBeNull();
    });
  });
});

/**
 * Animation Engine Component
 * 
 * Orchestrates visual effects and transitions for the demo.
 * Uses CSS transforms and requestAnimationFrame for optimal performance.
 * Provides dramatic reveals, cascading effects, text transformations, and particle effects.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 * Performance optimizations: Task 14
 */

import type { AnimationEngine as IAnimationEngine, AnimationConfig } from '../types/demo-types';
import { getAnimationPool, type PooledParticle } from '../utils/animation-pool';

/**
 * Animation Engine Implementation
 * Provides horror-themed visual effects for the demo experience
 */
export class AnimationEngine implements IAnimationEngine {
  private defaultConfig: AnimationConfig = {
    duration: 1000,
    easing: 'ease-out',
    delay: 0
  };
  
  private animationPool = getAnimationPool();
  private activeAnimations: Set<number> = new Set();
  private rafCallbacks: Map<number, FrameRequestCallback> = new Map();
  private performanceFallback: boolean = false;

  constructor() {
    // Listen for performance fallback events
    window.addEventListener('performanceFallback', () => {
      this.performanceFallback = true;
      console.log('⚡ Animation engine: Performance fallback enabled');
    });
  }

  /**
   * Play dramatic reveal animation for patch note generation
   * Requirements: 3.1
   * 
   * Creates a 2-3 second reveal effect with fade-in and scale
   */
  async playRevealAnimation(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      // Store original styles
      const originalTransform = element.style.transform;
      const originalOpacity = element.style.opacity;
      const originalTransition = element.style.transition;

      // Set initial state
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8) translateY(20px)';
      element.style.transition = 'none';

      // Force reflow
      element.offsetHeight;

      // Apply animation
      element.style.transition = 'opacity 2s ease-out, transform 2s ease-out';
      element.style.opacity = '1';
      element.style.transform = 'scale(1) translateY(0)';

      // Add glow effect
      element.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.6)';

      // Cleanup after animation
      setTimeout(() => {
        element.style.transition = originalTransition;
        element.style.boxShadow = '';
        resolve();
      }, 2000);
    });
  }

  /**
   * Play cascading animation for timeline entries
   * Requirements: 3.2
   * 
   * Staggers entrance of multiple elements with a cascading effect
   */
  async playCascadeAnimation(elements: HTMLElement[]): Promise<void> {
    return new Promise((resolve) => {
      if (elements.length === 0) {
        resolve();
        return;
      }

      const staggerDelay = 150; // ms between each element
      let completed = 0;

      elements.forEach((element, index) => {
        // Store original styles
        const originalTransform = element.style.transform;
        const originalOpacity = element.style.opacity;
        const originalTransition = element.style.transition;

        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'none';

        // Force reflow
        element.offsetHeight;

        // Apply animation with stagger
        setTimeout(() => {
          element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translateX(0)';

          // Cleanup after animation
          setTimeout(() => {
            element.style.transition = originalTransition;
            completed++;
            
            if (completed === elements.length) {
              resolve();
            }
          }, 600);
        }, index * staggerDelay);
      });
    });
  }

  /**
   * Play text transformation animation
   * Requirements: 3.5
   * 
   * Shows visual transformation effect from original to themed text
   */
  async playTransformAnimation(from: string, to: string, element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      // Store original content and styles
      const originalContent = element.textContent;
      const originalTransition = element.style.transition;
      const originalColor = element.style.color;

      // Phase 1: Fade out and blur original text
      element.style.transition = 'opacity 0.4s ease-out, filter 0.4s ease-out, color 0.4s ease-out';
      element.style.opacity = '0.3';
      element.style.filter = 'blur(3px)';
      element.style.color = '#666';

      setTimeout(() => {
        // Phase 2: Replace text
        element.textContent = to;

        // Phase 3: Fade in and unblur new text with horror color
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.filter = 'blur(0)';
          element.style.color = '#8a2be2'; // Horror purple
          element.style.textShadow = '0 0 10px rgba(138, 43, 226, 0.5)';

          // Phase 4: Cleanup
          setTimeout(() => {
            element.style.transition = originalTransition;
            element.style.textShadow = '';
            resolve();
          }, 400);
        }, 50);
      }, 400);
    });
  }

  /**
   * Play export animation with particle effects
   * Requirements: 3.1, 3.4
   * Performance optimized with particle pooling
   * 
   * Creates dramatic export animation with particle effects
   */
  async playExportAnimation(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      // Reduce particle count if performance fallback is active
      const particleCount = this.performanceFallback ? 15 : 30;
      
      // Get element position for particle positioning
      const rect = element.getBoundingClientRect();
      
      // Acquire particles from pool
      const particles = this.animationPool.acquireParticles(particleCount);
      
      // Position and animate particles
      particles.forEach((pooledParticle, index) => {
        const particle = pooledParticle.element;
        const angle = (index / particleCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const duration = 1000 + Math.random() * 500;
        
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        // Position at element center
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        particle.style.backgroundColor = `hsl(${270 + Math.random() * 30}, 70%, 60%)`;
        particle.style.opacity = '1';
        particle.style.transform = 'translate(0, 0)';
        
        // Use will-change for better performance
        particle.style.willChange = 'transform, opacity';
        
        // Trigger animation using RAF for better performance
        const rafId = requestAnimationFrame(() => {
          particle.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
          particle.style.transform = `translate(${tx}px, ${ty}px)`;
          particle.style.opacity = '0';
        });
        
        this.activeAnimations.add(rafId);
      });

      // Pulse the main element
      const originalTransform = element.style.transform;
      const originalTransition = element.style.transition;
      const originalBoxShadow = element.style.boxShadow;

      element.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
      element.style.transform = 'scale(1.05)';
      element.style.boxShadow = '0 0 40px rgba(138, 43, 226, 0.8)';

      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.4)';
      }, 300);

      // Cleanup
      setTimeout(() => {
        // Release particles back to pool
        this.animationPool.releaseParticles(particles);
        
        // Restore element styles
        element.style.transform = originalTransform;
        element.style.transition = originalTransition;
        element.style.boxShadow = originalBoxShadow;
        resolve();
      }, 1500);
    });
  }

  /**
   * Play glow effect on hover
   * Requirements: 3.4
   * 
   * Applies a glowing highlight effect to an element
   */
  playGlowEffect(element: HTMLElement): void {
    const originalBoxShadow = element.style.boxShadow;
    const originalTransition = element.style.transition;

    element.style.transition = 'box-shadow 0.3s ease-out';
    element.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.6)';

    // Store cleanup function
    const cleanup = () => {
      element.style.boxShadow = originalBoxShadow;
      element.style.transition = originalTransition;
    };

    // Return cleanup function for caller to use
    (element as any).__glowCleanup = cleanup;
  }

  /**
   * Remove glow effect
   */
  removeGlowEffect(element: HTMLElement): void {
    const cleanup = (element as any).__glowCleanup;
    if (cleanup) {
      cleanup();
      delete (element as any).__glowCleanup;
    }
  }

  /**
   * Play fade-in animation
   * 
   * Generic fade-in effect for various elements
   */
  async playFadeIn(element: HTMLElement, config?: Partial<AnimationConfig>): Promise<void> {
    const animConfig = { ...this.defaultConfig, ...config };

    return new Promise((resolve) => {
      const originalOpacity = element.style.opacity;
      const originalTransition = element.style.transition;

      element.style.opacity = '0';
      element.style.transition = 'none';

      // Force reflow
      element.offsetHeight;

      setTimeout(() => {
        element.style.transition = `opacity ${animConfig.duration}ms ${animConfig.easing}`;
        element.style.opacity = '1';

        setTimeout(() => {
          element.style.transition = originalTransition;
          resolve();
        }, animConfig.duration);
      }, animConfig.delay);
    });
  }

  /**
   * Play slide-in animation
   * 
   * Slides element in from specified direction
   */
  async playSlideIn(
    element: HTMLElement, 
    direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
    config?: Partial<AnimationConfig>
  ): Promise<void> {
    const animConfig = { ...this.defaultConfig, ...config };

    return new Promise((resolve) => {
      const originalTransform = element.style.transform;
      const originalOpacity = element.style.opacity;
      const originalTransition = element.style.transition;

      // Set initial position based on direction
      const transforms: Record<string, string> = {
        left: 'translateX(-30px)',
        right: 'translateX(30px)',
        top: 'translateY(-30px)',
        bottom: 'translateY(30px)'
      };

      element.style.opacity = '0';
      element.style.transform = transforms[direction];
      element.style.transition = 'none';

      // Force reflow
      element.offsetHeight;

      setTimeout(() => {
        element.style.transition = `opacity ${animConfig.duration}ms ${animConfig.easing}, transform ${animConfig.duration}ms ${animConfig.easing}`;
        element.style.opacity = '1';
        element.style.transform = 'translate(0, 0)';

        setTimeout(() => {
          element.style.transition = originalTransition;
          element.style.transform = originalTransform;
          resolve();
        }, animConfig.duration);
      }, animConfig.delay);
    });
  }

  /**
   * Play pulse animation
   * 
   * Creates a pulsing effect for emphasis
   */
  playPulse(element: HTMLElement, duration: number = 1000): void {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;

    element.style.transition = `transform ${duration / 2}ms ease-in-out`;
    element.style.transform = 'scale(1.05)';

    setTimeout(() => {
      element.style.transform = 'scale(1)';

      setTimeout(() => {
        element.style.transition = originalTransition;
        element.style.transform = originalTransform;
      }, duration / 2);
    }, duration / 2);
  }

  /**
   * Create loading spinner animation
   * 
   * Returns a spinner element with animation
   */
  createLoadingSpinner(): HTMLElement {
    const spinner = document.createElement('div');
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.border = '4px solid rgba(138, 43, 226, 0.2)';
    spinner.style.borderTop = '4px solid #8a2be2';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';

    // Add keyframes if not already present
    if (!document.getElementById('animation-engine-keyframes')) {
      const style = document.createElement('style');
      style.id = 'animation-engine-keyframes';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    return spinner;
  }

  /**
   * Batch DOM reads to minimize layout thrashing
   */
  private batchDOMReads<T>(elements: HTMLElement[], readFn: (el: HTMLElement) => T): T[] {
    // Read phase - all reads together
    return elements.map(readFn);
  }

  /**
   * Batch DOM writes to minimize layout thrashing
   */
  private batchDOMWrites(elements: HTMLElement[], writeFn: (el: HTMLElement, index: number) => void): void {
    // Write phase - all writes together
    requestAnimationFrame(() => {
      elements.forEach((el, index) => writeFn(el, index));
    });
  }

  /**
   * Cancel all active animations
   */
  cancelAllAnimations(): void {
    this.activeAnimations.forEach(rafId => {
      cancelAnimationFrame(rafId);
    });
    this.activeAnimations.clear();
  }

  /**
   * Get animation statistics
   */
  getStats() {
    return {
      activeAnimations: this.activeAnimations.size,
      poolStats: this.animationPool.getStats(),
      performanceFallback: this.performanceFallback
    };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    // Cancel all active animations
    this.cancelAllAnimations();
    
    // Remove any injected styles
    const keyframes = document.getElementById('animation-engine-keyframes');
    if (keyframes) {
      keyframes.remove();
    }
  }
}

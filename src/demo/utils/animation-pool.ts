/**
 * Animation Pool
 * 
 * Implements object pooling for repeated animation effects to reduce GC pressure.
 * Reuses DOM elements for particle effects and other repeated animations.
 * 
 * Task: 14. Optimize performance for smooth demo experience
 */

/**
 * Pooled Particle Interface
 */
export interface PooledParticle {
  element: HTMLElement;
  inUse: boolean;
  reset: () => void;
}

/**
 * Animation Pool Class
 * Manages reusable animation elements
 */
export class AnimationPool {
  private particlePool: PooledParticle[] = [];
  private maxPoolSize: number;
  private particleContainer: HTMLElement | null = null;

  constructor(maxPoolSize: number = 50) {
    this.maxPoolSize = maxPoolSize;
  }

  /**
   * Initialize particle container
   */
  private ensureContainer(): HTMLElement {
    if (!this.particleContainer) {
      this.particleContainer = document.createElement('div');
      this.particleContainer.id = 'animation-pool-container';
      this.particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;
      document.body.appendChild(this.particleContainer);
    }
    return this.particleContainer;
  }

  /**
   * Get a particle from the pool
   */
  acquireParticle(): PooledParticle {
    // Try to find an unused particle
    let particle = this.particlePool.find(p => !p.inUse);

    if (!particle) {
      // Create new particle if pool not full
      if (this.particlePool.length < this.maxPoolSize) {
        particle = this.createParticle();
        this.particlePool.push(particle);
      } else {
        // Reuse oldest particle
        particle = this.particlePool[0];
        particle.reset();
      }
    }

    particle.inUse = true;
    particle.element.style.display = 'block';
    return particle;
  }

  /**
   * Release a particle back to the pool
   */
  releaseParticle(particle: PooledParticle): void {
    particle.inUse = false;
    particle.reset();
    particle.element.style.display = 'none';
  }

  /**
   * Create a new particle
   */
  private createParticle(): PooledParticle {
    const container = this.ensureContainer();
    const element = document.createElement('div');
    
    element.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #8a2be2;
      box-shadow: 0 0 6px currentColor;
      display: none;
      will-change: transform, opacity;
    `;
    
    container.appendChild(element);

    const reset = () => {
      element.style.transform = 'translate(0, 0)';
      element.style.opacity = '1';
      element.style.transition = 'none';
      element.style.left = '0';
      element.style.top = '0';
    };

    return {
      element,
      inUse: false,
      reset
    };
  }

  /**
   * Acquire multiple particles at once
   */
  acquireParticles(count: number): PooledParticle[] {
    const particles: PooledParticle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(this.acquireParticle());
    }
    return particles;
  }

  /**
   * Release multiple particles at once
   */
  releaseParticles(particles: PooledParticle[]): void {
    particles.forEach(p => this.releaseParticle(p));
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      total: this.particlePool.length,
      inUse: this.particlePool.filter(p => p.inUse).length,
      available: this.particlePool.filter(p => !p.inUse).length
    };
  }

  /**
   * Clear and dispose pool
   */
  dispose(): void {
    this.particlePool.forEach(particle => {
      particle.element.remove();
    });
    this.particlePool = [];

    if (this.particleContainer) {
      this.particleContainer.remove();
      this.particleContainer = null;
    }
  }
}

/**
 * Global animation pool instance
 */
let globalPool: AnimationPool | null = null;

/**
 * Get global animation pool
 */
export function getAnimationPool(): AnimationPool {
  if (!globalPool) {
    globalPool = new AnimationPool();
  }
  return globalPool;
}

/**
 * Dispose global animation pool
 */
export function disposeAnimationPool(): void {
  if (globalPool) {
    globalPool.dispose();
    globalPool = null;
  }
}

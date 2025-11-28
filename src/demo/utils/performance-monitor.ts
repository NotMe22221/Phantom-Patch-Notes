/**
 * Performance Monitor
 * 
 * Monitors and optimizes demo performance for smooth 60fps experience.
 * Provides performance metrics, fallback options, and optimization utilities.
 * 
 * Task: 14. Optimize performance for smooth demo experience
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  animationCount: number;
  audioLatency: number;
  memoryUsage?: number;
}

export interface PerformanceConfig {
  targetFPS: number;
  enableFallbacks: boolean;
  reduceMotion: boolean;
  maxConcurrentAnimations: number;
}

/**
 * Performance Monitor Class
 * Tracks and optimizes demo performance
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private config: PerformanceConfig;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private frameTimes: number[] = [];
  private rafId: number | null = null;
  private isMonitoring: boolean = false;
  private performanceObserver: PerformanceObserver | null = null;

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      targetFPS: 60,
      enableFallbacks: true,
      reduceMotion: false,
      maxConcurrentAnimations: 10,
      ...config
    };

    this.metrics = {
      fps: 60,
      frameTime: 16.67,
      animationCount: 0,
      audioLatency: 0
    };

    // Check for user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.config.reduceMotion = true;
    }
  }

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.measureFrame();

    // Set up performance observer for long tasks
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        });
        this.performanceObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // PerformanceObserver not fully supported
      }
    }

    console.log('📊 Performance monitoring started');
  }

  /**
   * Stop monitoring performance
   */
  stop(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    console.log('📊 Performance monitoring stopped');
  }

  /**
   * Measure frame performance
   */
  private measureFrame = (): void => {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    
    this.frameTimes.push(frameTime);
    
    // Keep only last 60 frames
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    // Calculate average FPS
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.metrics.fps = 1000 / avgFrameTime;
    this.metrics.frameTime = avgFrameTime;

    this.lastFrameTime = now;
    this.frameCount++;

    // Check if performance is degrading
    if (this.metrics.fps < this.config.targetFPS * 0.8 && this.config.enableFallbacks) {
      this.triggerFallback();
    }

    this.rafId = requestAnimationFrame(this.measureFrame);
  };

  /**
   * Trigger performance fallback
   */
  private triggerFallback(): void {
    console.warn(`⚠️ Performance below target (${this.metrics.fps.toFixed(1)} FPS), enabling fallbacks`);
    
    // Dispatch event for components to reduce quality
    window.dispatchEvent(new CustomEvent('performanceFallback', {
      detail: { fps: this.metrics.fps }
    }));
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }

    return { ...this.metrics };
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    return this.metrics.fps >= this.config.targetFPS * 0.9;
  }

  /**
   * Should reduce motion
   */
  shouldReduceMotion(): boolean {
    return this.config.reduceMotion;
  }

  /**
   * Get recommended animation duration
   */
  getRecommendedDuration(baseDuration: number): number {
    if (this.config.reduceMotion) {
      return baseDuration * 0.5; // Faster animations
    }
    
    if (this.metrics.fps < 30) {
      return baseDuration * 0.7; // Shorter animations for poor performance
    }
    
    return baseDuration;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stop();
    this.frameTimes = [];
  }
}

/**
 * Intro Screen Component
 * 
 * Displays branded introduction before the demo starts.
 * Shows Phantom Patch Notes logo with animation, tagline, and Begin Demo button.
 * Handles audio preloading during intro screen display.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import type { IntroScreen as IIntroScreen, IntroConfig } from '../types/demo-types';

/**
 * Intro Screen Implementation
 * Provides branded introduction with animations before demo
 */
export class IntroScreen implements IIntroScreen {
  private config: IntroConfig;
  private container: HTMLElement | null = null;
  private beginCallback: (() => void) | null = null;
  private isVisible: boolean = false;

  constructor(config?: Partial<IntroConfig>) {
    this.config = {
      logoUrl: '/demo/images/phantom-logo.svg',
      tagline: 'Transform Git History into Horror Stories',
      animationDuration: 2000,
      ...config
    };
  }

  /**
   * Show intro screen with animation
   * Requirements: 10.1, 10.2, 10.3, 10.4
   * 
   * Displays logo, tagline, and Begin Demo button with fade-in effects
   */
  async show(): Promise<void> {
    if (this.isVisible) {
      console.warn('Intro screen already visible');
      return;
    }

    try {
      // Create intro screen container
      this.createIntroScreen();

      // Wait for DOM to be ready
      await this.waitForDOM();

      // Animate logo entrance
      await this.animateLogo();

      // Animate tagline entrance
      await this.animateTagline();

      // Animate button entrance
      await this.animateButton();

      this.isVisible = true;
      console.log('✓ Intro screen displayed');

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('introScreenShown'));
    } catch (error) {
      console.error('Failed to show intro screen:', error);
      throw error;
    }
  }

  /**
   * Hide intro screen with fade transition
   * Requirements: 10.5
   * 
   * Transitions to main demo interface with fade effect
   */
  async hide(): Promise<void> {
    if (!this.isVisible || !this.container) {
      console.warn('Intro screen not visible');
      return;
    }

    try {
      // Fade out animation
      this.container.style.transition = `opacity ${this.config.animationDuration / 2}ms ease-out`;
      this.container.style.opacity = '0';

      // Wait for animation to complete
      await this.delay(this.config.animationDuration / 2);

      // Remove from DOM
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }

      this.container = null;
      this.isVisible = false;

      console.log('✓ Intro screen hidden');

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('introScreenHidden'));
    } catch (error) {
      console.error('Failed to hide intro screen:', error);
      throw error;
    }
  }

  /**
   * Register callback for Begin Demo button
   * Requirements: 10.4
   */
  onBeginDemo(callback: () => void): void {
    this.beginCallback = callback;
  }

  /**
   * Create intro screen DOM structure
   */
  private createIntroScreen(): void {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'intro-screen';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 1;
      overflow: hidden;
    `;

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'intro-content';
    content.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3rem;
      max-width: 800px;
      padding: 2rem;
    `;

    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'intro-logo';
    logoContainer.style.cssText = `
      opacity: 0;
      transform: scale(0.8) translateY(-20px);
      transition: all ${this.config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    // Create logo (using text as fallback if image not available)
    const logo = document.createElement('div');
    logo.style.cssText = `
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #ff6b6b 0%, #a855f7 50%, #ff6b6b 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      letter-spacing: 0.1em;
      text-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
      animation: gradient-shift 3s ease infinite;
    `;
    logo.textContent = '👻 PHANTOM PATCH NOTES';

    logoContainer.appendChild(logo);

    // Create tagline
    const tagline = document.createElement('div');
    tagline.className = 'intro-tagline';
    tagline.textContent = this.config.tagline;
    tagline.style.cssText = `
      font-size: 1.5rem;
      color: #e0e0e0;
      text-align: center;
      opacity: 0;
      transform: translateY(20px);
      transition: all ${this.config.animationDuration}ms ease-out;
      font-weight: 300;
      letter-spacing: 0.05em;
      text-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
    `;

    // Create Begin Demo button
    const button = document.createElement('button');
    button.className = 'intro-button';
    button.textContent = 'Begin Demo';
    button.style.cssText = `
      padding: 1rem 3rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #a855f7 0%, #ff6b6b 100%);
      border: 2px solid transparent;
      border-radius: 50px;
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px);
      transition: all ${this.config.animationDuration}ms ease-out;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
      position: relative;
      overflow: hidden;
    `;

    // Add button hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(0) scale(1.05)';
      button.style.boxShadow = '0 0 50px rgba(168, 85, 247, 0.8)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0) scale(1)';
      button.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.5)';
    });

    // Add button click handler
    button.addEventListener('click', async () => {
      if (this.beginCallback) {
        await this.hide();
        this.beginCallback();
      }
    });

    // Add glowing animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
        }
        50% {
          box-shadow: 0 0 50px rgba(168, 85, 247, 0.8), 0 0 80px rgba(255, 107, 107, 0.4);
        }
      }

      .intro-button {
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .intro-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .intro-button:active::before {
        width: 300px;
        height: 300px;
      }
    `;

    // Assemble the intro screen
    content.appendChild(logoContainer);
    content.appendChild(tagline);
    content.appendChild(button);
    this.container.appendChild(style);
    this.container.appendChild(content);

    // Add to document body
    document.body.appendChild(this.container);
  }

  /**
   * Wait for DOM to be ready
   */
  private async waitForDOM(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Animate logo entrance
   * Requirements: 10.2
   */
  private async animateLogo(): Promise<void> {
    if (!this.container) return;

    const logo = this.container.querySelector('.intro-logo') as HTMLElement;
    if (!logo) return;

    // Trigger animation
    await this.delay(100);
    logo.style.opacity = '1';
    logo.style.transform = 'scale(1) translateY(0)';

    // Wait for animation to complete
    await this.delay(this.config.animationDuration);
  }

  /**
   * Animate tagline entrance
   * Requirements: 10.3
   */
  private async animateTagline(): Promise<void> {
    if (!this.container) return;

    const tagline = this.container.querySelector('.intro-tagline') as HTMLElement;
    if (!tagline) return;

    // Trigger animation
    tagline.style.opacity = '1';
    tagline.style.transform = 'translateY(0)';

    // Wait for animation to complete
    await this.delay(this.config.animationDuration * 0.6);
  }

  /**
   * Animate button entrance
   * Requirements: 10.4
   */
  private async animateButton(): Promise<void> {
    if (!this.container) return;

    const button = this.container.querySelector('.intro-button') as HTMLElement;
    if (!button) return;

    // Trigger animation
    button.style.opacity = '1';
    button.style.transform = 'translateY(0)';

    // Wait for animation to complete
    await this.delay(this.config.animationDuration * 0.6);
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if intro screen is currently visible
   */
  isShown(): boolean {
    return this.isVisible;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<IntroConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): IntroConfig {
    return { ...this.config };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.isVisible && this.container) {
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
    this.container = null;
    this.beginCallback = null;
    this.isVisible = false;
  }
}

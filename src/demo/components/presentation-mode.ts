/**
 * Presentation Mode Manager Component
 * 
 * Controls full-screen presentation layout optimized for live demonstrations.
 * Handles font scaling, element visibility, and full-screen API with fallbacks.
 * Stores original state for restoration when exiting presentation mode.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import type { PresentationMode as IPresentationMode, PresentationConfig } from '../types/demo-types';

/**
 * Original UI State
 * Stores the original state of UI elements for restoration
 */
interface OriginalState {
  fontSizes: Map<HTMLElement, string>;
  visibility: Map<HTMLElement, string>;
  display: Map<HTMLElement, string>;
  showcaseDisplay: string | null;
  rootFontSize: string;
}

/**
 * Presentation Mode Manager Implementation
 * Provides full-screen, distraction-free viewing mode for presentations
 */
export class PresentationModeManager implements IPresentationMode {
  private _isActive: boolean = false;
  private config: PresentationConfig;
  private originalState: OriginalState | null = null;
  private fullscreenElement: HTMLElement | null = null;

  constructor(config?: Partial<PresentationConfig>) {
    this.config = {
      fontScale: 1.5, // 50% increase
      hiddenElements: [
        'input[type="text"]',
        'input[type="file"]',
        '.config-panel',
        '.settings-panel',
        '.input-field',
        '.configuration-options'
      ],
      showcaseVisible: true,
      ...config
    };
  }

  /**
   * Check if presentation mode is currently active
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Activate presentation mode
   * Requirements: 4.1, 4.2, 4.3, 4.4
   * 
   * Enters full-screen, scales fonts, and hides non-essential UI elements
   */
  activate(): void {
    if (this._isActive) {
      console.warn('Presentation mode already active');
      return;
    }

    try {
      // Store original state before making changes
      this.storeOriginalState();

      // Enter full-screen mode
      this.enterFullScreen();

      // Scale fonts
      this.scaleFonts();

      // Hide non-essential elements
      this.hideNonEssentialElements();

      // Show theme showcase if configured
      if (this.config.showcaseVisible) {
        this.showThemeShowcase();
      }

      this._isActive = true;
      console.log('✓ Presentation mode activated');

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('presentationModeChanged', { 
        detail: { active: true } 
      }));
    } catch (error) {
      console.error('Failed to activate presentation mode:', error);
      // Attempt to restore state if activation fails
      this.restoreOriginalState();
    }
  }

  /**
   * Deactivate presentation mode
   * Requirements: 4.5
   * 
   * Exits full-screen and restores original UI layout and font sizes
   */
  deactivate(): void {
    if (!this._isActive) {
      console.warn('Presentation mode not active');
      return;
    }

    try {
      // Exit full-screen mode
      this.exitFullScreen();

      // Restore original state
      this.restoreOriginalState();

      this._isActive = false;
      console.log('✓ Presentation mode deactivated');

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('presentationModeChanged', { 
        detail: { active: false } 
      }));
    } catch (error) {
      console.error('Failed to deactivate presentation mode:', error);
    }
  }

  /**
   * Get current font scale factor
   */
  getFontScale(): number {
    return this._isActive ? this.config.fontScale : 1.0;
  }

  /**
   * Toggle presentation mode on/off
   */
  toggle(): void {
    if (this._isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  /**
   * Store original UI state for restoration
   */
  private storeOriginalState(): void {
    this.originalState = {
      fontSizes: new Map(),
      visibility: new Map(),
      display: new Map(),
      showcaseDisplay: null,
      rootFontSize: ''
    };

    // Store root font size
    const rootElement = document.documentElement;
    this.originalState.rootFontSize = window.getComputedStyle(rootElement).fontSize;

    // Store font sizes of all text elements
    const textElements = document.querySelectorAll('body, p, h1, h2, h3, h4, h5, h6, span, div, li, td, th, label, button');
    textElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      this.originalState!.fontSizes.set(htmlElement, computedStyle.fontSize);
    });

    // Store visibility and display of elements to be hidden
    this.config.hiddenElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        this.originalState!.visibility.set(htmlElement, computedStyle.visibility);
        this.originalState!.display.set(htmlElement, computedStyle.display);
      });
    });

    // Store showcase display state
    const showcase = document.querySelector('.theme-showcase');
    if (showcase) {
      const showcaseElement = showcase as HTMLElement;
      this.originalState.showcaseDisplay = window.getComputedStyle(showcaseElement).display;
    }
  }

  /**
   * Restore original UI state
   */
  private restoreOriginalState(): void {
    if (!this.originalState) {
      return;
    }

    // Restore root font size
    const rootElement = document.documentElement;
    rootElement.style.fontSize = this.originalState.rootFontSize;

    // Restore font sizes
    this.originalState.fontSizes.forEach((fontSize, element) => {
      element.style.fontSize = '';
    });

    // Restore visibility and display
    this.originalState.visibility.forEach((visibility, element) => {
      element.style.visibility = '';
    });

    this.originalState.display.forEach((display, element) => {
      element.style.display = '';
    });

    // Restore showcase display
    if (this.originalState.showcaseDisplay !== null) {
      const showcase = document.querySelector('.theme-showcase');
      if (showcase) {
        (showcase as HTMLElement).style.display = '';
      }
    }

    // Clear stored state
    this.originalState = null;
  }

  /**
   * Enter full-screen mode
   * Requirements: 4.1
   * 
   * Uses Full-Screen API with fallback for unsupported browsers
   */
  private enterFullScreen(): void {
    // Get the element to make fullscreen (typically document.documentElement or body)
    this.fullscreenElement = document.documentElement;

    // Check if Full-Screen API is supported
    if (this.isFullScreenSupported()) {
      const element = this.fullscreenElement as any;

      // Try different vendor-prefixed methods
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((error: Error) => {
          console.warn('Failed to enter fullscreen:', error);
          this.fallbackFullScreen();
        });
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else {
        this.fallbackFullScreen();
      }
    } else {
      // Fallback for browsers without Full-Screen API
      this.fallbackFullScreen();
    }
  }

  /**
   * Exit full-screen mode
   */
  private exitFullScreen(): void {
    if (this.isFullScreenSupported() && this.isCurrentlyFullScreen()) {
      const doc = document as any;

      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch((error: Error) => {
          console.warn('Failed to exit fullscreen:', error);
        });
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }

    // Remove fallback styles
    if (this.fullscreenElement) {
      this.fullscreenElement.style.position = '';
      this.fullscreenElement.style.top = '';
      this.fullscreenElement.style.left = '';
      this.fullscreenElement.style.width = '';
      this.fullscreenElement.style.height = '';
      this.fullscreenElement.style.zIndex = '';
      this.fullscreenElement.style.backgroundColor = '';
    }
  }

  /**
   * Check if Full-Screen API is supported
   */
  private isFullScreenSupported(): boolean {
    const doc = document as any;
    return !!(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
  }

  /**
   * Check if currently in full-screen mode
   */
  private isCurrentlyFullScreen(): boolean {
    const doc = document as any;
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  /**
   * Fallback full-screen mode for unsupported browsers
   * 
   * Maximizes the window using CSS instead of Full-Screen API
   */
  private fallbackFullScreen(): void {
    if (!this.fullscreenElement) {
      return;
    }

    console.log('Using fallback fullscreen mode');

    // Apply CSS to simulate full-screen
    this.fullscreenElement.style.position = 'fixed';
    this.fullscreenElement.style.top = '0';
    this.fullscreenElement.style.left = '0';
    this.fullscreenElement.style.width = '100vw';
    this.fullscreenElement.style.height = '100vh';
    this.fullscreenElement.style.zIndex = '9999';
    this.fullscreenElement.style.backgroundColor = '#000';
  }

  /**
   * Scale fonts by configured factor
   * Requirements: 4.2
   * 
   * Increases all font sizes by 50% for better visibility
   */
  private scaleFonts(): void {
    if (!this.originalState) {
      return;
    }

    // Scale root font size
    const rootElement = document.documentElement;
    const currentRootSize = parseFloat(this.originalState.rootFontSize);
    rootElement.style.fontSize = `${currentRootSize * this.config.fontScale}px`;

    // Scale individual element font sizes
    this.originalState.fontSizes.forEach((originalSize, element) => {
      const currentSize = parseFloat(originalSize);
      if (!isNaN(currentSize)) {
        element.style.fontSize = `${currentSize * this.config.fontScale}px`;
      }
    });
  }

  /**
   * Hide non-essential UI elements
   * Requirements: 4.3
   * 
   * Hides input fields, configuration options, and other non-essential elements
   */
  private hideNonEssentialElements(): void {
    this.config.hiddenElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.display = 'none';
      });
    });
  }

  /**
   * Show theme showcase
   * Requirements: 4.4
   * 
   * Makes the theme showcase visible in presentation mode
   */
  private showThemeShowcase(): void {
    const showcase = document.querySelector('.theme-showcase');
    if (showcase) {
      (showcase as HTMLElement).style.display = 'block';
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PresentationConfig>): void {
    this.config = { ...this.config, ...config };

    // If presentation mode is active, reapply changes
    if (this._isActive) {
      this.deactivate();
      this.activate();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): PresentationConfig {
    return { ...this.config };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this._isActive) {
      this.deactivate();
    }
    this.originalState = null;
    this.fullscreenElement = null;
  }
}

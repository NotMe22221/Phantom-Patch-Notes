/**
 * Keyboard Controller Component
 * 
 * Handles keyboard shortcuts for demo control.
 * Provides smooth navigation through presentation without clicking.
 * Prevents conflicts with browser shortcuts.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import type { 
  KeyboardController as IKeyboardController, 
  KeyboardShortcut,
  AutoPlayController,
  PresentationMode
} from '../types/demo-types';

/**
 * Keyboard Controller Implementation
 * Manages keyboard shortcuts for demo control
 */
export class KeyboardController implements IKeyboardController {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isInitialized: boolean = false;
  private boundKeyHandler: ((event: KeyboardEvent) => void) | null = null;
  private helpOverlayVisible: boolean = false;
  private helpOverlayElement: HTMLElement | null = null;

  // Optional integrations
  private autoPlayController: AutoPlayController | null = null;
  private presentationMode: PresentationMode | null = null;

  constructor(
    autoPlayController?: AutoPlayController,
    presentationMode?: PresentationMode
  ) {
    this.autoPlayController = autoPlayController || null;
    this.presentationMode = presentationMode || null;
  }

  /**
   * Initialize keyboard event listeners
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
   * 
   * Sets up keyboard listeners and registers default shortcuts
   */
  initialize(): void {
    if (this.isInitialized) {
      console.warn('Keyboard controller already initialized');
      return;
    }

    // Create bound handler for cleanup
    this.boundKeyHandler = this.handleKeyPress.bind(this);

    // Add keyboard event listener
    document.addEventListener('keydown', this.boundKeyHandler);

    // Register default shortcuts
    this.registerDefaultShortcuts();

    // Create help overlay
    this.createHelpOverlay();

    this.isInitialized = true;
    console.log('✓ Keyboard controller initialized');
  }

  /**
   * Register a keyboard shortcut
   * 
   * @param key - The key to bind (e.g., 'Space', 'F', 'ArrowRight')
   * @param handler - The function to call when the key is pressed
   */
  registerShortcut(key: string, handler: () => void, description: string = ''): void {
    const normalizedKey = this.normalizeKey(key);
    
    this.shortcuts.set(normalizedKey, {
      key: normalizedKey,
      description,
      handler
    });

    console.log(`Registered shortcut: ${normalizedKey}`);
  }

  /**
   * Unregister a keyboard shortcut
   * 
   * @param key - The key to unbind
   */
  unregisterShortcut(key: string): void {
    const normalizedKey = this.normalizeKey(key);
    
    if (this.shortcuts.has(normalizedKey)) {
      this.shortcuts.delete(normalizedKey);
      console.log(`Unregistered shortcut: ${normalizedKey}`);
    }
  }

  /**
   * Register default keyboard shortcuts
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
   */
  private registerDefaultShortcuts(): void {
    // Requirement 8.1: Space key toggles auto-play mode
    this.registerShortcut(' ', () => {
      if (this.autoPlayController) {
        if (this.autoPlayController.isActive) {
          this.autoPlayController.stop();
          console.log('⏹ Auto-play stopped (Space)');
        } else {
          this.autoPlayController.start();
          console.log('▶ Auto-play started (Space)');
        }
      } else {
        console.warn('Auto-play controller not available');
      }
    }, 'Toggle auto-play mode');

    // Requirement 8.2: F key toggles presentation mode
    this.registerShortcut('f', () => {
      if (this.presentationMode) {
        this.presentationMode.toggle();
        console.log(`${this.presentationMode.isActive ? '⛶' : '⛶'} Presentation mode toggled (F)`);
      } else {
        console.warn('Presentation mode not available');
      }
    }, 'Toggle presentation mode');

    // Requirement 8.3: Right arrow advances to next demo step
    this.registerShortcut('ArrowRight', () => {
      if (this.autoPlayController) {
        this.autoPlayController.nextStep();
        console.log('→ Advanced to next step (Right Arrow)');
      } else {
        console.warn('Auto-play controller not available');
      }
    }, 'Advance to next demo step');

    // Requirement 8.4: Left arrow returns to previous demo step
    this.registerShortcut('ArrowLeft', () => {
      if (this.autoPlayController) {
        this.autoPlayController.previousStep();
        console.log('← Returned to previous step (Left Arrow)');
      } else {
        console.warn('Auto-play controller not available');
      }
    }, 'Return to previous demo step');

    // Requirement 8.5: R key resets demo to initial state
    this.registerShortcut('r', () => {
      if (this.autoPlayController) {
        this.autoPlayController.reset();
        console.log('↻ Demo reset (R)');
        
        // Dispatch reset event for other components
        window.dispatchEvent(new CustomEvent('demoReset'));
      } else {
        console.warn('Auto-play controller not available');
      }
    }, 'Reset demo to initial state');

    // ? key shows keyboard shortcut help overlay
    this.registerShortcut('?', () => {
      this.toggleHelpOverlay();
    }, 'Show/hide keyboard shortcuts help');

    // Escape key hides help overlay
    this.registerShortcut('Escape', () => {
      if (this.helpOverlayVisible) {
        this.hideHelpOverlay();
      }
    }, 'Hide help overlay');
  }

  /**
   * Handle keyboard press events
   * 
   * Prevents conflicts with browser shortcuts
   */
  private handleKeyPress(event: KeyboardEvent): void {
    // Don't handle shortcuts if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Normalize the key
    const key = this.normalizeKey(event.key);

    // Check if we have a handler for this key
    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      // Prevent default browser behavior for registered shortcuts
      event.preventDefault();
      event.stopPropagation();

      // Execute the handler
      try {
        shortcut.handler();
      } catch (error) {
        console.error(`Error executing shortcut handler for ${key}:`, error);
      }
    }
  }

  /**
   * Normalize key names for consistent handling
   * 
   * @param key - The key from the keyboard event
   * @returns Normalized key name
   */
  private normalizeKey(key: string): string {
    // Handle special cases
    const keyMap: Record<string, string> = {
      ' ': ' ', // Space
      'Spacebar': ' ',
      '/': '?', // Shift+/ = ?
    };

    // Check if it's a special key
    if (keyMap[key]) {
      return keyMap[key];
    }

    // For letter keys, use lowercase
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
      return key.toLowerCase();
    }

    // Return as-is for arrow keys and other special keys
    return key;
  }

  /**
   * Create keyboard shortcut help overlay
   */
  private createHelpOverlay(): void {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'keyboard-help-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    // Create help content
    const content = document.createElement('div');
    content.className = 'keyboard-help-content';
    content.style.cssText = `
      background: #1a1a1a;
      border: 2px solid #8b0000;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      box-shadow: 0 0 30px rgba(139, 0, 0, 0.5);
    `;

    // Create title
    const title = document.createElement('h2');
    title.textContent = '⌨️ Keyboard Shortcuts';
    title.style.cssText = `
      color: #ff4444;
      margin: 0 0 1.5rem 0;
      font-size: 1.8rem;
      text-align: center;
      text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
    `;
    content.appendChild(title);

    // Create shortcuts list
    const list = document.createElement('div');
    list.className = 'shortcuts-list';
    list.style.cssText = `
      display: grid;
      gap: 1rem;
    `;

    // Add shortcuts to list
    const shortcutData = [
      { key: 'Space', description: 'Toggle auto-play mode' },
      { key: 'F', description: 'Toggle presentation mode' },
      { key: '→', description: 'Advance to next demo step' },
      { key: '←', description: 'Return to previous demo step' },
      { key: 'R', description: 'Reset demo to initial state' },
      { key: '?', description: 'Show/hide this help' },
      { key: 'Esc', description: 'Close this help' }
    ];

    shortcutData.forEach(({ key, description }) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: rgba(139, 0, 0, 0.1);
        border-radius: 4px;
      `;

      const keyElement = document.createElement('kbd');
      keyElement.textContent = key;
      keyElement.style.cssText = `
        background: #2a2a2a;
        border: 1px solid #8b0000;
        border-radius: 4px;
        padding: 0.25rem 0.75rem;
        font-family: monospace;
        font-size: 1rem;
        color: #ff4444;
        min-width: 60px;
        text-align: center;
      `;

      const descElement = document.createElement('span');
      descElement.textContent = description;
      descElement.style.cssText = `
        color: #ccc;
        font-size: 0.95rem;
        flex: 1;
        margin-left: 1rem;
      `;

      item.appendChild(keyElement);
      item.appendChild(descElement);
      list.appendChild(item);
    });

    content.appendChild(list);

    // Add close instruction
    const closeText = document.createElement('p');
    closeText.textContent = 'Press ? or Esc to close';
    closeText.style.cssText = `
      text-align: center;
      color: #888;
      margin: 1.5rem 0 0 0;
      font-size: 0.9rem;
    `;
    content.appendChild(closeText);

    overlay.appendChild(content);

    // Add click to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hideHelpOverlay();
      }
    });

    // Add to document
    document.body.appendChild(overlay);
    this.helpOverlayElement = overlay;
  }

  /**
   * Toggle help overlay visibility
   */
  private toggleHelpOverlay(): void {
    if (this.helpOverlayVisible) {
      this.hideHelpOverlay();
    } else {
      this.showHelpOverlay();
    }
  }

  /**
   * Show help overlay
   */
  private showHelpOverlay(): void {
    if (this.helpOverlayElement) {
      this.helpOverlayElement.style.display = 'flex';
      this.helpOverlayVisible = true;
      console.log('📖 Keyboard shortcuts help shown');
    }
  }

  /**
   * Hide help overlay
   */
  private hideHelpOverlay(): void {
    if (this.helpOverlayElement) {
      this.helpOverlayElement.style.display = 'none';
      this.helpOverlayVisible = false;
      console.log('📖 Keyboard shortcuts help hidden');
    }
  }

  /**
   * Set auto-play controller integration
   */
  setAutoPlayController(controller: AutoPlayController): void {
    this.autoPlayController = controller;
  }

  /**
   * Set presentation mode integration
   */
  setPresentationMode(mode: PresentationMode): void {
    this.presentationMode = mode;
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Remove event listener
    if (this.boundKeyHandler) {
      document.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }

    // Remove help overlay
    if (this.helpOverlayElement && this.helpOverlayElement.parentNode) {
      this.helpOverlayElement.parentNode.removeChild(this.helpOverlayElement);
      this.helpOverlayElement = null;
    }

    // Clear shortcuts
    this.shortcuts.clear();

    // Clear integrations
    this.autoPlayController = null;
    this.presentationMode = null;

    this.isInitialized = false;
    console.log('✓ Keyboard controller disposed');
  }
}

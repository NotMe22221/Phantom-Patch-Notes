/**
 * Theme Showcase Component
 * 
 * Displays side-by-side comparison of original and themed commits.
 * Shows transformation power with highlighted vocabulary changes.
 * Provides tooltips showing original text on hover.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import type { 
  ThemeShowcase as IThemeShowcase, 
  ShowcaseEntry,
  TextHighlight
} from '../types/demo-types';
import type { CommitData } from '../../shared/types';

/**
 * Patch Note Entry Interface
 * Represents a themed patch note entry
 */
interface PatchNoteEntry {
  themed: string;
  original: string;
  commitHash: string;
}

/**
 * Theme Showcase Implementation
 * Provides visual comparison of original and horror-themed commits
 */
export class ThemeShowcase implements IThemeShowcase {
  private container: HTMLElement | null = null;
  private showcaseEntries: ShowcaseEntry[] = [];
  private currentIndex: number = 0;
  private animationInterval: number | null = null;

  /**
   * Render the showcase UI structure
   * Requirements: 6.1, 6.2
   * 
   * Creates side-by-side panels for original and themed text
   */
  render(container: HTMLElement): void {
    this.container = container;

    // Create showcase wrapper
    const showcase = document.createElement('div');
    showcase.className = 'theme-showcase';
    showcase.style.cssText = `
      display: none;
      background: var(--color-shadow, #1a1a1a);
      border: 2px solid var(--color-spectral, #4a0e4e);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 15px rgba(74, 14, 78, 0.3);
    `;

    // Create header
    const header = document.createElement('div');
    header.className = 'showcase-header';
    header.style.cssText = `
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--color-mist, #2a2a2a);
    `;

    const title = document.createElement('h3');
    title.textContent = 'Transformation Showcase';
    title.style.cssText = `
      font-family: 'Creepster', cursive;
      font-size: 1.8rem;
      color: var(--color-blood, #8b0000);
      text-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
      margin-bottom: 0.5rem;
    `;

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Witness the horror transformation';
    subtitle.style.cssText = `
      color: var(--color-phantom, #b0b0b0);
      font-style: italic;
      font-size: 0.95rem;
    `;

    header.appendChild(title);
    header.appendChild(subtitle);

    // Create comparison container
    const comparison = document.createElement('div');
    comparison.className = 'showcase-comparison';
    comparison.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1rem;
    `;

    // Create original panel (left)
    const originalPanel = this.createPanel('Original Commit', 'showcase-original');
    
    // Create themed panel (right)
    const themedPanel = this.createPanel('Horror Themed', 'showcase-themed');

    comparison.appendChild(originalPanel);
    comparison.appendChild(themedPanel);

    // Create navigation controls
    const controls = document.createElement('div');
    controls.className = 'showcase-controls';
    controls.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    `;

    const prevButton = this.createControlButton('← Previous', () => this.showPrevious());
    const nextButton = this.createControlButton('Next →', () => this.showNext());

    controls.appendChild(prevButton);
    controls.appendChild(nextButton);

    // Assemble showcase
    showcase.appendChild(header);
    showcase.appendChild(comparison);
    showcase.appendChild(controls);

    // Add to container
    container.appendChild(showcase);

    console.log('✓ Theme Showcase rendered');
  }

  /**
   * Create a panel for original or themed text
   * Requirements: 6.1, 6.2
   */
  private createPanel(title: string, className: string): HTMLElement {
    const panel = document.createElement('div');
    panel.className = `showcase-panel ${className}`;
    panel.style.cssText = `
      background: var(--color-void, #0a0a0a);
      border: 2px solid var(--color-mist, #2a2a2a);
      border-radius: 6px;
      padding: 1rem;
      min-height: 150px;
    `;

    const panelTitle = document.createElement('h4');
    panelTitle.textContent = title;
    panelTitle.style.cssText = `
      font-size: 1rem;
      color: ${className === 'showcase-original' 
        ? 'var(--color-phantom, #b0b0b0)' 
        : 'var(--color-blood, #8b0000)'};
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
    `;

    const content = document.createElement('div');
    content.className = `${className}-content`;
    content.style.cssText = `
      color: var(--color-ghost, #e0e0e0);
      line-height: 1.6;
      font-size: 0.95rem;
      min-height: 100px;
    `;

    panel.appendChild(panelTitle);
    panel.appendChild(content);

    return panel;
  }

  /**
   * Create a control button
   */
  private createControlButton(text: string, onClick: () => void): HTMLElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'showcase-control-btn';
    button.style.cssText = `
      padding: 0.5rem 1.5rem;
      background: var(--color-spectral, #4a0e4e);
      color: var(--color-ghost, #e0e0e0);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(74, 14, 78, 0.4);
    `;

    button.addEventListener('mouseenter', () => {
      button.style.background = 'var(--color-spectral-light, #6a1b6e)';
      button.style.boxShadow = '0 4px 15px rgba(74, 14, 78, 0.6)';
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'var(--color-spectral, #4a0e4e)';
      button.style.boxShadow = '0 2px 10px rgba(74, 14, 78, 0.4)';
      button.style.transform = 'translateY(0)';
    });

    button.addEventListener('click', onClick);

    return button;
  }

  /**
   * Update showcase with new commit data
   * Requirements: 6.1, 6.2, 6.3, 6.4
   * 
   * Displays original and themed commits with highlighted transformations
   */
  update(commits: CommitData[], patchNotes: PatchNoteEntry[]): void {
    if (!this.container) {
      console.warn('Showcase not rendered yet');
      return;
    }

    // Build showcase entries by matching commits with patch notes
    this.showcaseEntries = [];

    patchNotes.forEach(note => {
      const commit = commits.find(c => c.hash === note.commitHash);
      if (commit) {
        const highlights = this.findTransformations(commit.message, note.themed);
        
        this.showcaseEntries.push({
          original: commit.message,
          themed: note.themed,
          highlights
        });
      }
    });

    // Show the showcase if we have entries
    if (this.showcaseEntries.length > 0) {
      const showcase = this.container.querySelector('.theme-showcase') as HTMLElement;
      if (showcase) {
        showcase.style.display = 'block';
      }

      // Display first entry
      this.currentIndex = 0;
      this.displayCurrentEntry();

      // Start auto-rotation
      this.startAutoRotation();

      console.log(`✓ Theme Showcase updated with ${this.showcaseEntries.length} entries`);
    }
  }

  /**
   * Display the current showcase entry
   * Requirements: 6.1, 6.2, 6.3
   */
  private displayCurrentEntry(): void {
    if (!this.container || this.showcaseEntries.length === 0) {
      return;
    }

    const entry = this.showcaseEntries[this.currentIndex];

    // Update original panel
    const originalContent = this.container.querySelector('.showcase-original-content');
    if (originalContent) {
      originalContent.textContent = entry.original;
    }

    // Update themed panel with highlights
    const themedContent = this.container.querySelector('.showcase-themed-content');
    if (themedContent) {
      themedContent.innerHTML = this.renderThemedWithHighlights(entry);
    }

    // Apply highlight transformations
    this.highlightTransformations();
  }

  /**
   * Render themed text with highlighted transformations
   * Requirements: 6.3, 6.5
   */
  private renderThemedWithHighlights(entry: ShowcaseEntry): string {
    let html = entry.themed;

    // Sort highlights by start index in reverse to avoid index shifting
    const sortedHighlights = [...entry.highlights].sort((a, b) => b.startIndex - a.startIndex);

    sortedHighlights.forEach(highlight => {
      const before = html.substring(0, highlight.startIndex);
      const highlighted = html.substring(highlight.startIndex, highlight.endIndex);
      const after = html.substring(highlight.endIndex);

      // Find original word for tooltip
      const originalWord = this.findOriginalWord(entry.original, highlight.text);

      html = before + 
        `<span class="highlight-${highlight.type}" 
               data-original="${originalWord}"
               style="
                 color: var(--color-blood, #8b0000);
                 font-weight: bold;
                 text-shadow: 0 0 5px rgba(139, 0, 0, 0.5);
                 cursor: help;
                 position: relative;
                 border-bottom: 2px dotted var(--color-blood, #8b0000);
               ">${highlighted}</span>` + 
        after;
    });

    return html;
  }

  /**
   * Find transformations between original and themed text
   * Requirements: 6.3
   * 
   * Identifies horror-themed words that replaced original words
   */
  private findTransformations(original: string, themed: string): TextHighlight[] {
    const highlights: TextHighlight[] = [];

    // Horror vocabulary patterns to detect
    const horrorPatterns = {
      verbs: /\b(summoned|banished|cursed|haunted|possessed|conjured|manifested|awakened|unleashed|invoked|exorcised|transformed|corrupted|consumed|devoured|emerged|lurked|whispered|screamed|crawled|slithered|vanished)\b/gi,
      adjectives: /\b(spectral|eldritch|haunted|cursed|phantom|ghostly|ethereal|sinister|ominous|macabre|ghastly|eerie|uncanny|dreadful|malevolent|supernatural|otherworldly|arcane|forbidden|ancient|dark)\b/gi,
      nouns: /\b(phantom|specter|wraith|spirit|demon|entity|creature|horror|nightmare|abyss|void|shadow|darkness|ritual|curse|spell|incantation|portal|dimension|realm|crypt|tomb|grave)\b/gi
    };

    // Find all horror words in themed text
    Object.entries(horrorPatterns).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(themed)) !== null) {
        highlights.push({
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          type: type as 'verb' | 'adjective' | 'noun'
        });
      }
    });

    return highlights;
  }

  /**
   * Find the original word that was transformed
   * Requirements: 6.5
   * 
   * Attempts to find the original word for tooltip display
   */
  private findOriginalWord(original: string, themedWord: string): string {
    // Simple heuristic: find words in similar positions
    // This is a simplified version - could be enhanced with better matching
    const originalWords = original.toLowerCase().split(/\s+/);
    
    // Common transformation mappings
    const transformations: Record<string, string> = {
      'summoned': 'added',
      'banished': 'removed',
      'cursed': 'deprecated',
      'haunted': 'affected',
      'possessed': 'controlled',
      'conjured': 'created',
      'manifested': 'appeared',
      'awakened': 'activated',
      'unleashed': 'released',
      'invoked': 'called',
      'spectral': 'virtual',
      'eldritch': 'complex',
      'phantom': 'hidden',
      'ghostly': 'transparent',
      'ethereal': 'lightweight'
    };

    const lowerThemed = themedWord.toLowerCase();
    if (transformations[lowerThemed]) {
      return transformations[lowerThemed];
    }

    // Return a generic placeholder if we can't find a match
    return 'original';
  }

  /**
   * Highlight transformations with tooltips
   * Requirements: 6.3, 6.5
   * 
   * Adds tooltip functionality to highlighted words
   */
  highlightTransformations(): void {
    if (!this.container) {
      return;
    }

    const highlights = this.container.querySelectorAll('[data-original]');
    
    highlights.forEach(element => {
      const htmlElement = element as HTMLElement;
      const original = htmlElement.getAttribute('data-original') || '';

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'showcase-tooltip';
      tooltip.textContent = `Original: ${original}`;
      tooltip.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        background: var(--color-void, #0a0a0a);
        color: var(--color-ghost, #e0e0e0);
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        border: 1px solid var(--color-spectral, #4a0e4e);
        font-size: 0.85rem;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      `;

      htmlElement.style.position = 'relative';
      htmlElement.appendChild(tooltip);

      // Show tooltip on hover
      htmlElement.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
      });

      htmlElement.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    });
  }

  /**
   * Show previous entry
   * Requirements: 6.4
   */
  private showPrevious(): void {
    if (this.showcaseEntries.length === 0) {
      return;
    }

    this.currentIndex = (this.currentIndex - 1 + this.showcaseEntries.length) % this.showcaseEntries.length;
    this.animateTransition(() => this.displayCurrentEntry());
  }

  /**
   * Show next entry
   * Requirements: 6.4
   */
  private showNext(): void {
    if (this.showcaseEntries.length === 0) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.showcaseEntries.length;
    this.animateTransition(() => this.displayCurrentEntry());
  }

  /**
   * Animate transition between entries
   * Requirements: 6.4
   * 
   * Provides smooth animation when switching between showcase entries
   */
  private animateTransition(callback: () => void): void {
    if (!this.container) {
      callback();
      return;
    }

    const comparison = this.container.querySelector('.showcase-comparison') as HTMLElement;
    if (!comparison) {
      callback();
      return;
    }

    // Fade out
    comparison.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    comparison.style.opacity = '0.3';
    comparison.style.transform = 'scale(0.98)';

    setTimeout(() => {
      // Update content
      callback();

      // Fade in
      comparison.style.opacity = '1';
      comparison.style.transform = 'scale(1)';

      // Clean up transition
      setTimeout(() => {
        comparison.style.transition = '';
      }, 300);
    }, 300);
  }

  /**
   * Start automatic rotation through entries
   * Requirements: 6.4
   */
  private startAutoRotation(): void {
    // Clear any existing interval
    this.stopAutoRotation();

    // Rotate every 8 seconds
    this.animationInterval = window.setInterval(() => {
      this.showNext();
    }, 8000);
  }

  /**
   * Stop automatic rotation
   */
  private stopAutoRotation(): void {
    if (this.animationInterval !== null) {
      window.clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  /**
   * Hide the showcase
   */
  hide(): void {
    if (!this.container) {
      return;
    }

    const showcase = this.container.querySelector('.theme-showcase') as HTMLElement;
    if (showcase) {
      showcase.style.display = 'none';
    }

    this.stopAutoRotation();
  }

  /**
   * Show the showcase
   */
  show(): void {
    if (!this.container) {
      return;
    }

    const showcase = this.container.querySelector('.theme-showcase') as HTMLElement;
    if (showcase) {
      showcase.style.display = 'block';
    }

    if (this.showcaseEntries.length > 0) {
      this.startAutoRotation();
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopAutoRotation();
    this.showcaseEntries = [];
    this.container = null;
  }
}

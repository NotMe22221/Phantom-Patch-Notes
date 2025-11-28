/**
 * Statistics Display Component
 * 
 * Shows live transformation metrics with animated counters.
 * Displays commit count, horror words applied, and transformation percentage.
 * Provides detailed breakdowns in tooltips.
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import type { 
  StatisticsDisplay as IStatisticsDisplay, 
  TransformationStats
} from '../types/demo-types';

/**
 * Statistics Display Implementation
 * Provides live metrics about the horror-themed transformation
 */
export class StatisticsDisplay implements IStatisticsDisplay {
  private container: HTMLElement | null = null;
  private currentStats: TransformationStats | null = null;
  private animationFrameId: number | null = null;

  /**
   * Render the statistics UI structure
   * Requirements: 9.1, 9.2, 9.3, 9.4
   * 
   * Creates statistics display with counters and tooltips
   */
  render(container: HTMLElement): void {
    this.container = container;

    // Create statistics wrapper
    const statsWrapper = document.createElement('div');
    statsWrapper.className = 'statistics-display';
    statsWrapper.style.cssText = `
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
    header.className = 'statistics-header';
    header.style.cssText = `
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--color-mist, #2a2a2a);
    `;

    const title = document.createElement('h3');
    title.textContent = 'Transformation Statistics';
    title.style.cssText = `
      font-family: 'Creepster', cursive;
      font-size: 1.8rem;
      color: var(--color-blood, #8b0000);
      text-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
      margin-bottom: 0.5rem;
    `;

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Witness the scale of horror';
    subtitle.style.cssText = `
      color: var(--color-phantom, #b0b0b0);
      font-style: italic;
      font-size: 0.95rem;
    `;

    header.appendChild(title);
    header.appendChild(subtitle);

    // Create statistics grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'statistics-grid';
    statsGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1rem;
    `;

    // Create stat cards
    const commitsCard = this.createStatCard(
      'Total Commits',
      'stat-commits',
      'The number of commits transformed',
      '📜'
    );

    const wordsCard = this.createStatCard(
      'Horror Words',
      'stat-words',
      'The count of horror-themed words applied',
      '👻'
    );

    const percentageCard = this.createStatCard(
      'Transformation',
      'stat-percentage',
      'The percentage of text that was transformed',
      '🔮'
    );

    statsGrid.appendChild(commitsCard);
    statsGrid.appendChild(wordsCard);
    statsGrid.appendChild(percentageCard);

    // Create breakdown section
    const breakdown = this.createBreakdownSection();

    // Assemble statistics display
    statsWrapper.appendChild(header);
    statsWrapper.appendChild(statsGrid);
    statsWrapper.appendChild(breakdown);

    // Add to container
    container.appendChild(statsWrapper);

    console.log('✓ Statistics Display rendered');
  }

  /**
   * Create a statistics card
   * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
   */
  private createStatCard(
    label: string, 
    className: string, 
    tooltip: string,
    icon: string
  ): HTMLElement {
    const card = document.createElement('div');
    card.className = `stat-card ${className}`;
    card.style.cssText = `
      background: var(--color-void, #0a0a0a);
      border: 2px solid var(--color-mist, #2a2a2a);
      border-radius: 6px;
      padding: 1.5rem;
      text-align: center;
      position: relative;
      transition: all 0.3s ease;
      cursor: help;
    `;

    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--color-spectral, #4a0e4e)';
      card.style.boxShadow = '0 4px 20px rgba(74, 14, 78, 0.5)';
      card.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--color-mist, #2a2a2a)';
      card.style.boxShadow = 'none';
      card.style.transform = 'translateY(0)';
    });

    // Icon
    const iconElement = document.createElement('div');
    iconElement.className = 'stat-icon';
    iconElement.textContent = icon;
    iconElement.style.cssText = `
      font-size: 2rem;
      margin-bottom: 0.5rem;
      filter: grayscale(0.3);
    `;

    // Value
    const value = document.createElement('div');
    value.className = `${className}-value`;
    value.textContent = '0';
    value.style.cssText = `
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--color-blood, #8b0000);
      text-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
      margin-bottom: 0.5rem;
      font-family: 'Courier New', monospace;
    `;

    // Label
    const labelElement = document.createElement('div');
    labelElement.className = 'stat-label';
    labelElement.textContent = label;
    labelElement.style.cssText = `
      font-size: 0.9rem;
      color: var(--color-phantom, #b0b0b0);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
    `;

    // Tooltip
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'stat-tooltip';
    tooltipElement.textContent = tooltip;
    tooltipElement.style.cssText = `
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

    card.addEventListener('mouseenter', () => {
      tooltipElement.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      tooltipElement.style.opacity = '0';
    });

    card.appendChild(iconElement);
    card.appendChild(value);
    card.appendChild(labelElement);
    card.appendChild(tooltipElement);

    return card;
  }

  /**
   * Create breakdown section
   * Requirements: 9.5
   * 
   * Shows detailed breakdown of transformation by word type
   */
  private createBreakdownSection(): HTMLElement {
    const breakdown = document.createElement('div');
    breakdown.className = 'statistics-breakdown';
    breakdown.style.cssText = `
      background: var(--color-void, #0a0a0a);
      border: 2px solid var(--color-mist, #2a2a2a);
      border-radius: 6px;
      padding: 1rem;
      margin-top: 1rem;
    `;

    const breakdownTitle = document.createElement('h4');
    breakdownTitle.textContent = 'Horror Vocabulary Breakdown';
    breakdownTitle.style.cssText = `
      font-size: 1rem;
      color: var(--color-phantom, #b0b0b0);
      margin-bottom: 1rem;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
    `;

    const breakdownGrid = document.createElement('div');
    breakdownGrid.className = 'breakdown-grid';
    breakdownGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    `;

    // Create breakdown items
    const verbsItem = this.createBreakdownItem('Verbs', 'breakdown-verbs', '⚔️');
    const adjectivesItem = this.createBreakdownItem('Adjectives', 'breakdown-adjectives', '✨');
    const nounsItem = this.createBreakdownItem('Nouns', 'breakdown-nouns', '🏰');

    breakdownGrid.appendChild(verbsItem);
    breakdownGrid.appendChild(adjectivesItem);
    breakdownGrid.appendChild(nounsItem);

    breakdown.appendChild(breakdownTitle);
    breakdown.appendChild(breakdownGrid);

    return breakdown;
  }

  /**
   * Create a breakdown item
   * Requirements: 9.5
   */
  private createBreakdownItem(label: string, className: string, icon: string): HTMLElement {
    const item = document.createElement('div');
    item.className = `breakdown-item ${className}`;
    item.style.cssText = `
      text-align: center;
      padding: 0.75rem;
      background: var(--color-shadow, #1a1a1a);
      border-radius: 4px;
      border: 1px solid var(--color-mist, #2a2a2a);
    `;

    const iconElement = document.createElement('div');
    iconElement.textContent = icon;
    iconElement.style.cssText = `
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    `;

    const value = document.createElement('div');
    value.className = `${className}-value`;
    value.textContent = '0';
    value.style.cssText = `
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-blood, #8b0000);
      margin-bottom: 0.25rem;
      font-family: 'Courier New', monospace;
    `;

    const labelElement = document.createElement('div');
    labelElement.textContent = label;
    labelElement.style.cssText = `
      font-size: 0.8rem;
      color: var(--color-phantom, #b0b0b0);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    item.appendChild(iconElement);
    item.appendChild(value);
    item.appendChild(labelElement);

    return item;
  }

  /**
   * Update statistics display
   * Requirements: 9.1, 9.2, 9.3
   * 
   * Updates the display with new transformation statistics
   */
  update(stats: TransformationStats): void {
    if (!this.container) {
      console.warn('Statistics Display not rendered yet');
      return;
    }

    this.currentStats = stats;

    // Show the statistics display
    const statsWrapper = this.container.querySelector('.statistics-display') as HTMLElement;
    if (statsWrapper) {
      statsWrapper.style.display = 'block';
    }

    // Animate the counters
    this.animateCounters();

    console.log('✓ Statistics Display updated', stats);
  }

  /**
   * Animate counters counting up from zero
   * Requirements: 9.4
   * 
   * Provides smooth counting animation for all statistics
   */
  animateCounters(): void {
    if (!this.container || !this.currentStats) {
      return;
    }

    // Cancel any existing animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      // Update main statistics
      this.updateCounter('.stat-commits-value', 
        Math.floor(this.currentStats!.totalCommits * eased));
      
      this.updateCounter('.stat-words-value', 
        Math.floor(this.currentStats!.horrorWordsApplied * eased));
      
      this.updateCounter('.stat-percentage-value', 
        Math.floor(this.currentStats!.transformationPercentage * eased), 
        '%');

      // Update breakdown
      this.updateCounter('.breakdown-verbs-value', 
        Math.floor(this.currentStats!.breakdown.verbs * eased));
      
      this.updateCounter('.breakdown-adjectives-value', 
        Math.floor(this.currentStats!.breakdown.adjectives * eased));
      
      this.updateCounter('.breakdown-nouns-value', 
        Math.floor(this.currentStats!.breakdown.nouns * eased));

      // Add glow effect during animation
      if (progress < 1) {
        this.addGlowEffect(eased);
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.removeGlowEffect();
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Update a counter element
   */
  private updateCounter(selector: string, value: number, suffix: string = ''): void {
    if (!this.container) {
      return;
    }

    const element = this.container.querySelector(selector);
    if (element) {
      element.textContent = `${value}${suffix}`;
    }
  }

  /**
   * Add glow effect during animation
   * Requirements: 9.4
   */
  private addGlowEffect(intensity: number): void {
    if (!this.container) {
      return;
    }

    const values = this.container.querySelectorAll('.stat-card > div:nth-child(2), .breakdown-item > div:nth-child(2)');
    values.forEach(element => {
      const htmlElement = element as HTMLElement;
      const glowIntensity = intensity * 20;
      htmlElement.style.textShadow = `
        0 0 ${glowIntensity}px rgba(139, 0, 0, 0.8),
        0 0 ${glowIntensity * 2}px rgba(139, 0, 0, 0.5)
      `;
    });
  }

  /**
   * Remove glow effect after animation
   */
  private removeGlowEffect(): void {
    if (!this.container) {
      return;
    }

    const values = this.container.querySelectorAll('.stat-card > div:nth-child(2), .breakdown-item > div:nth-child(2)');
    values.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.textShadow = '0 0 10px rgba(139, 0, 0, 0.5)';
    });
  }

  /**
   * Hide the statistics display
   */
  hide(): void {
    if (!this.container) {
      return;
    }

    const statsWrapper = this.container.querySelector('.statistics-display') as HTMLElement;
    if (statsWrapper) {
      statsWrapper.style.display = 'none';
    }
  }

  /**
   * Show the statistics display
   */
  show(): void {
    if (!this.container) {
      return;
    }

    const statsWrapper = this.container.querySelector('.statistics-display') as HTMLElement;
    if (statsWrapper) {
      statsWrapper.style.display = 'block';
    }
  }

  /**
   * Reset statistics to zero
   */
  reset(): void {
    if (!this.container) {
      return;
    }

    // Cancel any ongoing animation
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Reset all counters to zero
    this.updateCounter('.stat-commits-value', 0);
    this.updateCounter('.stat-words-value', 0);
    this.updateCounter('.stat-percentage-value', 0, '%');
    this.updateCounter('.breakdown-verbs-value', 0);
    this.updateCounter('.breakdown-adjectives-value', 0);
    this.updateCounter('.breakdown-nouns-value', 0);

    this.currentStats = null;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.currentStats = null;
    this.container = null;
  }
}

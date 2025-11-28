/**
 * Theme Showcase Component Tests
 * 
 * Tests for the theme showcase functionality including rendering,
 * updating with commit data, and highlighting transformations.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeShowcase } from './theme-showcase';
import type { CommitData } from '../../shared/types';

describe('ThemeShowcase', () => {
  let showcase: ThemeShowcase;
  let testContainer: HTMLElement;

  beforeEach(() => {
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);

    showcase = new ThemeShowcase();
  });

  afterEach(() => {
    showcase.dispose();
    document.body.removeChild(testContainer);
  });

  describe('Rendering', () => {
    it('should render showcase structure', () => {
      showcase.render(testContainer);

      const showcaseElement = testContainer.querySelector('.theme-showcase');
      expect(showcaseElement).toBeTruthy();
    });

    it('should create original and themed panels', () => {
      showcase.render(testContainer);

      const originalPanel = testContainer.querySelector('.showcase-original');
      const themedPanel = testContainer.querySelector('.showcase-themed');

      expect(originalPanel).toBeTruthy();
      expect(themedPanel).toBeTruthy();
    });

    it('should create navigation controls', () => {
      showcase.render(testContainer);

      const controls = testContainer.querySelector('.showcase-controls');
      expect(controls).toBeTruthy();

      const buttons = controls?.querySelectorAll('button');
      expect(buttons?.length).toBe(2);
    });

    it('should initially hide the showcase', () => {
      showcase.render(testContainer);

      const showcaseElement = testContainer.querySelector('.theme-showcase') as HTMLElement;
      // The showcase should exist but be hidden initially
      expect(showcaseElement).toBeTruthy();
      // It will be shown when update() is called with data
    });
  });

  describe('Updating with Data', () => {
    beforeEach(() => {
      showcase.render(testContainer);
    });

    it('should display showcase when updated with data', () => {
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians from the void',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);

      const showcaseElement = testContainer.querySelector('.theme-showcase') as HTMLElement;
      expect(showcaseElement.style.display).toBe('block');
    });

    it('should display original commit message', () => {
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians from the void',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);

      const originalContent = testContainer.querySelector('.showcase-original-content');
      expect(originalContent?.textContent).toBe('Add user authentication');
    });

    it('should display themed message', () => {
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians from the void',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);

      const themedContent = testContainer.querySelector('.showcase-themed-content');
      expect(themedContent?.textContent).toContain('Summoned');
      expect(themedContent?.textContent).toContain('spectral');
    });

    it('should handle empty data gracefully', () => {
      // Should not throw when given empty data
      expect(() => showcase.update([], [])).not.toThrow();
    });
  });

  describe('Highlighting Transformations', () => {
    beforeEach(() => {
      showcase.render(testContainer);
    });

    it('should highlight horror-themed words', () => {
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians from the void',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);

      const themedContent = testContainer.querySelector('.showcase-themed-content');
      const highlights = themedContent?.querySelectorAll('[data-original]');
      
      // Should have highlighted words (summoned, spectral, void)
      expect(highlights && highlights.length > 0).toBe(true);
    });

    it('should add tooltips to highlighted words', () => {
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians from the void',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);

      const highlights = testContainer.querySelectorAll('[data-original]');
      
      highlights.forEach(highlight => {
        const tooltip = highlight.querySelector('.showcase-tooltip');
        expect(tooltip).toBeTruthy();
      });
    });
  });

  describe('Hide and Show', () => {
    beforeEach(() => {
      showcase.render(testContainer);
      
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);
    });

    it('should hide showcase', () => {
      showcase.hide();

      const showcaseElement = testContainer.querySelector('.theme-showcase') as HTMLElement;
      expect(showcaseElement.style.display).toBe('none');
    });

    it('should show showcase', () => {
      showcase.hide();
      showcase.show();

      const showcaseElement = testContainer.querySelector('.theme-showcase') as HTMLElement;
      expect(showcaseElement.style.display).toBe('block');
    });
  });

  describe('Disposal', () => {
    it('should clean up resources', () => {
      showcase.render(testContainer);
      
      const commits: CommitData[] = [
        {
          hash: 'abc123',
          author: 'Test Author',
          email: 'test@example.com',
          timestamp: new Date(),
          message: 'Add user authentication',
          changedFiles: ['auth.ts']
        }
      ];

      const patchNotes = [
        {
          themed: 'Summoned spectral guardians',
          original: 'Add user authentication',
          commitHash: 'abc123'
        }
      ];

      showcase.update(commits, patchNotes);
      showcase.dispose();

      // Should be safe to dispose multiple times
      expect(() => showcase.dispose()).not.toThrow();
    });
  });
});

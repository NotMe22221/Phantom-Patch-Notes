/**
 * Property-based tests for Preview Mode toggle functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PreviewMode } from './preview-mode.js';
import { isSyntheticData } from '../../preview/sample-commits.js';

describe('Preview Mode - Toggle', () => {
  let previewMode: PreviewMode;

  beforeEach(() => {
    previewMode = new PreviewMode();
  });

  // Feature: phantom-patch-notes, Property 21: Preview mode toggle switches data source
  // For any system state, toggling preview mode should switch between synthetic and real repository data sources
  describe('Property 21: Preview mode toggle switches data source', () => {
    it('should switch data source when toggling preview mode', async () => {
      // Run the test multiple times to ensure consistency
      for (let i = 0; i < 100; i++) {
        const freshPreviewMode = new PreviewMode();
        
        // Initially disabled (real mode)
        expect(freshPreviewMode.isEnabled()).toBe(false);
        
        // Enable preview mode
        freshPreviewMode.enable();
        expect(freshPreviewMode.isEnabled()).toBe(true);
        
        // Get commits in preview mode - should be synthetic
        const syntheticCommits = await freshPreviewMode.getCommits();
        expect(isSyntheticData(syntheticCommits)).toBe(true);
        expect(freshPreviewMode.verifyDataSource(syntheticCommits)).toBe(true);
        
        // Verify state reflects synthetic data source
        const stateAfterSynthetic = freshPreviewMode.getState();
        expect(stateAfterSynthetic.enabled).toBe(true);
        expect(stateAfterSynthetic.lastDataSource).toBe('synthetic');
        
        // Disable preview mode
        freshPreviewMode.disable();
        expect(freshPreviewMode.isEnabled()).toBe(false);
        
        // Verify synthetic data is no longer valid for this mode
        expect(freshPreviewMode.verifyDataSource(syntheticCommits)).toBe(false);
      }
    });

    it('should toggle between enabled and disabled states', () => {
      // Start disabled
      expect(previewMode.isEnabled()).toBe(false);
      
      // Toggle to enabled
      let result = previewMode.toggle();
      expect(result).toBe(true);
      expect(previewMode.isEnabled()).toBe(true);
      
      // Toggle back to disabled
      result = previewMode.toggle();
      expect(result).toBe(false);
      expect(previewMode.isEnabled()).toBe(false);
      
      // Test multiple toggles
      for (let i = 0; i < 10; i++) {
        const expectedState = (i % 2) === 0; // true on even iterations
        result = previewMode.toggle();
        expect(result).toBe(expectedState);
        expect(previewMode.isEnabled()).toBe(expectedState);
      }
    });

    it('should consistently return synthetic data when enabled', async () => {
      previewMode.enable();
      
      // Get commits multiple times
      for (let i = 0; i < 10; i++) {
        const commits = await previewMode.getCommits();
        
        // Should always be synthetic when enabled
        expect(isSyntheticData(commits)).toBe(true);
        expect(previewMode.verifyDataSource(commits)).toBe(true);
        
        // Should have commits
        expect(commits.length).toBeGreaterThan(0);
      }
    });

    it('should track last data source correctly', async () => {
      // Initially no data source
      expect(previewMode.getState().lastDataSource).toBe(null);
      
      // Enable and get synthetic data
      previewMode.enable();
      await previewMode.getCommits();
      expect(previewMode.getState().lastDataSource).toBe('synthetic');
      
      // Disable (can't test real without a repo, but state should update)
      previewMode.disable();
      expect(previewMode.getState().enabled).toBe(false);
    });

    it('should throw error when trying to get real commits without options', async () => {
      previewMode.disable();
      
      // Should throw when no options provided in real mode
      await expect(previewMode.getCommits()).rejects.toThrow(
        'ParseOptions required when preview mode is disabled'
      );
    });

    it('should demonstrate theme capabilities in preview mode', async () => {
      previewMode.enable();
      const commits = await previewMode.getCommits();
      
      // Verify diverse commit types that demonstrate theme capabilities
      const messages = commits.map(c => c.message.toLowerCase());
      
      // Should have different types of changes
      const hasFeatures = messages.some(m => 
        m.includes('feat') || m.includes('add') || m.includes('implement')
      );
      const hasFixes = messages.some(m => 
        m.includes('fix') || m.includes('bug') || m.includes('resolve')
      );
      const hasBreaking = messages.some(m => 
        m.includes('breaking')
      );
      const hasOther = messages.some(m => 
        m.includes('docs') || m.includes('refactor') || m.includes('chore')
      );
      
      // Preview mode should demonstrate all theme capabilities
      expect(hasFeatures).toBe(true);
      expect(hasFixes).toBe(true);
      expect(hasBreaking).toBe(true);
      expect(hasOther).toBe(true);
    });
  });

  describe('PreviewMode state management', () => {
    it('should maintain independent state across instances', () => {
      const mode1 = new PreviewMode();
      const mode2 = new PreviewMode();
      
      mode1.enable();
      expect(mode1.isEnabled()).toBe(true);
      expect(mode2.isEnabled()).toBe(false);
      
      mode2.enable();
      expect(mode1.isEnabled()).toBe(true);
      expect(mode2.isEnabled()).toBe(true);
      
      mode1.disable();
      expect(mode1.isEnabled()).toBe(false);
      expect(mode2.isEnabled()).toBe(true);
    });

    it('should return immutable state copy', () => {
      const state1 = previewMode.getState();
      state1.enabled = true;
      
      // Original state should not be affected
      expect(previewMode.isEnabled()).toBe(false);
      
      const state2 = previewMode.getState();
      expect(state2.enabled).toBe(false);
    });
  });
});

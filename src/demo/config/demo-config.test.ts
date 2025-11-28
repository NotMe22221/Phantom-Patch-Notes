/**
 * Demo Configuration Tests
 * 
 * Tests for the demo configuration and haunted repository setup.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  demoConfig,
  hauntedRepoConfig,
  audioAssets,
  presentationConfig,
  autoPlayConfig,
  introConfig,
  enableDemoMode,
  disableDemoMode,
  isInDemoMode
} from './demo-config';

describe('Demo Configuration', () => {
  describe('Haunted Repository', () => {
    it('should have at least 20 commits', () => {
      expect(hauntedRepoConfig.commits.length).toBeGreaterThanOrEqual(20);
    });

    it('should have at least 3 releases', () => {
      expect(hauntedRepoConfig.releases.length).toBeGreaterThanOrEqual(3);
    });

    it('should have diverse commit types', () => {
      // Check that commits have diverse messages indicating different types
      const messages = hauntedRepoConfig.commits.map(c => c.message.toLowerCase());
      const hasFeatures = messages.some(m => m.includes('add') || m.includes('implement'));
      const hasFixes = messages.some(m => m.includes('fix'));
      const hasBreaking = messages.some(m => m.includes('breaking'));
      
      expect(hasFeatures).toBe(true);
      expect(hasFixes).toBe(true);
      expect(hasBreaking).toBe(true);
    });

    it('should have valid release configurations', () => {
      for (const release of hauntedRepoConfig.releases) {
        expect(release.version).toBeTruthy();
        expect(release.date).toBeInstanceOf(Date);
        expect(release.commitHashes.length).toBeGreaterThan(0);
      }
    });

    it('should have all release commits exist in commits array', () => {
      const commitHashes = new Set(hauntedRepoConfig.commits.map(c => c.hash));
      
      for (const release of hauntedRepoConfig.releases) {
        for (const hash of release.commitHashes) {
          expect(commitHashes.has(hash)).toBe(true);
        }
      }
    });

    it('should have unique commit hashes', () => {
      const hashes = hauntedRepoConfig.commits.map(c => c.hash);
      const uniqueHashes = new Set(hashes);
      expect(hashes.length).toBe(uniqueHashes.size);
    });
  });

  describe('Audio Assets', () => {
    it('should have 5 audio assets', () => {
      expect(audioAssets.length).toBe(5);
    });

    it('should have all required sound effects', () => {
      const soundIds = audioAssets.map(a => a.id);
      expect(soundIds).toContain('ambient-background');
      expect(soundIds).toContain('generate-effect');
      expect(soundIds).toContain('select-effect');
      expect(soundIds).toContain('hover-effect');
      expect(soundIds).toContain('export-effect');
    });

    it('should have valid volume levels', () => {
      for (const asset of audioAssets) {
        expect(asset.volume).toBeGreaterThanOrEqual(0);
        expect(asset.volume).toBeLessThanOrEqual(1);
      }
    });

    it('should have ambient background set to loop', () => {
      const ambient = audioAssets.find(a => a.id === 'ambient-background');
      expect(ambient?.loop).toBe(true);
    });
  });

  describe('Presentation Configuration', () => {
    it('should have font scale of 1.5', () => {
      expect(presentationConfig.fontScale).toBe(1.5);
    });

    it('should have hidden elements defined', () => {
      expect(presentationConfig.hiddenElements.length).toBeGreaterThan(0);
    });

    it('should have showcase visible', () => {
      expect(presentationConfig.showcaseVisible).toBe(true);
    });
  });

  describe('Auto-Play Configuration', () => {
    it('should have delays for all demo steps', () => {
      expect(autoPlayConfig.stepDelays.generate).toBe(2000);
      expect(autoPlayConfig.stepDelays['select-release']).toBe(3000);
      expect(autoPlayConfig.stepDelays['scroll-sections']).toBe(4000);
      expect(autoPlayConfig.stepDelays.export).toBe(3000);
      expect(autoPlayConfig.stepDelays.complete).toBe(5000);
    });

    it('should not loop on complete by default', () => {
      expect(autoPlayConfig.loopOnComplete).toBe(false);
    });
  });

  describe('Intro Configuration', () => {
    it('should have logo URL', () => {
      expect(introConfig.logoUrl).toBeTruthy();
    });

    it('should have tagline', () => {
      expect(introConfig.tagline).toBe('Transform Git History into Horror Stories');
    });

    it('should have animation duration', () => {
      expect(introConfig.animationDuration).toBe(2000);
    });
  });

  describe('Complete Demo Config', () => {
    it('should aggregate all configurations', () => {
      expect(demoConfig.hauntedRepo).toBe(hauntedRepoConfig);
      expect(demoConfig.sounds).toBe(audioAssets);
      expect(demoConfig.presentation).toBe(presentationConfig);
      expect(demoConfig.autoPlay).toBe(autoPlayConfig);
      expect(demoConfig.intro).toBe(introConfig);
    });
  });

  describe('Demo Mode Flag', () => {
    beforeEach(() => {
      // Reset demo mode before each test
      disableDemoMode();
    });

    it('should start disabled', () => {
      expect(isInDemoMode()).toBe(false);
    });

    it('should enable demo mode', () => {
      enableDemoMode();
      expect(isInDemoMode()).toBe(true);
    });

    it('should disable demo mode', () => {
      enableDemoMode();
      expect(isInDemoMode()).toBe(true);
      
      disableDemoMode();
      expect(isInDemoMode()).toBe(false);
    });

    it('should toggle demo mode multiple times', () => {
      enableDemoMode();
      expect(isInDemoMode()).toBe(true);
      
      disableDemoMode();
      expect(isInDemoMode()).toBe(false);
      
      enableDemoMode();
      expect(isInDemoMode()).toBe(true);
    });
  });
});

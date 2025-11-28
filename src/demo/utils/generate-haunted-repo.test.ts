/**
 * Haunted Repository Generator Tests
 * 
 * Tests for the haunted repository generation script.
 */

import { describe, it, expect } from 'vitest';
import { generateHauntedRepo, generateStatistics } from './generate-haunted-repo';

describe('Haunted Repository Generator', () => {
  describe('generateHauntedRepo', () => {
    it('should generate a valid haunted repository configuration', () => {
      const config = generateHauntedRepo();
      
      expect(config).toBeDefined();
      expect(config.repoPath).toBe('demo/haunted-repo');
      expect(config.commits).toBeDefined();
      expect(config.releases).toBeDefined();
    });

    it('should generate at least 20 commits', () => {
      const config = generateHauntedRepo();
      expect(config.commits.length).toBeGreaterThanOrEqual(20);
    });

    it('should generate at least 3 releases', () => {
      const config = generateHauntedRepo();
      expect(config.releases.length).toBeGreaterThanOrEqual(3);
    });

    it('should generate commits with all required properties', () => {
      const config = generateHauntedRepo();
      
      for (const commit of config.commits) {
        expect(commit.hash).toBeTruthy();
        expect(commit.message).toBeTruthy();
        expect(commit.author).toBeTruthy();
        expect(commit.email).toBeTruthy();
        expect(commit.timestamp).toBeInstanceOf(Date);
        expect(Array.isArray(commit.changedFiles)).toBe(true);
        expect(commit.changedFiles.length).toBeGreaterThan(0);
      }
    });

    it('should generate releases with all required properties', () => {
      const config = generateHauntedRepo();
      
      for (const release of config.releases) {
        expect(release.version).toBeTruthy();
        expect(release.date).toBeInstanceOf(Date);
        expect(Array.isArray(release.commitHashes)).toBe(true);
        expect(release.commitHashes.length).toBeGreaterThan(0);
      }
    });

    it('should have unique commit hashes', () => {
      const config = generateHauntedRepo();
      const hashes = config.commits.map(c => c.hash);
      const uniqueHashes = new Set(hashes);
      
      expect(hashes.length).toBe(uniqueHashes.size);
    });

    it('should have all release commit hashes exist in commits', () => {
      const config = generateHauntedRepo();
      const commitHashes = new Set(config.commits.map(c => c.hash));
      
      for (const release of config.releases) {
        for (const hash of release.commitHashes) {
          expect(commitHashes.has(hash)).toBe(true);
        }
      }
    });

    it('should have commits in chronological order', () => {
      const config = generateHauntedRepo();
      
      for (let i = 1; i < config.commits.length; i++) {
        const prevTime = config.commits[i - 1].timestamp.getTime();
        const currTime = config.commits[i].timestamp.getTime();
        expect(currTime).toBeGreaterThanOrEqual(prevTime);
      }
    });

    it('should have releases in chronological order', () => {
      const config = generateHauntedRepo();
      
      for (let i = 1; i < config.releases.length; i++) {
        const prevTime = config.releases[i - 1].date.getTime();
        const currTime = config.releases[i].date.getTime();
        expect(currTime).toBeGreaterThan(prevTime);
      }
    });

    it('should include diverse commit types', () => {
      const config = generateHauntedRepo();
      const messages = config.commits.map(c => c.message.toLowerCase());
      
      // Check for features (Add/Implement)
      const hasFeatures = messages.some(m => m.startsWith('add ') || m.startsWith('implement'));
      expect(hasFeatures).toBe(true);
      
      // Check for fixes
      const hasFixes = messages.some(m => m.includes('fix '));
      expect(hasFixes).toBe(true);
      
      // Check for breaking changes
      const hasBreaking = messages.some(m => m.startsWith('breaking:'));
      expect(hasBreaking).toBe(true);
      
      // Check for deprecations
      const hasDeprecations = messages.some(m => m.startsWith('deprecate'));
      expect(hasDeprecations).toBe(true);
    });

    it('should have meaningful version progression', () => {
      const config = generateHauntedRepo();
      const versions = config.releases.map(r => r.version);
      
      // Check that versions follow semantic versioning pattern
      for (const version of versions) {
        expect(version).toMatch(/^\d+\.\d+\.\d+$/);
      }
      
      // Check that we have multiple major/minor versions
      expect(versions.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('generateStatistics', () => {
    it('should generate accurate statistics', () => {
      const config = generateHauntedRepo();
      const stats = generateStatistics(config);
      
      expect(stats.totalCommits).toBe(config.commits.length);
      expect(stats.totalReleases).toBe(config.releases.length);
      expect(stats.commitTypes).toBeDefined();
      expect(stats.averageCommitsPerRelease).toBeGreaterThan(0);
    });

    it('should categorize commit types correctly', () => {
      const config = generateHauntedRepo();
      const stats = generateStatistics(config);
      
      expect(stats.commitTypes.features).toBeGreaterThan(0);
      expect(stats.commitTypes.fixes).toBeGreaterThan(0);
      expect(stats.commitTypes.breaking).toBeGreaterThan(0);
      expect(stats.commitTypes.deprecations).toBeGreaterThan(0);
    });

    it('should have total commits equal sum of categorized types', () => {
      const config = generateHauntedRepo();
      const stats = generateStatistics(config);
      
      const sum = stats.commitTypes.features +
                  stats.commitTypes.fixes +
                  stats.commitTypes.breaking +
                  stats.commitTypes.deprecations +
                  stats.commitTypes.other;
      
      expect(sum).toBe(stats.totalCommits);
    });

    it('should calculate average commits per release correctly', () => {
      const config = generateHauntedRepo();
      const stats = generateStatistics(config);
      
      const expected = config.commits.length / config.releases.length;
      expect(stats.averageCommitsPerRelease).toBeCloseTo(expected, 2);
    });
  });

  describe('Commit Message Quality', () => {
    it('should have descriptive commit messages', () => {
      const config = generateHauntedRepo();
      
      for (const commit of config.commits) {
        // Messages should be at least 10 characters
        expect(commit.message.length).toBeGreaterThanOrEqual(10);
        
        // Messages should not be all uppercase
        expect(commit.message).not.toBe(commit.message.toUpperCase());
      }
    });

    it('should have commits that transform well with horror theming', () => {
      const config = generateHauntedRepo();
      const messages = config.commits.map(c => c.message.toLowerCase());
      
      // Check for words that transform well
      const goodWords = [
        'add', 'fix', 'remove', 'improve', 'breaking',
        'memory', 'leak', 'authentication', 'notification',
        'theme', 'dark', 'legacy', 'deprecated'
      ];
      
      let foundGoodWords = 0;
      for (const message of messages) {
        for (const word of goodWords) {
          if (message.includes(word)) {
            foundGoodWords++;
            break;
          }
        }
      }
      
      // At least 80% of commits should have transformation-friendly words
      expect(foundGoodWords / messages.length).toBeGreaterThan(0.8);
    });
  });

  describe('Release Structure', () => {
    it('should have meaningful release names', () => {
      const config = generateHauntedRepo();
      
      // Check that releases follow semantic versioning
      for (const release of config.releases) {
        const parts = release.version.split('.');
        expect(parts.length).toBe(3);
        expect(parseInt(parts[0])).toBeGreaterThanOrEqual(0);
        expect(parseInt(parts[1])).toBeGreaterThanOrEqual(0);
        expect(parseInt(parts[2])).toBeGreaterThanOrEqual(0);
      }
    });

    it('should have balanced commit distribution across releases', () => {
      const config = generateHauntedRepo();
      
      // Each release should have at least 3 commits
      for (const release of config.releases) {
        expect(release.commitHashes.length).toBeGreaterThanOrEqual(3);
      }
      
      // No release should have more than 50% of all commits
      const maxCommitsPerRelease = Math.max(...config.releases.map(r => r.commitHashes.length));
      expect(maxCommitsPerRelease / config.commits.length).toBeLessThan(0.5);
    });
  });
});

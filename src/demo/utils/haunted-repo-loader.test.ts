/**
 * Haunted Repository Loader Tests
 * 
 * Tests for the haunted repository utility functions.
 */

import { describe, it, expect } from 'vitest';
import {
  loadHauntedRepo,
  getAllCommits,
  getCommitsByRelease,
  getAllReleases,
  getReleaseByVersion,
  getLatestRelease,
  getCommitByHash,
  getRepoPath,
  validateHauntedRepo
} from './haunted-repo-loader';

describe('Haunted Repository Loader', () => {
  describe('loadHauntedRepo', () => {
    it('should load the haunted repository configuration', () => {
      const repo = loadHauntedRepo();
      expect(repo).toBeDefined();
      expect(repo.commits).toBeDefined();
      expect(repo.releases).toBeDefined();
      expect(repo.repoPath).toBeDefined();
    });
  });

  describe('getAllCommits', () => {
    it('should return all commits', () => {
      const commits = getAllCommits();
      expect(commits.length).toBeGreaterThanOrEqual(20);
    });

    it('should return commits with required properties', () => {
      const commits = getAllCommits();
      for (const commit of commits) {
        expect(commit.hash).toBeTruthy();
        expect(commit.message).toBeTruthy();
        expect(commit.author).toBeTruthy();
        expect(commit.email).toBeTruthy();
        expect(commit.timestamp).toBeInstanceOf(Date);
        expect(Array.isArray(commit.changedFiles)).toBe(true);
      }
    });
  });

  describe('getCommitsByRelease', () => {
    it('should return commits for a valid release', () => {
      const commits = getCommitsByRelease('1.0.0');
      expect(commits.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent release', () => {
      const commits = getCommitsByRelease('99.99.99');
      expect(commits).toEqual([]);
    });

    it('should return correct commits for each release', () => {
      const releases = getAllReleases();
      
      for (const release of releases) {
        const commits = getCommitsByRelease(release.version);
        expect(commits.length).toBe(release.commitHashes.length);
        
        // Verify all returned commits are in the release
        for (const commit of commits) {
          expect(release.commitHashes).toContain(commit.hash);
        }
      }
    });
  });

  describe('getAllReleases', () => {
    it('should return all releases', () => {
      const releases = getAllReleases();
      expect(releases.length).toBeGreaterThanOrEqual(3);
    });

    it('should return releases with required properties', () => {
      const releases = getAllReleases();
      for (const release of releases) {
        expect(release.version).toBeTruthy();
        expect(release.date).toBeInstanceOf(Date);
        expect(release.commitHashes).toBeDefined();
        expect(release.commitHashes.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getReleaseByVersion', () => {
    it('should return release for valid version', () => {
      const release = getReleaseByVersion('1.0.0');
      expect(release).toBeDefined();
      expect(release?.version).toBe('1.0.0');
    });

    it('should return undefined for non-existent version', () => {
      const release = getReleaseByVersion('99.99.99');
      expect(release).toBeUndefined();
    });
  });

  describe('getLatestRelease', () => {
    it('should return the most recent release', () => {
      const latest = getLatestRelease();
      expect(latest).toBeDefined();
      expect(latest.version).toBe('2.1.0');
    });

    it('should have the latest date', () => {
      const latest = getLatestRelease();
      const allReleases = getAllReleases();
      
      for (const release of allReleases) {
        expect(latest.date.getTime()).toBeGreaterThanOrEqual(release.date.getTime());
      }
    });
  });

  describe('getCommitByHash', () => {
    it('should return commit for valid hash', () => {
      const allCommits = getAllCommits();
      const firstCommit = allCommits[0];
      
      const commit = getCommitByHash(firstCommit.hash);
      expect(commit).toBeDefined();
      expect(commit?.hash).toBe(firstCommit.hash);
    });

    it('should return undefined for non-existent hash', () => {
      const commit = getCommitByHash('nonexistent');
      expect(commit).toBeUndefined();
    });
  });

  describe('getRepoPath', () => {
    it('should return the repository path', () => {
      const path = getRepoPath();
      expect(path).toBeTruthy();
      expect(typeof path).toBe('string');
    });
  });

  describe('validateHauntedRepo', () => {
    it('should validate the haunted repository', () => {
      const result = validateHauntedRepo();
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return validation result with valid and errors properties', () => {
      const result = validateHauntedRepo();
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});

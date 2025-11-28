/**
 * Haunted Repository Loader
 * 
 * Utilities for loading and accessing the pre-configured haunted repository
 * data used in the demo.
 */

import type { CommitData } from '../../shared/types';
import type { HauntedRepoConfig, ReleaseConfig } from '../types/demo-types';
import { hauntedRepoConfig } from '../config/demo-config';

/**
 * Load Haunted Repository Configuration
 * Returns the pre-configured haunted repository data
 */
export function loadHauntedRepo(): HauntedRepoConfig {
  return hauntedRepoConfig;
}

/**
 * Get All Commits
 * Returns all commits from the haunted repository
 */
export function getAllCommits(): CommitData[] {
  return hauntedRepoConfig.commits;
}

/**
 * Get Commits by Release
 * Returns commits associated with a specific release version
 */
export function getCommitsByRelease(version: string): CommitData[] {
  const release = hauntedRepoConfig.releases.find(r => r.version === version);
  
  if (!release) {
    console.warn(`Release ${version} not found in haunted repository`);
    return [];
  }
  
  return hauntedRepoConfig.commits.filter(commit => 
    release.commitHashes.includes(commit.hash)
  );
}

/**
 * Get All Releases
 * Returns all release configurations
 */
export function getAllReleases(): ReleaseConfig[] {
  return hauntedRepoConfig.releases;
}

/**
 * Get Release by Version
 * Returns a specific release configuration
 */
export function getReleaseByVersion(version: string): ReleaseConfig | undefined {
  return hauntedRepoConfig.releases.find(r => r.version === version);
}

/**
 * Get Latest Release
 * Returns the most recent release
 */
export function getLatestRelease(): ReleaseConfig {
  const releases = hauntedRepoConfig.releases;
  return releases[releases.length - 1];
}

/**
 * Get Commit by Hash
 * Returns a specific commit by its hash
 */
export function getCommitByHash(hash: string): CommitData | undefined {
  return hauntedRepoConfig.commits.find(c => c.hash === hash);
}

/**
 * Get Repository Path
 * Returns the path to the haunted repository
 */
export function getRepoPath(): string {
  return hauntedRepoConfig.repoPath;
}

/**
 * Validate Haunted Repository
 * Checks that the haunted repository configuration is valid
 */
export function validateHauntedRepo(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check minimum commit count
  if (hauntedRepoConfig.commits.length < 20) {
    errors.push(`Expected at least 20 commits, found ${hauntedRepoConfig.commits.length}`);
  }
  
  // Check minimum release count
  if (hauntedRepoConfig.releases.length < 3) {
    errors.push(`Expected at least 3 releases, found ${hauntedRepoConfig.releases.length}`);
  }
  
  // Check that all release commit hashes exist
  for (const release of hauntedRepoConfig.releases) {
    for (const hash of release.commitHashes) {
      const commit = hauntedRepoConfig.commits.find(c => c.hash === hash);
      if (!commit) {
        errors.push(`Release ${release.version} references non-existent commit ${hash}`);
      }
    }
  }
  
  // Check for duplicate commit hashes
  const hashes = hauntedRepoConfig.commits.map(c => c.hash);
  const uniqueHashes = new Set(hashes);
  if (hashes.length !== uniqueHashes.size) {
    errors.push('Duplicate commit hashes found');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

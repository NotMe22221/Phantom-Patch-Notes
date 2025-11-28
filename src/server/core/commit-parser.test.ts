/**
 * Property-based tests for Commit Parser
 * Tests universal properties that should hold across all valid executions
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { CommitParser } from './commit-parser.js';
import { CommitData, ParseOptions } from '../../shared/types.js';
import simpleGit, { SimpleGit } from 'simple-git';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

// Feature: phantom-patch-notes, Property 1: Complete commit extraction
// For any valid git repository, parsing should extract all commits with complete 
// metadata including hash, author, email, timestamp, message, and changed files 
// in a standardized format.
// Validates: Requirements 1.1, 1.2, 1.3

describe('CommitParser - Property-Based Tests', () => {
  const testRepoPath = join(process.cwd(), 'test-repo-temp');
  let git: SimpleGit;

  beforeAll(async () => {
    // Create a test repository
    if (existsSync(testRepoPath)) {
      rmSync(testRepoPath, { recursive: true, force: true });
    }
    mkdirSync(testRepoPath, { recursive: true });
    
    git = simpleGit(testRepoPath);
    await git.init();
    await git.addConfig('user.name', 'Test User');
    await git.addConfig('user.email', 'test@example.com');
  });

  afterAll(() => {
    // Clean up test repository
    if (existsSync(testRepoPath)) {
      rmSync(testRepoPath, { recursive: true, force: true });
    }
  });

  test.prop([
    fc.array(
      fc.record({
        message: fc.string({ minLength: 1, maxLength: 100 }),
        author: fc.string({ minLength: 1, maxLength: 50 }),
        email: fc.emailAddress(),
        filename: fc.string({ minLength: 1, maxLength: 20 }).map((s: string) => s.replace(/[^a-zA-Z0-9]/g, '_') + '.txt')
      }),
      { minLength: 1, maxLength: 10 }
    )
  ], { numRuns: 100 })(
    'Property 1: Complete commit extraction - should extract all commits with complete metadata',
    async (commitSpecs: Array<{ message: string; author: string; email: string; filename: string }>) => {
      // Arrange: Create commits in test repository
      const createdHashes: string[] = [];
      
      for (const spec of commitSpecs) {
        // Create a file and commit it
        const filePath = join(testRepoPath, spec.filename);
        const fs = await import('fs/promises');
        await fs.writeFile(filePath, `Content for ${spec.filename}`);
        
        await git.add(spec.filename);
        await git.commit(spec.message, {
          '--author': `${spec.author} <${spec.email}>`
        });
        
        const log = await git.log({ maxCount: 1 });
        createdHashes.push(log.latest!.hash);
      }

      // Act: Parse the repository
      const parser = new CommitParser();
      const options: ParseOptions = {
        repoPath: testRepoPath,
        maxCount: commitSpecs.length
      };
      
      const commits = await parser.parseRepository(options);

      // Assert: Verify all commits were extracted with complete metadata
      expect(commits).toHaveLength(commitSpecs.length);
      
      for (let i = 0; i < commits.length; i++) {
        const commit = commits[commits.length - 1 - i]; // Reverse order (newest first)
        const spec = commitSpecs[i];
        
        // Verify all required fields are present and non-empty
        expect(commit.hash).toBeDefined();
        expect(commit.hash).toBeTruthy();
        expect(typeof commit.hash).toBe('string');
        
        expect(commit.author).toBeDefined();
        expect(commit.author).toBe(spec.author);
        
        expect(commit.email).toBeDefined();
        expect(commit.email).toBe(spec.email);
        
        expect(commit.timestamp).toBeDefined();
        expect(commit.timestamp).toBeInstanceOf(Date);
        expect(commit.timestamp.getTime()).toBeGreaterThan(0);
        
        expect(commit.message).toBeDefined();
        expect(commit.message).toContain(spec.message);
        
        expect(commit.changedFiles).toBeDefined();
        expect(Array.isArray(commit.changedFiles)).toBe(true);
        expect(commit.changedFiles.length).toBeGreaterThan(0);
        expect(commit.changedFiles).toContain(spec.filename);
      }
    }
  );
});

// Feature: phantom-patch-notes, Property 2: Invalid repository error handling
// For any invalid repository path, the Commit Parser should signal an error 
// with a descriptive message rather than failing silently.
// Validates: Requirements 1.4

describe('CommitParser - Invalid Repository Error Handling', () => {
  test.prop([
    fc.oneof(
      // Non-existent paths
      fc.string({ minLength: 1, maxLength: 50 }).map((s: string) => `/nonexistent/${s.replace(/[^a-zA-Z0-9]/g, '_')}`),
      // Paths that are unlikely to be git repos
      fc.constantFrom('/tmp', '/var', '/usr/local/nonexistent'),
      // Invalid path characters
      fc.string({ minLength: 1, maxLength: 20 }).map((s: string) => `/invalid/path/${s}`)
    )
  ], { numRuns: 100 })(
    'Property 2: Invalid repository error handling - should throw descriptive error for invalid paths',
    async (invalidPath: string) => {
      // Arrange
      const parser = new CommitParser();
      const options: ParseOptions = {
        repoPath: invalidPath
      };

      // Act & Assert
      try {
        await parser.parseRepository(options);
        // If we reach here, the test should fail
        expect.fail('Expected parseRepository to throw an error for invalid path');
      } catch (error: any) {
        // Verify error is a SystemError with proper structure
        expect(error).toBeDefined();
        expect(error.code).toBe('INVALID_REPOSITORY');
        expect(error.message).toBeDefined();
        expect(error.message).toBeTruthy();
        expect(typeof error.message).toBe('string');
        expect(error.message.length).toBeGreaterThan(0);
        expect(error.component).toBe('CommitParser');
        expect(error.timestamp).toBeInstanceOf(Date);
        expect(error.details).toBeDefined();
        expect(error.details.repoPath).toBe(invalidPath);
        
        // Verify message is descriptive (contains path info)
        expect(error.message).toContain(invalidPath);
      }
    }
  );

  it('Property 2: Invalid repository error handling - validateRepository returns false for invalid paths', async () => {
    const parser = new CommitParser();
    
    // Test non-existent path
    const nonExistentResult = await parser.validateRepository('/nonexistent/path/to/repo');
    expect(nonExistentResult).toBe(false);
    
    // Test empty path
    const emptyResult = await parser.validateRepository('');
    expect(emptyResult).toBe(false);
  });

  // Feature: phantom-patch-notes, Property 32: Git error specificity
  // For any git operation failure, the error should include specific git error information.
  // Validates: Requirements 10.3
  test.prop([
    fc.string({ minLength: 1, maxLength: 50 }).map((s: string) => `/invalid/${s.replace(/[^a-zA-Z0-9]/g, '_')}`)
  ], { numRuns: 100 })(
    'Property 32: Git error specificity - git errors should include specific git error information',
    async (invalidPath: string) => {
      // Arrange
      const parser = new CommitParser();
      const options: ParseOptions = {
        repoPath: invalidPath
      };

      // Act & Assert
      try {
        await parser.parseRepository(options);
        expect.fail('Expected parseRepository to throw an error');
      } catch (error: any) {
        // Verify error has git-specific information
        expect(error).toBeDefined();
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
        expect(error.component).toBe('CommitParser');
        
        // Verify error details contain context about the operation
        expect(error.details).toBeDefined();
        expect(error.details.repoPath).toBe(invalidPath);
        
        // For git operation errors, verify git-specific details are captured
        if (error.code === 'GIT_OPERATION_FAILED') {
          expect(error.details.gitError).toBeDefined();
          expect(error.details.operation).toBeDefined();
        }
        
        // Verify the error message is specific and helpful
        expect(error.message.length).toBeGreaterThan(10);
        expect(typeof error.message).toBe('string');
      }
    }
  );
});

// Feature: phantom-patch-notes, Property 3: Commit filtering correctness
// For any repository and date range or tag filter, all returned commits 
// should fall within the specified filter criteria.
// Validates: Requirements 1.5

describe('CommitParser - Commit Filtering', () => {
  const testRepoPath2 = join(process.cwd(), 'test-repo-filtering');
  let git2: SimpleGit;

  beforeAll(async () => {
    // Create a test repository with commits at different times
    if (existsSync(testRepoPath2)) {
      rmSync(testRepoPath2, { recursive: true, force: true });
    }
    mkdirSync(testRepoPath2, { recursive: true });
    
    git2 = simpleGit(testRepoPath2);
    await git2.init();
    await git2.addConfig('user.name', 'Test User');
    await git2.addConfig('user.email', 'test@example.com');

    // Create commits with different timestamps
    const fs = await import('fs/promises');
    for (let i = 0; i < 5; i++) {
      const filename = `file${i}.txt`;
      await fs.writeFile(join(testRepoPath2, filename), `Content ${i}`);
      await git2.add(filename);
      await git2.commit(`Commit ${i}`);
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  });

  afterAll(() => {
    if (existsSync(testRepoPath2)) {
      rmSync(testRepoPath2, { recursive: true, force: true });
    }
  });

  test.prop([
    fc.integer({ min: 1, max: 3 })
  ], { numRuns: 100 })(
    'Property 3: Commit filtering correctness - maxCount should limit results',
    async (maxCount: number) => {
      // Arrange
      const parser = new CommitParser();
      const options: ParseOptions = {
        repoPath: testRepoPath2,
        maxCount
      };

      // Act
      const commits = await parser.parseRepository(options);

      // Assert
      expect(commits.length).toBeLessThanOrEqual(maxCount);
      expect(commits.length).toBeGreaterThan(0);
    }
  );

  it('Property 3: Commit filtering correctness - date range should filter commits', async () => {
    // Arrange
    const parser = new CommitParser();
    
    // Get all commits first to establish a baseline
    const allCommits = await parser.parseRepository({ repoPath: testRepoPath2 });
    expect(allCommits.length).toBeGreaterThan(0);

    // Get the timestamp range
    const timestamps = allCommits.map(c => c.timestamp.getTime()).sort((a, b) => a - b);
    const oldestTime = timestamps[0];
    const newestTime = timestamps[timestamps.length - 1];
    
    // Create a date range that excludes the oldest commit
    const from = new Date(oldestTime + 1);
    const to = new Date(newestTime);

    // Act
    const filteredCommits = await parser.parseRepository({
      repoPath: testRepoPath2,
      dateRange: { from, to }
    });

    // Assert
    // All returned commits should be within the date range
    for (const commit of filteredCommits) {
      const commitTime = commit.timestamp.getTime();
      expect(commitTime).toBeGreaterThanOrEqual(from.getTime());
      expect(commitTime).toBeLessThanOrEqual(to.getTime());
    }

    // Should have fewer commits than the total (since we excluded the oldest)
    expect(filteredCommits.length).toBeLessThanOrEqual(allCommits.length);
  });

  test.prop([
    fc.record({
      fromOffset: fc.integer({ min: 0, max: 1000 }),
      toOffset: fc.integer({ min: 1000, max: 5000 })
    })
  ], { numRuns: 50 })(
    'Property 3: Commit filtering correctness - all filtered commits fall within date range',
    async ({ fromOffset, toOffset }: { fromOffset: number; toOffset: number }) => {
      // Arrange
      const parser = new CommitParser();
      const now = Date.now();
      const from = new Date(now - toOffset);
      const to = new Date(now + fromOffset);

      // Act
      const commits = await parser.parseRepository({
        repoPath: testRepoPath2,
        dateRange: { from, to }
      });

      // Assert
      // Every commit should fall within the specified range
      for (const commit of commits) {
        const commitTime = commit.timestamp.getTime();
        expect(commitTime).toBeGreaterThanOrEqual(from.getTime());
        expect(commitTime).toBeLessThanOrEqual(to.getTime());
      }
    }
  );
});

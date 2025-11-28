/**
 * Tests for Patch Note Generator
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { PatchNoteGenerator } from './generator.js';
import type { CommitData } from '../../shared/types.js';

type CommitsByType = {
  features: CommitData[];
  fixes: CommitData[];
  breaking: CommitData[];
  other: CommitData[];
};

describe('PatchNoteGenerator', () => {
  describe('Property-Based Tests', () => {
    // Feature: phantom-patch-notes, Property 5: Commit grouping by type
    // Validates: Requirements 2.3
    it('should group commits by type such that all commits in a section share the same type', () => {
      const generator = new PatchNoteGenerator();

      // Arbitrary for generating commit messages with specific keywords
      const featureMessageArb = fc.constantFrom(
        'feat: add new feature',
        'feature: implement something',
        'add: new component',
        'added user authentication',
        'create new module',
        'implement API endpoint'
      );

      const fixMessageArb = fc.constantFrom(
        'fix: resolve bug',
        'fixed issue with login',
        'bug: correct validation',
        'bugfix for crash',
        'patch security vulnerability',
        'resolve memory leak'
      );

      const breakingMessageArb = fc.constantFrom(
        'breaking: remove old API',
        'break: change interface',
        'BREAKING CHANGE: update schema',
        'breaking change in config'
      );

      const otherMessageArb = fc.constantFrom(
        'update documentation',
        'refactor code structure',
        'chore: update dependencies',
        'style: format code',
        'docs: improve readme'
      );

      // Arbitrary for generating a commit with a specific message
      const commitArb = (messageArb: fc.Arbitrary<string>): fc.Arbitrary<CommitData> =>
        fc.record({
          hash: fc.hexaString({ minLength: 40, maxLength: 40 }),
          author: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          timestamp: fc.date(),
          message: messageArb,
          changedFiles: fc.array(fc.string(), { maxLength: 5 })
        });

      // Generate arrays of commits for each type
      const commitsArb = fc.record({
        features: fc.array(commitArb(featureMessageArb), { maxLength: 10 }),
        fixes: fc.array(commitArb(fixMessageArb), { maxLength: 10 }),
        breaking: fc.array(commitArb(breakingMessageArb), { maxLength: 10 }),
        other: fc.array(commitArb(otherMessageArb), { maxLength: 10 })
      });

      fc.assert(
        fc.property(commitsArb, (commitsByType: CommitsByType) => {
          // Combine all commits
          const allCommits = [
            ...commitsByType.features,
            ...commitsByType.fixes,
            ...commitsByType.breaking,
            ...commitsByType.other
          ];

          // Group commits
          const grouped = generator.groupCommits(allCommits);

          // Property: All commits in 'features' group should be detected as features
          for (const commit of grouped.get('features') || []) {
            const message = commit.message.toLowerCase();
            const isFeature = message.match(/\b(feat|feature|add|added|new|create|created|implement|implemented)\b/);
            const isBreaking = message.includes('breaking') || message.includes('break:') || message.match(/^breaking[\s:]/);
            const isFix = message.match(/\b(fix|fixed|bug|bugfix|patch|resolve|resolved|hotfix)\b/);
            
            // Should be a feature and not breaking or fix (which have higher priority)
            expect(isFeature && !isBreaking && !isFix).toBe(true);
          }

          // Property: All commits in 'fixes' group should be detected as fixes
          for (const commit of grouped.get('fixes') || []) {
            const message = commit.message.toLowerCase();
            const isFix = message.match(/\b(fix|fixed|bug|bugfix|patch|resolve|resolved|hotfix)\b/);
            const isBreaking = message.includes('breaking') || message.includes('break:') || message.match(/^breaking[\s:]/);
            
            // Should be a fix and not breaking (which has higher priority)
            expect(isFix && !isBreaking).toBe(true);
          }

          // Property: All commits in 'breaking' group should be detected as breaking
          for (const commit of grouped.get('breaking') || []) {
            const message = commit.message.toLowerCase();
            const isBreaking = message.includes('breaking') || message.includes('break:') || message.match(/^breaking[\s:]/);
            expect(isBreaking).toBe(true);
          }

          // Property: All commits should be in exactly one group
          const totalGrouped = 
            (grouped.get('features')?.length || 0) +
            (grouped.get('fixes')?.length || 0) +
            (grouped.get('breaking')?.length || 0) +
            (grouped.get('other')?.length || 0);
          
          expect(totalGrouped).toBe(allCommits.length);
        }),
        { numRuns: 100 }
      );
    });

    // Feature: phantom-patch-notes, Property 4: Theme transformation preserves original
    // Validates: Requirements 2.2, 2.5
    it('should preserve original commit messages alongside themed versions in generated patch notes', async () => {
      const generator = new PatchNoteGenerator();

      // Arbitrary for generating random commits
      const commitArb = fc.record({
        hash: fc.hexaString({ minLength: 40, maxLength: 40 }),
        author: fc.string({ minLength: 1, maxLength: 50 }),
        email: fc.emailAddress(),
        timestamp: fc.date(),
        message: fc.string({ minLength: 5, maxLength: 100 }),
        changedFiles: fc.array(fc.string(), { maxLength: 5 })
      });

      const commitsArrayArb = fc.array(commitArb, { minLength: 1, maxLength: 20 });

      await fc.assert(
        fc.property(commitsArrayArb, async (commits: CommitData[]) => {
          // Generate patch notes
          const patchNote = await generator.generate({ commits });

          // Property 1: All original commits should be preserved
          expect(patchNote.originalCommits).toEqual(commits);

          // Property 2: Every entry should have both themed and original versions
          for (const section of patchNote.sections) {
            for (const entry of section.entries) {
              // Original message must exist and not be empty
              expect(entry.original).toBeDefined();
              expect(entry.original.length).toBeGreaterThan(0);

              // Themed message must exist
              expect(entry.themed).toBeDefined();

              // Commit hash must exist
              expect(entry.commitHash).toBeDefined();
              expect(entry.commitHash.length).toBe(40);

              // The original message should match one of the input commits
              const matchingCommit = commits.find((c: CommitData) => c.hash === entry.commitHash);
              expect(matchingCommit).toBeDefined();
              expect(entry.original).toBe(matchingCommit!.message);
            }
          }

          // Property 3: Total number of entries should equal number of commits
          const totalEntries = patchNote.sections.reduce(
            (sum, section) => sum + section.entries.length,
            0
          );
          expect(totalEntries).toBe(commits.length);

          // Property 4: Every commit should appear in exactly one entry
          const entryHashes = new Set<string>();
          for (const section of patchNote.sections) {
            for (const entry of section.entries) {
              entryHashes.add(entry.commitHash);
            }
          }
          expect(entryHashes.size).toBe(commits.length);

          // All commit hashes should be present
          for (const commit of commits) {
            expect(entryHashes.has(commit.hash)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});

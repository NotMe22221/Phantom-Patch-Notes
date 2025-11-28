/**
 * Module Pipeline Compatibility Tests
 * Tests that data flows correctly through the system pipeline
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { CommitParser } from './commit-parser.js';
import { PatchNoteGenerator } from './generator.js';
import { ExportSystem } from './export.js';
import { ThemeEngine } from './theme-engine.js';
import type { CommitData, ParseOptions, PatchNote } from '../../shared/types.js';
import simpleGit, { SimpleGit } from 'simple-git';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

// Feature: phantom-patch-notes, Property 30: Module pipeline compatibility
// For any data flowing through the system, the output of the Commit Parser 
// should be valid input for the Patch Note Generator, and the output of the 
// Patch Note Generator should be valid input for the Export System.
// Validates: Requirements 9.2, 9.3

describe('Module Pipeline Compatibility', () => {
  const testRepoPath = join(process.cwd(), 'test-repo-pipeline');
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

    // Create some commits
    const fs = await import('fs/promises');
    for (let i = 0; i < 3; i++) {
      const filename = `file${i}.txt`;
      await fs.writeFile(join(testRepoPath, filename), `Content ${i}`);
      await git.add(filename);
      await git.commit(`feat: Add feature ${i}`);
    }
  });

  afterAll(() => {
    if (existsSync(testRepoPath)) {
      rmSync(testRepoPath, { recursive: true, force: true });
    }
  });

  test.prop([
    fc.record({
      version: fc.string({ minLength: 1, maxLength: 20 }),
      themeName: fc.constantFrom('haunted'),
      exportFormat: fc.constantFrom('markdown', 'html', 'json')
    })
  ], { numRuns: 100 })(
    'Property 30: Module pipeline compatibility - CommitParser → Generator → ExportSystem',
    async ({ version, themeName, exportFormat }: { version: string; themeName: string; exportFormat: string }) => {
      // Step 1: CommitParser produces CommitData[]
      const parser = new CommitParser();
      const parseOptions: ParseOptions = {
        repoPath: testRepoPath
      };
      
      const commits: CommitData[] = await parser.parseRepository(parseOptions);
      
      // Verify CommitParser output is valid
      expect(Array.isArray(commits)).toBe(true);
      expect(commits.length).toBeGreaterThan(0);
      
      for (const commit of commits) {
        // Verify all required fields are present
        expect(commit).toHaveProperty('hash');
        expect(commit).toHaveProperty('author');
        expect(commit).toHaveProperty('email');
        expect(commit).toHaveProperty('timestamp');
        expect(commit).toHaveProperty('message');
        expect(commit).toHaveProperty('changedFiles');
        
        // Verify types
        expect(typeof commit.hash).toBe('string');
        expect(typeof commit.author).toBe('string');
        expect(typeof commit.email).toBe('string');
        expect(commit.timestamp).toBeInstanceOf(Date);
        expect(typeof commit.message).toBe('string');
        expect(Array.isArray(commit.changedFiles)).toBe(true);
      }

      // Step 2: PatchNoteGenerator accepts CommitData[] and produces PatchNote
      const themeEngine = new ThemeEngine();
      const generator = new PatchNoteGenerator(themeEngine);
      
      const patchNote: PatchNote = await generator.generate({
        commits,
        version,
        themeName
      });
      
      // Verify PatchNoteGenerator output is valid
      expect(patchNote).toBeDefined();
      expect(patchNote).toHaveProperty('version');
      expect(patchNote).toHaveProperty('date');
      expect(patchNote).toHaveProperty('sections');
      expect(patchNote).toHaveProperty('originalCommits');
      
      // Verify types
      expect(typeof patchNote.version).toBe('string');
      expect(patchNote.date).toBeInstanceOf(Date);
      expect(Array.isArray(patchNote.sections)).toBe(true);
      expect(Array.isArray(patchNote.originalCommits)).toBe(true);
      
      // Verify sections structure
      for (const section of patchNote.sections) {
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('type');
        expect(section).toHaveProperty('entries');
        expect(typeof section.title).toBe('string');
        expect(['features', 'fixes', 'breaking', 'other']).toContain(section.type);
        expect(Array.isArray(section.entries)).toBe(true);
        
        // Verify entries structure
        for (const entry of section.entries) {
          expect(entry).toHaveProperty('themed');
          expect(entry).toHaveProperty('original');
          expect(entry).toHaveProperty('commitHash');
          expect(typeof entry.themed).toBe('string');
          expect(typeof entry.original).toBe('string');
          expect(typeof entry.commitHash).toBe('string');
        }
      }
      
      // Verify originalCommits matches input
      expect(patchNote.originalCommits).toEqual(commits);

      // Step 3: ExportSystem accepts PatchNote and produces ExportResult
      const exportSystem = new ExportSystem();
      
      const exportResult = exportSystem.export(patchNote, {
        format: exportFormat as 'markdown' | 'html' | 'json',
        includeStyles: true,
        pretty: true
      });
      
      // Verify ExportSystem output is valid
      expect(exportResult).toBeDefined();
      expect(exportResult).toHaveProperty('content');
      expect(exportResult).toHaveProperty('mimeType');
      expect(exportResult).toHaveProperty('filename');
      
      // Verify types
      expect(typeof exportResult.content).toBe('string');
      expect(typeof exportResult.mimeType).toBe('string');
      expect(typeof exportResult.filename).toBe('string');
      
      // Verify content is non-empty
      expect(exportResult.content.length).toBeGreaterThan(0);
      
      // Verify mimeType matches format
      if (exportFormat === 'markdown') {
        expect(exportResult.mimeType).toBe('text/markdown');
      } else if (exportFormat === 'html') {
        expect(exportResult.mimeType).toBe('text/html');
      } else if (exportFormat === 'json') {
        expect(exportResult.mimeType).toBe('application/json');
      }
      
      // Verify filename contains version
      expect(exportResult.filename).toContain(patchNote.version);
    }
  );

  it('Property 30: Module pipeline compatibility - end-to-end with real data', async () => {
    // Complete pipeline test with real repository
    const parser = new CommitParser();
    const themeEngine = new ThemeEngine();
    const generator = new PatchNoteGenerator(themeEngine);
    const exportSystem = new ExportSystem();

    // Step 1: Parse commits
    const commits = await parser.parseRepository({ repoPath: testRepoPath });
    expect(commits.length).toBeGreaterThan(0);

    // Step 2: Generate patch notes
    const patchNote = await generator.generate({
      commits,
      version: 'v1.0.0',
      themeName: 'haunted'
    });
    expect(patchNote.sections.length).toBeGreaterThan(0);

    // Step 3: Export to all formats
    const formats: Array<'markdown' | 'html' | 'json'> = ['markdown', 'html', 'json'];
    
    for (const format of formats) {
      const result = exportSystem.export(patchNote, { format });
      
      expect(result.content).toBeTruthy();
      expect(result.mimeType).toBeTruthy();
      expect(result.filename).toBeTruthy();
      
      // Verify content contains version
      expect(result.content).toContain(patchNote.version);
    }
  });

  it('Property 30: Module pipeline compatibility - JSON round-trip preserves structure', async () => {
    // Test that JSON export can be parsed back to PatchNote
    const parser = new CommitParser();
    const themeEngine = new ThemeEngine();
    const generator = new PatchNoteGenerator(themeEngine);
    const exportSystem = new ExportSystem();

    // Generate patch note
    const commits = await parser.parseRepository({ repoPath: testRepoPath });
    const originalPatchNote = await generator.generate({
      commits,
      version: 'v1.0.0'
    });

    // Export to JSON
    const jsonResult = exportSystem.export(originalPatchNote, {
      format: 'json',
      pretty: true
    });

    // Parse JSON back
    const parsedPatchNote = JSON.parse(jsonResult.content);

    // Verify structure is preserved
    expect(parsedPatchNote.version).toBe(originalPatchNote.version);
    expect(parsedPatchNote.sections.length).toBe(originalPatchNote.sections.length);
    expect(parsedPatchNote.originalCommits.length).toBe(originalPatchNote.originalCommits.length);

    // Verify sections match
    for (let i = 0; i < originalPatchNote.sections.length; i++) {
      const originalSection = originalPatchNote.sections[i];
      const parsedSection = parsedPatchNote.sections[i];
      
      expect(parsedSection.title).toBe(originalSection.title);
      expect(parsedSection.type).toBe(originalSection.type);
      expect(parsedSection.entries.length).toBe(originalSection.entries.length);
    }
  });

  test.prop([
    fc.array(
      fc.record({
        hash: fc.hexaString({ minLength: 40, maxLength: 40 }),
        author: fc.string({ minLength: 1, maxLength: 50 }),
        email: fc.emailAddress(),
        timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
        message: fc.string({ minLength: 1, maxLength: 100 }),
        changedFiles: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 })
      }),
      { minLength: 1, maxLength: 10 }
    )
  ], { numRuns: 50 })(
    'Property 30: Module pipeline compatibility - synthetic commits flow through pipeline',
    async (syntheticCommits: CommitData[]) => {
      // Test that manually created CommitData can flow through the pipeline
      const themeEngine = new ThemeEngine();
      const generator = new PatchNoteGenerator(themeEngine);
      const exportSystem = new ExportSystem();

      // Generate patch notes from synthetic commits
      const patchNote = await generator.generate({
        commits: syntheticCommits,
        version: 'v1.0.0'
      });

      // Verify generation succeeded
      expect(patchNote).toBeDefined();
      expect(patchNote.originalCommits).toEqual(syntheticCommits);

      // Export to all formats
      const formats: Array<'markdown' | 'html' | 'json'> = ['markdown', 'html', 'json'];
      
      for (const format of formats) {
        const result = exportSystem.export(patchNote, { format });
        
        expect(result.content).toBeTruthy();
        expect(result.content.length).toBeGreaterThan(0);
      }
    }
  );
});

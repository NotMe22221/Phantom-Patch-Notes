/**
 * Property-based tests for Preview Mode synthetic data generation
 */

import { describe, it, expect } from 'vitest';
import { generateSampleCommits, isSyntheticData } from './sample-commits.js';
import type { CommitData } from '../shared/types.js';

describe('Preview Mode - Sample Commits', () => {
  // Feature: phantom-patch-notes, Property 18: Preview mode generates synthetic data
  // For any preview mode activation, the system should generate synthetic commit data with all required fields
  describe('Property 18: Preview mode generates synthetic data', () => {
    it('should generate synthetic commits with all required fields', () => {
      // Run the test multiple times to ensure consistency
      for (let i = 0; i < 100; i++) {
        const commits = generateSampleCommits();
        
        // Verify commits are generated
        expect(commits.length).toBeGreaterThan(0);
        
        // Verify all commits have required fields
        for (const commit of commits) {
          // Check all required fields exist and are non-empty
          expect(commit.hash).toBeDefined();
          expect(commit.hash).not.toBe('');
          expect(typeof commit.hash).toBe('string');
          
          expect(commit.author).toBeDefined();
          expect(commit.author).not.toBe('');
          expect(typeof commit.author).toBe('string');
          
          expect(commit.email).toBeDefined();
          expect(commit.email).not.toBe('');
          expect(typeof commit.email).toBe('string');
          
          expect(commit.timestamp).toBeDefined();
          expect(commit.timestamp).toBeInstanceOf(Date);
          expect(commit.timestamp.getTime()).not.toBeNaN();
          
          expect(commit.message).toBeDefined();
          expect(commit.message).not.toBe('');
          expect(typeof commit.message).toBe('string');
          
          expect(commit.changedFiles).toBeDefined();
          expect(Array.isArray(commit.changedFiles)).toBe(true);
        }
        
        // Verify commits are marked as synthetic
        expect(isSyntheticData(commits)).toBe(true);
      }
    });
    
    it('should generate diverse commit messages demonstrating different patterns', () => {
      const commits = generateSampleCommits();
      
      // Check for variety in commit types
      const messages = commits.map(c => c.message.toLowerCase());
      
      // Should have feature commits
      const hasFeatures = messages.some(m => 
        m.includes('feat') || m.includes('feature') || m.includes('add') || 
        m.includes('create') || m.includes('implement')
      );
      expect(hasFeatures).toBe(true);
      
      // Should have fix commits
      const hasFixes = messages.some(m => 
        m.includes('fix') || m.includes('bug') || m.includes('resolve') || 
        m.includes('patch') || m.includes('hotfix')
      );
      expect(hasFixes).toBe(true);
      
      // Should have breaking changes
      const hasBreaking = messages.some(m => 
        m.includes('breaking') || m.includes('break')
      );
      expect(hasBreaking).toBe(true);
      
      // Should have other types (docs, refactor, etc.)
      const hasOther = messages.some(m => 
        m.includes('docs') || m.includes('refactor') || m.includes('style') || 
        m.includes('chore') || m.includes('test')
      );
      expect(hasOther).toBe(true);
    });
    
    it('should generate realistic metadata (authors, emails, timestamps)', () => {
      const commits = generateSampleCommits();
      
      // Check authors are realistic
      for (const commit of commits) {
        expect(commit.author.length).toBeGreaterThan(3);
        expect(commit.author).toMatch(/^[A-Za-z\s]+$/);
        
        // Check email format
        expect(commit.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
        
        // Check timestamp is reasonable (within last year)
        const now = Date.now();
        const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
        expect(commit.timestamp.getTime()).toBeGreaterThan(oneYearAgo);
        expect(commit.timestamp.getTime()).toBeLessThanOrEqual(now);
      }
    });
  });
  
  describe('isSyntheticData', () => {
    it('should correctly identify synthetic commits', () => {
      const syntheticCommits = generateSampleCommits();
      expect(isSyntheticData(syntheticCommits)).toBe(true);
    });
    
    it('should return false for empty array', () => {
      expect(isSyntheticData([])).toBe(false);
    });
    
    it('should return false for real commits', () => {
      const realCommits: CommitData[] = [{
        hash: 'abc123def456',
        author: 'Real Author',
        email: 'real@example.com',
        timestamp: new Date(),
        message: 'Real commit message',
        changedFiles: ['file.ts']
      }];
      
      expect(isSyntheticData(realCommits)).toBe(false);
    });
  });
});

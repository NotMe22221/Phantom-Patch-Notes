/**
 * Preview Mode synthetic data generator
 * Generates realistic commit data for demonstration purposes
 */

import type { CommitData } from '../shared/types.js';

/**
 * Marker hash prefix for synthetic commits
 */
const SYNTHETIC_HASH_PREFIX = 'synthetic-';

/**
 * Sample commit messages demonstrating different patterns
 */
const SAMPLE_MESSAGES = {
  features: [
    'feat: add dark ritual summoning system',
    'feature: implement spectral navigation component',
    'add: new haunted theme engine',
    'create: phantom user authentication',
    'implement: cursed data persistence layer'
  ],
  fixes: [
    'fix: resolve ghost rendering bug in timeline',
    'bugfix: patch memory leak in shadow realm',
    'fix: correct wraith positioning calculations',
    'resolve: haunted cache invalidation issue',
    'hotfix: repair broken necromancy API'
  ],
  breaking: [
    'breaking: shatter old ritual system',
    'BREAKING CHANGE: rewrite phantom core architecture',
    'breaking: transform curse application logic',
    'break: redesign spectral interface contracts'
  ],
  other: [
    'docs: update haunted mansion documentation',
    'refactor: reorganize crypt structure',
    'style: apply gothic formatting standards',
    'chore: update dependencies from the void',
    'test: add property tests for dark magic'
  ]
};

/**
 * Sample authors for synthetic commits
 */
const SAMPLE_AUTHORS = [
  { name: 'Morticia Addams', email: 'morticia@haunted.dev' },
  { name: 'Victor Frankenstein', email: 'victor@monster.lab' },
  { name: 'Vlad Dracula', email: 'vlad@castle.transylvania' },
  { name: 'Wednesday Addams', email: 'wednesday@darkness.io' },
  { name: 'Edgar Allan Poe', email: 'edgar@nevermore.com' }
];

/**
 * Sample file paths for changed files
 */
const SAMPLE_FILES = [
  'src/haunted/ritual.ts',
  'src/spectral/navigation.tsx',
  'src/phantom/auth.ts',
  'src/cursed/database.ts',
  'src/wraith/timeline.ts',
  'src/necromancy/api.ts',
  'src/shadow/realm.ts',
  'docs/grimoire.md',
  'tests/dark-magic.test.ts',
  'config/crypt.json'
];

/**
 * Generate synthetic commit data for preview mode
 * Creates realistic commits with varied types demonstrating different patterns
 * @returns Array of synthetic commit data clearly marked as synthetic
 */
export function generateSampleCommits(): CommitData[] {
  const commits: CommitData[] = [];
  const now = Date.now();
  
  // Generate commits from different categories
  const categories = [
    { messages: SAMPLE_MESSAGES.features, count: 5 },
    { messages: SAMPLE_MESSAGES.fixes, count: 5 },
    { messages: SAMPLE_MESSAGES.breaking, count: 3 },
    { messages: SAMPLE_MESSAGES.other, count: 5 }
  ];

  let commitIndex = 0;
  
  for (const category of categories) {
    for (let i = 0; i < category.count && i < category.messages.length; i++) {
      const author = SAMPLE_AUTHORS[commitIndex % SAMPLE_AUTHORS.length];
      
      // Create commits with timestamps spread over the last 30 days
      const daysAgo = Math.floor(commitIndex * (30 / 18)); // Spread 18 commits over 30 days
      const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      
      // Select 1-3 random files
      const fileCount = 1 + Math.floor(Math.random() * 3);
      const changedFiles: string[] = [];
      for (let f = 0; f < fileCount; f++) {
        const fileIndex = (commitIndex + f) % SAMPLE_FILES.length;
        changedFiles.push(SAMPLE_FILES[fileIndex]);
      }
      
      commits.push({
        hash: `${SYNTHETIC_HASH_PREFIX}${commitIndex.toString().padStart(8, '0')}`,
        author: author.name,
        email: author.email,
        timestamp,
        message: category.messages[i],
        changedFiles
      });
      
      commitIndex++;
    }
  }
  
  // Sort by timestamp descending (most recent first)
  commits.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return commits;
}

/**
 * Check if commit data is synthetic
 * @param commits - Array of commits to check
 * @returns True if commits are marked as synthetic
 */
export function isSyntheticData(commits: CommitData[]): boolean {
  if (commits.length === 0) {
    return false;
  }
  
  // Check if any commit has the synthetic hash prefix
  return commits.some(commit => commit.hash.startsWith(SYNTHETIC_HASH_PREFIX));
}

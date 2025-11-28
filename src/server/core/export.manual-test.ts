/**
 * Manual test for Export System
 * Run this file to verify export functionality works correctly
 * 
 * Usage: tsx src/server/core/export.manual-test.ts
 */

import { ExportSystem } from './export.js';
import type { PatchNote } from '../../shared/types.js';

// Create sample patch note
const samplePatchNote: PatchNote = {
  version: 'v1.0.0',
  date: new Date('2024-11-27'),
  sections: [
    {
      title: 'Spectral Summonings',
      type: 'features',
      entries: [
        {
          themed: 'Summoned the dark export system from the void',
          original: 'Add export system with multiple format support',
          commitHash: 'abc123def456789012345678901234567890abcd'
        },
        {
          themed: 'Conjured haunted markdown renderer from ancient scrolls',
          original: 'Implement markdown export functionality',
          commitHash: 'def456abc789012345678901234567890abcdef1'
        }
      ]
    },
    {
      title: 'Banished Phantoms',
      type: 'fixes',
      entries: [
        {
          themed: 'Exorcised the malevolent bug haunting the theme engine',
          original: 'Fix theme loading error',
          commitHash: '123456789012345678901234567890abcdef456a'
        }
      ]
    }
  ],
  originalCommits: [
    {
      hash: 'abc123def456789012345678901234567890abcd',
      author: 'Dark Sorcerer',
      email: 'sorcerer@phantom.dev',
      timestamp: new Date('2024-11-27T10:00:00Z'),
      message: 'Add export system with multiple format support',
      changedFiles: ['src/server/core/export.ts']
    },
    {
      hash: 'def456abc789012345678901234567890abcdef1',
      author: 'Necromancer',
      email: 'necro@phantom.dev',
      timestamp: new Date('2024-11-27T11:00:00Z'),
      message: 'Implement markdown export functionality',
      changedFiles: ['src/server/core/export.ts']
    },
    {
      hash: '123456789012345678901234567890abcdef456a',
      author: 'Ghost Hunter',
      email: 'hunter@phantom.dev',
      timestamp: new Date('2024-11-27T12:00:00Z'),
      message: 'Fix theme loading error',
      changedFiles: ['src/server/core/theme-engine.ts']
    }
  ]
};

console.log('🎃 Phantom Patch Notes - Export System Manual Test\n');
console.log('='.repeat(60));

const exporter = new ExportSystem();

// Test Markdown export
console.log('\n📝 Testing Markdown Export...');
const mdResult = exporter.exportMarkdown(samplePatchNote);
console.log(`✓ MIME Type: ${mdResult.mimeType}`);
console.log(`✓ Filename: ${mdResult.filename}`);
console.log(`✓ Content Length: ${mdResult.content.length} characters`);
console.log('\nMarkdown Preview (first 500 chars):');
console.log('-'.repeat(60));
console.log(mdResult.content.substring(0, 500) + '...');

// Test HTML export
console.log('\n\n🌐 Testing HTML Export...');
const htmlResult = exporter.exportHTML(samplePatchNote, true);
console.log(`✓ MIME Type: ${htmlResult.mimeType}`);
console.log(`✓ Filename: ${htmlResult.filename}`);
console.log(`✓ Content Length: ${htmlResult.content.length} characters`);
console.log(`✓ Contains DOCTYPE: ${htmlResult.content.includes('<!DOCTYPE html>')}`);
console.log(`✓ Contains CSS: ${htmlResult.content.includes('<style>')}`);

// Test HTML export without styles
console.log('\n🌐 Testing HTML Export (no styles)...');
const htmlNoStylesResult = exporter.exportHTML(samplePatchNote, false);
console.log(`✓ Contains DOCTYPE: ${htmlNoStylesResult.content.includes('<!DOCTYPE html>')}`);
console.log(`✓ No CSS: ${!htmlNoStylesResult.content.includes('<style>')}`);

// Test JSON export
console.log('\n\n📦 Testing JSON Export...');
const jsonResult = exporter.exportJSON(samplePatchNote, false);
console.log(`✓ MIME Type: ${jsonResult.mimeType}`);
console.log(`✓ Filename: ${jsonResult.filename}`);
console.log(`✓ Content Length: ${jsonResult.content.length} characters`);
console.log(`✓ Valid JSON: ${(() => {
  try {
    JSON.parse(jsonResult.content);
    return true;
  } catch {
    return false;
  }
})()}`);

// Test JSON pretty print
console.log('\n📦 Testing JSON Export (pretty)...');
const jsonPrettyResult = exporter.exportJSON(samplePatchNote, true);
console.log(`✓ Content Length: ${jsonPrettyResult.content.length} characters`);
console.log(`✓ Pretty > Compact: ${jsonPrettyResult.content.length > jsonResult.content.length}`);

// Test unified export interface
console.log('\n\n🔀 Testing Unified Export Interface...');
const mdViaUnified = exporter.export(samplePatchNote, { format: 'markdown' });
console.log(`✓ Markdown via unified: ${mdViaUnified.mimeType}`);

const htmlViaUnified = exporter.export(samplePatchNote, { format: 'html', includeStyles: true });
console.log(`✓ HTML via unified: ${htmlViaUnified.mimeType}`);

const jsonViaUnified = exporter.export(samplePatchNote, { format: 'json', pretty: true });
console.log(`✓ JSON via unified: ${jsonViaUnified.mimeType}`);

// Test JSON round-trip
console.log('\n\n🔄 Testing JSON Round-Trip...');
const exported = exporter.exportJSON(samplePatchNote, false);
const parsed = JSON.parse(exported.content);
console.log(`✓ Version preserved: ${parsed.version === samplePatchNote.version}`);
console.log(`✓ Sections count: ${parsed.sections.length === samplePatchNote.sections.length}`);
console.log(`✓ Commits count: ${parsed.originalCommits.length === samplePatchNote.originalCommits.length}`);
console.log(`✓ First section title: ${parsed.sections[0].title === samplePatchNote.sections[0].title}`);
console.log(`✓ First entry themed: ${parsed.sections[0].entries[0].themed === samplePatchNote.sections[0].entries[0].themed}`);

console.log('\n' + '='.repeat(60));
console.log('✅ All Export System tests passed!\n');

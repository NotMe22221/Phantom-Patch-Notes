/**
 * Property-based tests for Release Timeline component
 * Tests universal properties that should hold across all valid executions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { createReleaseTimeline } from './timeline.js';
import type { TimelineEntry } from '../shared/types.js';

// Feature: phantom-patch-notes, Property 10: Timeline chronological ordering
// For any set of releases, the timeline should display them in chronological order by date
// Validates: Requirements 4.1

describe('Release Timeline - Property-Based Tests', () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="timeline-container"></div>
      <div id="detail-view"></div>
    `;
  });

  test.prop([
    fc.array(
      fc.record({
        version: fc.string({ minLength: 1, maxLength: 20 }),
        date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        summary: fc.string({ minLength: 10, maxLength: 100 }),
        patchNote: fc.record({
          version: fc.string({ minLength: 1 }),
          date: fc.date(),
          sections: fc.array(fc.record({
            title: fc.string({ minLength: 1 }),
            type: fc.constantFrom('features' as const, 'fixes' as const, 'breaking' as const, 'other' as const),
            entries: fc.array(fc.record({
              themed: fc.string({ minLength: 1 }),
              original: fc.string({ minLength: 1 }),
              commitHash: fc.hexaString({ minLength: 40, maxLength: 40 })
            }), { minLength: 0, maxLength: 3 })
          }), { minLength: 0, maxLength: 3 }),
          originalCommits: fc.constant([])
        })
      }),
      { minLength: 2, maxLength: 10 }
    )
  ], { numRuns: 100 })(
    'Property 10: displays releases in chronological order (newest first)',
    async (entries: TimelineEntry[]) => {
      // Create timeline
      const timeline = createReleaseTimeline();
      (timeline as any).setEntries(entries);

      // Load releases
      await timeline.loadReleases();

      // Get rendered timeline entries
      const container = document.getElementById('timeline-container');
      const renderedEntries = container?.querySelectorAll('.timeline-entry');

      if (!renderedEntries || renderedEntries.length === 0) return;

      // Extract dates from rendered entries
      const renderedDates: Date[] = [];
      renderedEntries.forEach(el => {
        const version = (el as HTMLElement).dataset.version;
        const entry = entries.find(e => e.version === version);
        if (entry) {
          renderedDates.push(new Date(entry.date));
        }
      });

      // Verify chronological order (newest first)
      for (let i = 0; i < renderedDates.length - 1; i++) {
        expect(renderedDates[i].getTime()).toBeGreaterThanOrEqual(renderedDates[i + 1].getTime());
      }
    }
  );
});

// Feature: phantom-patch-notes, Property 12: Release selection updates display
// For any release, selecting it should update the display to show the full patch notes for that specific release
// Validates: Requirements 4.3

describe('Release Selection - Property-Based Tests', () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="timeline-container"></div>
      <div id="detail-view"></div>
    `;
  });

  test.prop([
    fc.array(
      fc.record({
        version: fc.string({ minLength: 1, maxLength: 20 }),
        date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        summary: fc.string({ minLength: 10, maxLength: 100 }),
        patchNote: fc.record({
          version: fc.string({ minLength: 1 }),
          date: fc.date(),
          sections: fc.array(fc.record({
            title: fc.string({ minLength: 1 }),
            type: fc.constantFrom('features' as const, 'fixes' as const, 'breaking' as const, 'other' as const),
            entries: fc.array(fc.record({
              themed: fc.string({ minLength: 1 }),
              original: fc.string({ minLength: 1 }),
              commitHash: fc.hexaString({ minLength: 40, maxLength: 40 })
            }), { minLength: 1, maxLength: 3 })
          }), { minLength: 1, maxLength: 3 }),
          originalCommits: fc.constant([])
        })
      }),
      { minLength: 1, maxLength: 10 }
    )
  ], { numRuns: 100 })(
    'Property 12: selecting a release updates the detail view with that release\'s patch notes',
    async (entries: TimelineEntry[]) => {
      // Create timeline
      const timeline = createReleaseTimeline();
      (timeline as any).setEntries(entries);

      // Load releases
      await timeline.loadReleases();

      // Select a random entry
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      timeline.selectRelease(randomEntry.version);

      // Get detail view
      const detailView = document.getElementById('detail-view');
      expect(detailView).toBeTruthy();
      expect(detailView?.classList.contains('visible')).toBe(true);

      // Verify the detail view contains the selected version
      const detailVersion = detailView?.querySelector('.detail-version');
      expect(detailVersion?.textContent).toBe(randomEntry.version);

      // Verify sections are rendered
      const sections = detailView?.querySelectorAll('.detail-section');
      expect(sections?.length).toBe(randomEntry.patchNote.sections.length);

      // Verify entries are rendered for each section
      randomEntry.patchNote.sections.forEach((section, sectionIndex) => {
        const sectionElement = sections?.[sectionIndex];
        const sectionTitle = sectionElement?.querySelector('.section-title');
        expect(sectionTitle?.textContent).toBe(section.title);

        const sectionEntries = sectionElement?.querySelectorAll('.section-entry');
        expect(sectionEntries?.length).toBe(section.entries.length);
      });

      // Verify the timeline entry is marked as selected
      const timelineEntry = document.querySelector(`.timeline-entry[data-version="${randomEntry.version}"]`);
      expect(timelineEntry?.classList.contains('selected')).toBe(true);
    }
  );
});

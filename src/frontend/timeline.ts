/**
 * Release Timeline component
 * Displays chronological release history with horror-themed UI
 */

import type { TimelineEntry, TimelineState, PatchNote } from '../shared/types.js';

export interface ReleaseTimeline {
  loadReleases(): Promise<void>;
  selectRelease(version: string): void;
  exportCurrent(format: 'markdown' | 'html' | 'json'): void;
}

/**
 * Creates and manages the Release Timeline component
 */
export function createReleaseTimeline(): ReleaseTimeline {
  const state: TimelineState = {
    entries: [],
    selectedEntry: null,
    loading: false,
    error: null
  };

  const timelineContainer = document.getElementById('timeline-container');
  const detailView = document.getElementById('detail-view');

  /**
   * Load releases and display them in the timeline
   */
  async function loadReleases(): Promise<void> {
    if (!timelineContainer || !detailView) {
      throw new Error('Timeline container or detail view not found');
    }

    // Clear previous content
    timelineContainer.innerHTML = '';
    detailView.innerHTML = '';
    detailView.classList.remove('visible');

    // Sort entries chronologically (newest first)
    const sortedEntries = [...state.entries].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Render each timeline entry
    sortedEntries.forEach(entry => {
      const entryElement = createTimelineEntryElement(entry);
      timelineContainer.appendChild(entryElement);
    });

    // Show timeline container
    timelineContainer.classList.add('visible');
  }

  /**
   * Create a timeline entry DOM element
   */
  function createTimelineEntryElement(entry: TimelineEntry): HTMLElement {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'timeline-entry';
    entryDiv.dataset.version = entry.version;

    const header = document.createElement('div');
    header.className = 'timeline-entry-header';

    const version = document.createElement('div');
    version.className = 'timeline-version';
    version.textContent = entry.version;

    const date = document.createElement('div');
    date.className = 'timeline-date';
    date.textContent = formatDate(entry.date);

    header.appendChild(version);
    header.appendChild(date);

    const summary = document.createElement('div');
    summary.className = 'timeline-summary';
    summary.textContent = entry.summary;

    entryDiv.appendChild(header);
    entryDiv.appendChild(summary);

    // Add click handler
    entryDiv.addEventListener('click', () => {
      selectRelease(entry.version);
    });

    return entryDiv;
  }

  /**
   * Select a release and display its full patch notes
   */
  function selectRelease(version: string): void {
    const entry = state.entries.find(e => e.version === version);
    if (!entry || !detailView) return;

    // Update selected state
    state.selectedEntry = entry;

    // Update UI selection
    const allEntries = document.querySelectorAll('.timeline-entry');
    allEntries.forEach(el => {
      if ((el as HTMLElement).dataset.version === version) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });

    // Render detail view
    renderDetailView(entry);
  }

  /**
   * Render the detail view for a selected release
   */
  function renderDetailView(entry: TimelineEntry): void {
    if (!detailView) return;

    detailView.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.className = 'detail-header';

    const version = document.createElement('div');
    version.className = 'detail-version';
    version.textContent = entry.version;

    const date = document.createElement('div');
    date.className = 'detail-date';
    date.textContent = formatDate(entry.date);

    header.appendChild(version);
    header.appendChild(date);
    detailView.appendChild(header);

    // Sections
    entry.patchNote.sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'detail-section';

      const title = document.createElement('h3');
      title.className = 'section-title';
      title.textContent = section.title;
      sectionDiv.appendChild(title);

      section.entries.forEach(sectionEntry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'section-entry';

        const themed = document.createElement('div');
        themed.className = 'entry-themed';
        themed.textContent = sectionEntry.themed;

        const original = document.createElement('div');
        original.className = 'entry-original';
        original.textContent = `Original: ${sectionEntry.original}`;

        const hash = document.createElement('div');
        hash.className = 'entry-hash';
        hash.textContent = `Commit: ${sectionEntry.commitHash.substring(0, 8)}`;

        entryDiv.appendChild(themed);
        entryDiv.appendChild(original);
        entryDiv.appendChild(hash);
        sectionDiv.appendChild(entryDiv);
      });

      detailView.appendChild(sectionDiv);
    });

    // Show detail view
    detailView.classList.add('visible');
    detailView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Export the currently selected release
   */
  async function exportCurrent(format: 'markdown' | 'html' | 'json'): Promise<void> {
    if (!state.selectedEntry) {
      throw new Error('No release selected for export');
    }

    // This will call the backend API to export
    // The actual API call will be implemented in the API integration task
    return Promise.resolve();
  }

  /**
   * Format a date for display
   */
  function formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Set the timeline entries
   */
  function setEntries(entries: TimelineEntry[]): void {
    state.entries = entries;
  }

  /**
   * Get the current state
   */
  function getState(): TimelineState {
    return { ...state };
  }

  // Return public interface with internal methods
  const publicInterface: ReleaseTimeline & {
    setEntries?: (entries: TimelineEntry[]) => void;
    getState?: () => TimelineState;
  } = {
    loadReleases,
    selectRelease,
    exportCurrent,
    setEntries,
    getState
  };

  return publicInterface;
}

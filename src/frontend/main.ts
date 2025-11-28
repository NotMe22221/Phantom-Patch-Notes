/**
 * Frontend application entry point
 * Handles UI initialization and user interactions
 * Integrates with demo mode for Kiroween hackathon presentation
 */

import { createReleaseTimeline } from './timeline.js';
import { 
  parseRepository, 
  generatePatchNotes, 
  exportPatchNotes, 
  getPreviewData,
  downloadFile 
} from './api-client.js';
import { handleError, hideError } from './error-handler.js';
import type { CommitData, PatchNote, TimelineEntry } from '../shared/types.js';

// Demo mode integration
import { createDemoApp, type MainAppHandlers } from '../demo/demo-app.js';
import type { DemoApp } from '../demo/demo-app.js';

// Initialize timeline
const timeline = createReleaseTimeline();

// Demo app instance
let demoApp: DemoApp | null = null;

// Store current data for demo updates
let currentCommits: CommitData[] | null = null;
let currentPatchNote: PatchNote | null = null;

// Get DOM elements
const repoPathInput = document.getElementById('repo-path') as HTMLInputElement;
const previewModeCheckbox = document.getElementById('preview-mode') as HTMLInputElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const exportFormatSelect = document.getElementById('export-format') as HTMLSelectElement;
const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
const loadingIndicator = document.getElementById('loading-indicator') as HTMLElement;

/**
 * Show loading state
 */
function showLoading(): void {
  loadingIndicator?.classList.add('visible');
  generateBtn.disabled = true;
}

/**
 * Hide loading state
 */
function hideLoading(): void {
  loadingIndicator?.classList.remove('visible');
  generateBtn.disabled = false;
}

/**
 * Generate patch notes from repository or preview mode
 */
async function handleGenerate(): Promise<void> {
  try {
    hideError();
    showLoading();

    let commits: CommitData[];
    
    // Check if demo mode has provided haunted repo commits
    if (currentCommits && currentCommits.length > 0) {
      commits = currentCommits;
      console.log('Using haunted repository commits from demo mode');
    }
    // Check if preview mode is enabled
    else if (previewModeCheckbox.checked) {
      const previewData = await getPreviewData();
      commits = previewData.commits;
    } else {
      const repoPath = repoPathInput.value.trim();
      if (!repoPath) {
        throw new Error('Please enter a repository path');
      }
      commits = await parseRepository(repoPath);
    }

    // Generate patch notes
    const patchNote = await generatePatchNotes(commits, {
      version: 'v1.0.0' // TODO: Allow user to specify version
    });

    // Store for demo updates
    currentCommits = commits;
    currentPatchNote = patchNote;

    // Create timeline entry
    const entry: TimelineEntry = {
      version: patchNote.version,
      date: patchNote.date,
      summary: generateSummary(patchNote),
      patchNote
    };

    // Update timeline
    (timeline as any).setEntries([entry]);
    await timeline.loadReleases();

    // Auto-select the first (and only) entry
    timeline.selectRelease(entry.version);

    // Update demo app if active
    if (demoApp && currentCommits && currentPatchNote) {
      demoApp.updateWithPatchNotes(currentCommits, currentPatchNote);
    }

    hideLoading();
  } catch (error) {
    hideLoading();
    handleError(error);
  }
}

/**
 * Generate a summary for a patch note
 */
function generateSummary(patchNote: PatchNote): string {
  const totalChanges = patchNote.sections.reduce(
    (sum, section) => sum + section.entries.length,
    0
  );
  
  const sectionTypes = patchNote.sections.map(s => s.type);
  const hasFeatures = sectionTypes.includes('features');
  const hasFixes = sectionTypes.includes('fixes');
  const hasBreaking = sectionTypes.includes('breaking');

  const parts: string[] = [];
  if (hasFeatures) parts.push('new features');
  if (hasFixes) parts.push('bug fixes');
  if (hasBreaking) parts.push('breaking changes');

  return `${totalChanges} changes including ${parts.join(', ')}`;
}

/**
 * Handle export
 */
async function handleExport(): Promise<void> {
  try {
    hideError();
    
    const state = (timeline as any).getState();
    if (!state.selectedEntry) {
      throw new Error('Please select a release to export');
    }

    const format = exportFormatSelect.value as 'markdown' | 'html' | 'json';
    const result = await exportPatchNotes(state.selectedEntry.patchNote, format, {
      includeStyles: format === 'html',
      pretty: format === 'json'
    });

    // Download the file
    downloadFile(result.content, result.filename, result.mimeType);
  } catch (error) {
    handleError(error);
  }
}

/**
 * Initialize event listeners
 */
function initializeEventListeners(): void {
  generateBtn?.addEventListener('click', handleGenerate);
  exportBtn?.addEventListener('click', handleExport);

  // Enable/disable repo path input based on preview mode
  previewModeCheckbox?.addEventListener('change', () => {
    if (repoPathInput) {
      repoPathInput.disabled = previewModeCheckbox.checked;
      if (previewModeCheckbox.checked) {
        repoPathInput.value = '';
        repoPathInput.placeholder = 'Preview mode enabled';
      } else {
        repoPathInput.placeholder = '/path/to/your/repository';
      }
    }
  });

  // Allow Enter key to trigger generate
  repoPathInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  });
}

/**
 * Initialize demo mode
 * Checks URL parameters or environment to determine if demo should be enabled
 */
async function initializeDemoMode(): Promise<void> {
  // Check if demo mode should be enabled
  const urlParams = new URLSearchParams(window.location.search);
  const enableDemo = urlParams.get('demo') === 'true' || 
                     urlParams.get('kiroween') === 'true' ||
                     window.location.pathname.includes('/demo');

  if (enableDemo) {
    try {
      console.log('🎃 Initializing Kiroween Demo Mode...');

      // Create demo app handlers
      const handlers: MainAppHandlers = {
        onHauntedRepoLoaded: (commits: CommitData[]) => {
          currentCommits = commits;
          console.log(`✓ Haunted repo loaded: ${commits.length} commits`);
        },
        onGenerate: () => {
          handleGenerate();
        },
        onSelectFirstRelease: () => {
          // Select first release in timeline
          const entries = (timeline as any).getState?.()?.entries || [];
          if (entries.length > 0) {
            timeline.selectRelease(entries[0].version);
          }
        },
        onScrollSections: () => {
          // Scroll through detail view sections
          const detailView = document.getElementById('detail-view');
          if (detailView) {
            detailView.scrollBy({ top: 200, behavior: 'smooth' });
          }
        },
        onExport: () => {
          handleExport();
        },
        onReset: () => {
          // Reset the application
          currentCommits = null;
          currentPatchNote = null;
          (timeline as any).setEntries?.([]);
        }
      };

      // Create and initialize demo app
      demoApp = await createDemoApp(handlers);
      
      console.log('✓ Demo mode initialized successfully');
    } catch (error) {
      console.error('Failed to initialize demo mode:', error);
      // Continue in normal mode
      demoApp = null;
    }
  } else {
    console.log('Running in normal mode (add ?demo=true to URL for demo mode)');
  }
}

// Initialize the application
initializeEventListeners();

// Initialize demo mode if enabled
initializeDemoMode().catch(error => {
  console.error('Demo initialization error:', error);
  // Continue in normal mode
});

export {};

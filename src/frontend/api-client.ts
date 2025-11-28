/**
 * API client for communicating with the backend
 */

import type { 
  CommitData, 
  PatchNote, 
  ExportResult,
  ParseRequest,
  GenerateRequest,
  ExportRequest,
  PreviewResponse
} from '../shared/types.js';

const API_BASE_URL = '/api';

/**
 * Parse commits from a repository
 */
export async function parseRepository(repoPath: string, options?: {
  dateRange?: { from: string; to: string };
  tags?: string[];
  maxCount?: number;
}): Promise<CommitData[]> {
  const request: ParseRequest = {
    repoPath,
    ...options
  };

  const response = await fetch(`${API_BASE_URL}/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

/**
 * Generate patch notes from commits
 */
export async function generatePatchNotes(
  commits: CommitData[],
  options?: {
    version?: string;
    themeName?: string;
  }
): Promise<PatchNote> {
  const request: GenerateRequest = {
    commits,
    ...options
  };

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

/**
 * Export patch notes in a specific format
 */
export async function exportPatchNotes(
  patchNote: PatchNote,
  format: 'markdown' | 'html' | 'json',
  options?: {
    includeStyles?: boolean;
    pretty?: boolean;
  }
): Promise<ExportResult> {
  const request: ExportRequest = {
    patchNote,
    format,
    ...options
  };

  const response = await fetch(`${API_BASE_URL}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

/**
 * Get preview mode data
 */
export async function getPreviewData(): Promise<PreviewResponse> {
  const response = await fetch(`${API_BASE_URL}/preview`, {
    method: 'GET'
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

/**
 * Get list of available themes
 */
export async function getThemes(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/themes`, {
    method: 'GET'
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const data = await response.json();
  return data.themes;
}

/**
 * Download a file from export result
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

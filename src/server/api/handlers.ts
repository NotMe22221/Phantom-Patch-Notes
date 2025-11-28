/**
 * API Request Handlers
 * Implements the logic for each API endpoint
 */

import type { Request, Response } from 'express';
import type { 
  ParseRequest, 
  GenerateRequest, 
  ExportRequest,
  ThemesResponse,
  PreviewResponse,
  SystemError
} from '../../shared/types.js';
import { CommitParser } from '../core/commit-parser.js';
import { PatchNoteGenerator } from '../core/generator.js';
import { ExportSystem } from '../core/export.js';
import { ThemeEngine } from '../core/theme-engine.js';
import { generateSampleCommits } from '../../preview/sample-commits.js';
import { ErrorHandler } from '../core/error-handler.js';

// Initialize core modules
const commitParser = new CommitParser();
const themeEngine = new ThemeEngine();
const generator = new PatchNoteGenerator(themeEngine);
const exportSystem = new ExportSystem();

/**
 * Create structured error response
 */
function createErrorResponse(error: any, component: string): SystemError {
  // If it's already a SystemError, return it
  if (ErrorHandler.isSystemError(error)) {
    return error;
  }

  // Otherwise, use ErrorHandler to create a structured error
  return ErrorHandler.handle(error, component);
}

/**
 * POST /api/parse
 * Parse repository and return commits
 */
export async function parseRepository(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ParseRequest;

    // Validate required fields
    if (!body.repoPath) {
      const error = ErrorHandler.createError(
        'VALIDATION_ERROR',
        'repoPath is required',
        'API',
        { endpoint: '/api/parse' }
      );
      res.status(400).json(error);
      return;
    }

    // Parse date range if provided
    const dateRange = body.dateRange ? {
      from: new Date(body.dateRange.from),
      to: new Date(body.dateRange.to)
    } : undefined;

    // Parse repository
    const commits = await commitParser.parseRepository({
      repoPath: body.repoPath,
      dateRange,
      tags: body.tags,
      maxCount: body.maxCount
    });

    res.json(commits);
  } catch (error) {
    const errorResponse = createErrorResponse(error, 'CommitParser');
    res.status(500).json(errorResponse);
  }
}

/**
 * POST /api/generate
 * Generate patch notes from commits
 */
export async function generatePatchNotes(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as GenerateRequest;

    // Validate required fields
    if (!body.commits || !Array.isArray(body.commits)) {
      const error = ErrorHandler.createError(
        'VALIDATION_ERROR',
        'commits array is required',
        'API',
        { endpoint: '/api/generate' }
      );
      res.status(400).json(error);
      return;
    }

    // Generate patch notes
    const patchNote = await generator.generate({
      commits: body.commits,
      version: body.version,
      themeName: body.themeName
    });

    res.json(patchNote);
  } catch (error) {
    const errorResponse = createErrorResponse(error, 'PatchNoteGenerator');
    res.status(500).json(errorResponse);
  }
}

/**
 * POST /api/export
 * Export patch notes in specified format
 */
export async function exportPatchNotes(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as ExportRequest;

    // Validate required fields
    if (!body.patchNote) {
      const error = ErrorHandler.createError(
        'VALIDATION_ERROR',
        'patchNote is required',
        'API',
        { endpoint: '/api/export' }
      );
      res.status(400).json(error);
      return;
    }

    if (!body.format) {
      const error = ErrorHandler.createError(
        'VALIDATION_ERROR',
        'format is required',
        'API',
        { endpoint: '/api/export' }
      );
      res.status(400).json(error);
      return;
    }

    // Export patch notes
    const result = exportSystem.export(body.patchNote, {
      format: body.format,
      includeStyles: body.includeStyles,
      pretty: body.pretty
    });

    res.json(result);
  } catch (error) {
    const errorResponse = createErrorResponse(error, 'ExportSystem');
    res.status(500).json(errorResponse);
  }
}

/**
 * GET /api/themes
 * List available themes
 */
export async function listThemes(req: Request, res: Response): Promise<void> {
  try {
    const themes = themeEngine.listAvailableThemes();
    
    const response: ThemesResponse = {
      themes
    };

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(error, 'ThemeEngine');
    res.status(500).json(errorResponse);
  }
}

/**
 * GET /api/preview
 * Get preview mode data (synthetic commits)
 */
export async function getPreviewData(req: Request, res: Response): Promise<void> {
  try {
    const commits = generateSampleCommits();
    
    const response: PreviewResponse = {
      commits,
      synthetic: true
    };

    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(error, 'PreviewMode');
    res.status(500).json(errorResponse);
  }
}

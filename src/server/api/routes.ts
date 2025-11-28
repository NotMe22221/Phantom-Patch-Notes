/**
 * API Routes
 * Defines all API endpoints for the Phantom Patch Notes backend
 */

import { Router } from 'express';
import * as handlers from './handlers.js';

export function createRouter(): Router {
  const router = Router();

  // Parse repository and return commits
  router.post('/parse', handlers.parseRepository);

  // Generate patch notes from commits
  router.post('/generate', handlers.generatePatchNotes);

  // Export patch notes in specified format
  router.post('/export', handlers.exportPatchNotes);

  // List available themes
  router.get('/themes', handlers.listThemes);

  // Get preview mode data
  router.get('/preview', handlers.getPreviewData);

  return router;
}

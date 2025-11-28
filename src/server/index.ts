/**
 * Backend API server entry point
 * Express server for handling patch note generation requests
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { createRouter } from './api/routes.js';
import type { SystemError } from '../shared/types.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// Middleware Configuration
// ============================================================================

// JSON body parsing
app.use(express.json({ limit: '10mb' }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// Routes
// ============================================================================

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', createRouter());

// ============================================================================
// Error Handling Middleware
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  const error: SystemError = {
    code: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`,
    component: 'API',
    timestamp: new Date()
  };
  res.status(404).json(error);
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  const error: SystemError = {
    code: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    component: 'API',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date()
  };
  
  res.status(500).json(error);
});

// ============================================================================
// Server Startup
// ============================================================================

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🎃 Phantom Patch Notes API server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔮 API endpoints: http://localhost:${PORT}/api`);
  });
}

// Export app for testing
export { app };

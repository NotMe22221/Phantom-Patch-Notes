/**
 * Demo Configuration
 * 
 * Central configuration for the Kiroween hackathon demo.
 * Includes haunted repository data, audio assets, timing settings,
 * and presentation configuration.
 */

import type { 
  DemoConfig, 
  HauntedRepoConfig, 
  AudioAsset, 
  PresentationConfig, 
  AutoPlayConfig, 
  IntroConfig,
  DemoStep 
} from '../types/demo-types';

/**
 * Haunted Repository Configuration
 * Pre-configured repository with curated commits for demo
 * 
 * This configuration includes 27 commits across 4 releases:
 * - Release 1.0.0 "The Awakening" - Initial haunting (5 commits)
 * - Release 1.1.0 "The Whispers" - Communication features (7 commits)
 * - Release 2.0.0 "The Darkness" - Major theme overhaul (10 commits)
 * - Release 2.1.0 "The Shadows" - Performance & polish (5 commits)
 */
export const hauntedRepoConfig: HauntedRepoConfig = {
  repoPath: 'demo/haunted-repo',
  commits: [
    // ========================================================================
    // Release 1.0.0 - "The Awakening" - Initial haunting (5 commits)
    // ========================================================================
    {
      hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      message: 'Add user authentication system',
      author: 'Dev Ghost',
      email: 'ghost@phantom.dev',
      timestamp: new Date('2024-10-01T10:00:00Z'),
      changedFiles: ['src/auth/login.ts', 'src/auth/session.ts', 'src/auth/middleware.ts']
    },
    {
      hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
      message: 'Fix memory leak in session handler',
      author: 'Dev Ghost',
      email: 'ghost@phantom.dev',
      timestamp: new Date('2024-10-02T14:30:00Z'),
      changedFiles: ['src/auth/session.ts']
    },
    {
      hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
      message: 'Add password reset functionality',
      author: 'Dev Ghost',
      email: 'ghost@phantom.dev',
      timestamp: new Date('2024-10-03T09:15:00Z'),
      changedFiles: ['src/auth/reset.ts', 'src/email/templates.ts', 'src/email/sender.ts']
    },
    {
      hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
      message: 'Improve login performance with caching',
      author: 'Dev Ghost',
      email: 'ghost@phantom.dev',
      timestamp: new Date('2024-10-04T16:45:00Z'),
      changedFiles: ['src/auth/login.ts', 'src/cache/redis.ts', 'src/cache/strategy.ts']
    },
    {
      hash: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
      message: 'Remove deprecated OAuth v1 support',
      author: 'Dev Ghost',
      email: 'ghost@phantom.dev',
      timestamp: new Date('2024-10-05T11:20:00Z'),
      changedFiles: ['src/auth/oauth.ts', 'src/auth/providers.ts']
    },

    // ========================================================================
    // Release 1.1.0 - "The Whispers" - Communication features (7 commits)
    // ========================================================================
    {
      hash: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5',
      message: 'Add real-time notification system',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-10T08:00:00Z'),
      changedFiles: ['src/notifications/realtime.ts', 'src/websocket/server.ts', 'src/websocket/client.ts']
    },
    {
      hash: 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      message: 'Fix race condition in message queue',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-11T13:30:00Z'),
      changedFiles: ['src/queue/processor.ts', 'src/queue/locks.ts']
    },
    {
      hash: 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7',
      message: 'Add WebSocket connection pooling',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-12T10:15:00Z'),
      changedFiles: ['src/websocket/pool.ts', 'src/websocket/manager.ts']
    },
    {
      hash: 'i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8',
      message: 'Improve notification delivery speed',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-13T15:45:00Z'),
      changedFiles: ['src/notifications/delivery.ts', 'src/notifications/batch.ts']
    },
    {
      hash: 'j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9',
      message: 'Breaking: Change notification API structure',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-14T09:00:00Z'),
      changedFiles: ['src/api/notifications.ts', 'src/types/notification.ts', 'docs/api-migration.md']
    },
    {
      hash: 'k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0',
      message: 'Add notification preferences and filters',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-15T14:20:00Z'),
      changedFiles: ['src/user/preferences.ts', 'src/notifications/filter.ts', 'src/notifications/rules.ts']
    },
    {
      hash: 'l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1',
      message: 'Deprecate legacy notification channels',
      author: 'Dev Specter',
      email: 'specter@phantom.dev',
      timestamp: new Date('2024-10-16T11:00:00Z'),
      changedFiles: ['src/notifications/channels.ts', 'docs/deprecations.md']
    },

    // ========================================================================
    // Release 2.0.0 - "The Darkness" - Major theme overhaul (10 commits)
    // ========================================================================
    {
      hash: 'm3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
      message: 'Add dark mode theme engine',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-20T08:30:00Z'),
      changedFiles: ['src/themes/dark.ts', 'src/ui/theme-switcher.ts', 'src/themes/engine.ts']
    },
    {
      hash: 'n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
      message: 'Fix theme switching animation glitch',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-21T12:15:00Z'),
      changedFiles: ['src/ui/animations.ts', 'src/ui/transitions.ts']
    },
    {
      hash: 'o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
      message: 'Add custom theme creator with live preview',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-22T09:45:00Z'),
      changedFiles: ['src/themes/creator.ts', 'src/ui/theme-editor.ts', 'src/ui/preview.ts']
    },
    {
      hash: 'p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5',
      message: 'Improve theme rendering performance',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-23T14:00:00Z'),
      changedFiles: ['src/themes/renderer.ts', 'src/cache/theme-cache.ts', 'src/themes/optimizer.ts']
    },
    {
      hash: 'q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6',
      message: 'Remove legacy theme engine',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-24T10:30:00Z'),
      changedFiles: ['src/themes/legacy.ts', 'src/migrations/theme-v1-cleanup.ts']
    },
    {
      hash: 'r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7',
      message: 'Add theme preview mode with comparison',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-25T15:20:00Z'),
      changedFiles: ['src/themes/preview.ts', 'src/ui/preview-panel.ts', 'src/ui/comparison.ts']
    },
    {
      hash: 's9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8',
      message: 'Fix color contrast accessibility issues',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-26T11:45:00Z'),
      changedFiles: ['src/themes/colors.ts', 'src/accessibility/contrast.ts', 'src/accessibility/wcag.ts']
    },
    {
      hash: 't0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9',
      message: 'Add theme export and sharing functionality',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-27T13:00:00Z'),
      changedFiles: ['src/themes/export.ts', 'src/themes/import.ts', 'src/api/theme-sharing.ts']
    },
    {
      hash: 'u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0',
      message: 'Breaking: Migrate to new theme format v2',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-28T09:30:00Z'),
      changedFiles: ['src/themes/format.ts', 'src/migrations/theme-v2.ts', 'docs/theme-migration.md']
    },
    {
      hash: 'v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1',
      message: 'Add theme marketplace integration',
      author: 'Dev Phantom',
      email: 'phantom@phantom.dev',
      timestamp: new Date('2024-10-29T16:00:00Z'),
      changedFiles: ['src/marketplace/themes.ts', 'src/api/marketplace.ts', 'src/ui/marketplace-browser.ts']
    },

    // ========================================================================
    // Release 2.1.0 - "The Shadows" - Performance & polish (5 commits)
    // ========================================================================
    {
      hash: 'w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2',
      message: 'Add database query optimization',
      author: 'Dev Wraith',
      email: 'wraith@phantom.dev',
      timestamp: new Date('2024-11-01T08:00:00Z'),
      changedFiles: ['src/database/queries.ts', 'src/database/indexes.ts', 'src/database/optimizer.ts']
    },
    {
      hash: 'x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3',
      message: 'Fix infinite loop in theme parser',
      author: 'Dev Wraith',
      email: 'wraith@phantom.dev',
      timestamp: new Date('2024-11-02T12:30:00Z'),
      changedFiles: ['src/themes/parser.ts', 'src/themes/validator.ts']
    },
    {
      hash: 'y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4',
      message: 'Add image optimization pipeline',
      author: 'Dev Wraith',
      email: 'wraith@phantom.dev',
      timestamp: new Date('2024-11-03T10:15:00Z'),
      changedFiles: ['src/media/optimizer.ts', 'src/media/pipeline.ts', 'src/media/formats.ts']
    },
    {
      hash: 'z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5',
      message: 'Improve bundle size with tree shaking',
      author: 'Dev Wraith',
      email: 'wraith@phantom.dev',
      timestamp: new Date('2024-11-04T14:45:00Z'),
      changedFiles: ['webpack.config.js', 'src/utils/exports.ts', 'package.json']
    },
    {
      hash: 'a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6',
      message: 'Deprecate synchronous API methods',
      author: 'Dev Wraith',
      email: 'wraith@phantom.dev',
      timestamp: new Date('2024-11-05T11:00:00Z'),
      changedFiles: ['src/api/sync-methods.ts', 'docs/api-deprecations.md', 'src/api/async-replacements.ts']
    }
  ],
  releases: [
    {
      version: '1.0.0',
      date: new Date('2024-10-05T11:20:00Z'),
      commitHashes: [
        'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
        'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
        'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
        'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4'
      ]
    },
    {
      version: '1.1.0',
      date: new Date('2024-10-16T11:00:00Z'),
      commitHashes: [
        'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5',
        'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7',
        'i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8',
        'j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9',
        'k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0',
        'l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1'
      ]
    },
    {
      version: '2.0.0',
      date: new Date('2024-10-29T16:00:00Z'),
      commitHashes: [
        'm3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
        'n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
        'o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
        'p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5',
        'q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6',
        'r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7',
        's9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8',
        't0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9',
        'u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0',
        'v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1'
      ]
    },
    {
      version: '2.1.0',
      date: new Date('2024-11-05T11:00:00Z'),
      commitHashes: [
        'w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2',
        'x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3',
        'y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4',
        'z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5',
        'a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6'
      ]
    }
  ]
};

/**
 * Audio Assets Configuration
 * Paths and settings for demo sound effects
 */
export const audioAssets: AudioAsset[] = [
  {
    id: 'ambient-background',
    url: '/demo/audio/ambient.mp3',
    volume: 0.3,
    loop: true
  },
  {
    id: 'generate-effect',
    url: '/demo/audio/generate.mp3',
    volume: 0.6,
    loop: false
  },
  {
    id: 'select-effect',
    url: '/demo/audio/select.mp3',
    volume: 0.4,
    loop: false
  },
  {
    id: 'hover-effect',
    url: '/demo/audio/hover.mp3',
    volume: 0.2,
    loop: false
  },
  {
    id: 'export-effect',
    url: '/demo/audio/export.mp3',
    volume: 0.7,
    loop: false
  }
];

/**
 * Presentation Mode Configuration
 * Settings for full-screen presentation display
 */
export const presentationConfig: PresentationConfig = {
  fontScale: 1.5,
  hiddenElements: [
    '.repo-input',
    '.config-panel',
    '.footer-links',
    '.debug-info'
  ],
  showcaseVisible: true
};

/**
 * Auto-Play Configuration
 * Timing and behavior for automated demo sequence
 */
export const autoPlayConfig: AutoPlayConfig = {
  stepDelays: {
    'generate': 2000,        // 2 seconds before generating
    'select-release': 3000,  // 3 seconds before selecting release
    'scroll-sections': 4000, // 4 seconds per section scroll
    'export': 3000,          // 3 seconds before export
    'complete': 5000         // 5 seconds on completion screen
  },
  loopOnComplete: false
};

/**
 * Intro Screen Configuration
 * Branding and animation settings for demo introduction
 */
export const introConfig: IntroConfig = {
  logoUrl: '/demo/images/phantom-logo.svg',
  tagline: 'Transform Git History into Horror Stories',
  animationDuration: 2000
};

/**
 * Complete Demo Configuration
 * Aggregates all demo settings into single config object
 */
export const demoConfig: DemoConfig = {
  hauntedRepo: hauntedRepoConfig,
  sounds: audioAssets,
  presentation: presentationConfig,
  autoPlay: autoPlayConfig,
  intro: introConfig
};

/**
 * Demo Mode Flag
 * Global flag to enable/disable demo features
 */
export let isDemoMode = false;

/**
 * Enable Demo Mode
 * Activates all demo features and configurations
 */
export function enableDemoMode(): void {
  isDemoMode = true;
  console.log('🎃 Demo mode enabled - Kiroween hackathon demo active');
}

/**
 * Disable Demo Mode
 * Deactivates demo features and returns to normal app mode
 */
export function disableDemoMode(): void {
  isDemoMode = false;
  console.log('Demo mode disabled - Normal app mode active');
}

/**
 * Check if Demo Mode is Active
 */
export function isInDemoMode(): boolean {
  return isDemoMode;
}

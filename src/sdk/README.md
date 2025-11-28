# Phantom Patch Notes SDK

Plugin API for integrating Phantom Patch Notes into CI/CD pipelines and automation tools.

## Installation

```bash
npm install phantom-patch-notes
```

## Quick Start

```typescript
import { pluginAPI } from 'phantom-patch-notes';

const result = await pluginAPI.generate({
  repoPath: './my-repo',
  outputPath: './CHANGELOG.md',
  format: 'markdown'
});

if (result.success) {
  console.log('Generated:', result.outputPath);
} else {
  console.error('Error:', result.error?.message);
}
```

## Configuration

### Required Fields

- `repoPath` (string): Path to the git repository
- `outputPath` (string): Where to write the output file
- `format` ('markdown' | 'html' | 'json'): Output format

### Optional Fields

- `version` (string): Version string for the patch notes (e.g., 'v1.0.0')
- `theme` (string): Theme name to use (default: 'haunted')
- `env` (object): Environment variables to use instead of process.env

## Environment Variables

The SDK supports configuration via environment variables:

- `REPO_PATH`: Repository path
- `OUTPUT_PATH`: Output file path
- `OUTPUT_FORMAT`: Output format (markdown, html, json)
- `VERSION`: Version string
- `THEME`: Theme name

Environment variables take precedence over config values.

## Examples

### Basic Usage

```typescript
import { pluginAPI, PluginConfig } from 'phantom-patch-notes';

const config: PluginConfig = {
  repoPath: './my-project',
  outputPath: './docs/CHANGELOG.md',
  format: 'markdown',
  version: 'v2.1.0'
};

const result = await pluginAPI.generate(config);
```

### With Environment Variables

```typescript
import { pluginAPI } from 'phantom-patch-notes';

// Set environment variables
process.env.REPO_PATH = './my-project';
process.env.OUTPUT_PATH = './CHANGELOG.html';
process.env.OUTPUT_FORMAT = 'html';
process.env.VERSION = 'v1.5.0';
process.env.THEME = 'haunted';

// Minimal config - env vars will be used
const result = await pluginAPI.generate({
  repoPath: '', // Will be overridden by REPO_PATH
  outputPath: '', // Will be overridden by OUTPUT_PATH
  format: 'markdown' // Will be overridden by OUTPUT_FORMAT
});
```

### Custom Environment Object

```typescript
import { pluginAPI } from 'phantom-patch-notes';

const result = await pluginAPI.generate({
  repoPath: './fallback-repo',
  outputPath: './fallback-output.md',
  format: 'markdown',
  env: {
    REPO_PATH: './actual-repo',
    OUTPUT_PATH: './actual-output.md',
    OUTPUT_FORMAT: 'html'
  }
});
```

### Error Handling

```typescript
import { pluginAPI, isErrorResult } from 'phantom-patch-notes';

const result = await pluginAPI.generate(config);

if (isErrorResult(result)) {
  console.error(`Error [${result.error.code}]: ${result.error.message}`);
  console.error('Details:', result.error.details);
  process.exit(1);
}

console.log('Success! Output at:', result.outputPath);
```

### CI/CD Integration (GitHub Actions)

```yaml
name: Generate Patch Notes

on:
  push:
    tags:
      - 'v*'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install phantom-patch-notes
      
      - name: Generate patch notes
        run: |
          node -e "
          const { pluginAPI } = require('phantom-patch-notes');
          (async () => {
            const result = await pluginAPI.generate({
              repoPath: '.',
              outputPath: './CHANGELOG.md',
              format: 'markdown',
              version: process.env.GITHUB_REF_NAME
            });
            if (!result.success) {
              console.error(result.error.message);
              process.exit(1);
            }
          })();
          "
      
      - name: Commit changelog
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email 'github-actions[bot]@users.noreply.github.com'
          git add CHANGELOG.md
          git commit -m 'Update changelog for ${{ github.ref_name }}'
          git push
```

## API Reference

### `pluginAPI.generate(config: PluginConfig): Promise<PluginResult>`

Generates patch notes from a git repository.

**Parameters:**
- `config`: Configuration object (see Configuration section)

**Returns:**
- `PluginResult`: Object with `success` boolean and either `outputPath` or `error`

### `pluginAPI.validateConfig(config: PluginConfig): boolean`

Validates a configuration object.

**Parameters:**
- `config`: Configuration object to validate

**Returns:**
- `boolean`: True if configuration is valid, false otherwise

## TypeScript Support

The SDK is fully typed. Import types as needed:

```typescript
import type {
  PluginConfig,
  PluginResult,
  PluginSuccessResult,
  PluginErrorResult,
  CommitData,
  PatchNote,
  ExportFormat
} from 'phantom-patch-notes';
```

## Error Codes

- `INVALID_CONFIG`: Configuration validation failed
- `INVALID_REPOSITORY`: Repository path is invalid or not a git repo
- `NO_COMMITS`: No commits found in repository
- `GIT_OPERATION_FAILED`: Git operation failed
- `GENERATION_FAILED`: Generic generation failure

## License

MIT

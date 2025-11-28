# Project Structure

## Current Organization

This is a new workspace with minimal structure:

```
.
├── .kiro/          # Kiro configuration and steering rules
│   └── steering/   # AI assistant guidance documents
└── .vscode/        # VSCode settings
```

## Recommended Structure

As the project grows, consider organizing code with clear separation of concerns:

- Source code in a dedicated directory (e.g., `src/`, `lib/`, or `app/`)
- Tests alongside or in a separate `tests/` or `__tests__/` directory
- Configuration files at the root level
- Documentation in `docs/` or `README.md`
- Build output in `dist/`, `build/`, or similar (gitignored)

## Conventions

- Use clear, descriptive names for files and directories
- Group related functionality together
- Keep configuration files organized and documented
- Maintain a clean root directory

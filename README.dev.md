# Search in Current Folder

A simple VS Code extension for searching the selected text in the directory of the current file.

## Features

| Shortcut | Command | Description |
|--------|------|------|
| `Alt F` | Search in Current Folder | Search the selected text in the directory of the current file (including subdirectories) |
| `Ctrl Alt F` | Search in Workspace | Search the selected text across the entire workspace (removing path restrictions) |

## Usage

1. Select the text you want to search in the editor
2. Press `Alt F` → Automatically search within the directory of the current file
3. Press `Ctrl Alt F` → Search across the entire workspace (no path limit)

You can also trigger it via the right-click menu → "Search in Current Folder".

## Development

```bash
# Install dependencies
npm install

# Compile (TypeScript → JS)
npm run compile

# Watch mode (auto recompile)
npm run watch

# Debug: Press F5 to open the Extension Development Host window
```

## Packaging & Installation

```bash
# Package as .vsix
npm run package

# Install to local VS Code
npm run install-local
# Or manually: code --install-extension search-in-folder-*.vsix --force
```

## Enhancement Ideas

- [ ] Support triggering from folder explorer right-click (search specified directory)
- [ ] Case-sensitive / regex mode toggle (shortcut key)
- [ ] Search history
- [ ] Support merging multiple selected texts for OR search

## License

MIT

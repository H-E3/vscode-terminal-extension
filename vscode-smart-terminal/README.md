# Smart Terminal VSCode Extension

A modern terminal extension for VSCode with block-based architecture and AI capabilities.

## Features

### 🚀 Core Features

- **Block-based Architecture**: Each command-output pair is treated as an independent block with visual boundaries
- **Visual Decorations**: Clear visual separation between command blocks
- **Output Collapsing**: Collapse long command outputs to keep the terminal clean
- **Directory Sync**: Automatically sync terminal directory with VSCode explorer navigation
- **Command History Management**: SQLite-based history storage with search capabilities
- **Shell Integration**: Support for bash, zsh, and PowerShell

### 🔧 Technical Features

- **Webview-based Terminal**: Uses xterm.js for enhanced terminal experience
- **GPU Acceleration**: WebGL rendering for better performance
- **Modern UI**: Clean, VSCode-style terminal interface
- **Extensible Architecture**: Modular design for easy feature addition

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Search for "Smart Terminal"
4. Click Install

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vscode-smart-terminal.git
   cd vscode-smart-terminal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run compile
   npm run build:webview
   ```

4. Install the extension locally:
   - Press `F5` to launch Extension Development Host
   - The extension will be loaded in the new VSCode window

## Usage

### Opening the Smart Terminal

- **Command Palette**: Press `Ctrl+Shift+P` and search for "Open Smart Terminal"
- **Keyboard Shortcut**: Press `Ctrl+Shift+O` (Windows/Linux) or `Cmd+Shift+O` (Mac)

### Basic Usage

1. **Enter Commands**: Type commands as you would in a regular terminal
2. **View Output**: Each command and its output is displayed in a separate block
3. **Collapse Output**: Click on the collapse button to hide long output
4. **Navigate Directories**: The terminal will automatically sync with your VSCode explorer navigation

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+O` | Open Smart Terminal |
| `Enter` | Execute command |
| `Up Arrow` | Previous command |
| `Down Arrow` | Next command |

## Configuration

The extension currently uses default settings. Future versions will include configuration options for:

- Terminal theme customization
- Block behavior settings
- History storage options
- Shell integration settings

## Technical Architecture

### Core Components

1. **Webview Terminal**: xterm.js-based terminal with enhanced UI
2. **Block Manager**: Manages command blocks and visual decorations
3. **Shell Integration**: Provides command boundary detection
4. **Directory Sync**: Synchronizes terminal directory with VSCode explorer
5. **History Manager**: SQLite-based command history storage

### Technology Stack

- **Frontend**: TypeScript, xterm.js, React (future)
- **Backend**: Node.js, VSCode Extension API
- **Storage**: SQLite
- **Build Tools**: TypeScript, Webpack

## Development

### Prerequisites

- Node.js 18+
- VSCode 1.74+
- npm or yarn

### Development Workflow

1. **Install dependencies**: `npm install`
2. **Start watch mode**: `npm run watch`
3. **Launch extension**: Press `F5` in VSCode
4. **Test changes**: Make changes to the code and they will be automatically compiled

### Testing

Run the test suite:
```bash
npm test
```

## Roadmap

### MVP (Current)
- [x] Webview terminal with xterm.js
- [x] Block-based architecture
- [x] Basic visual decorations
- [x] Directory sync
- [x] Command history management

### V1.0
- [ ] Advanced block features (copy, share, filter)
- [x] Smart command completion
- [ ] AI integration (natural language to command)
- [ ] Output visualization (JSON, CSV, images)

### V2.0
- [ ] Command snippets and workflows
- [ ] Team collaboration features
- [ ] Theme customization
- [ ] More shell integrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Submit clear commit messages

## License

MIT License

## Support

If you encounter any issues or have feature requests, please create an issue on the GitHub repository.

---

**Enjoy your enhanced terminal experience!** 🎉

# Obsidian Code Snippets Plugin

A plugin that brings VSCode-like code snippets functionality to Obsidian, allowing you to quickly insert predefined code templates and text snippets.

[中文文档](README_zh.md) | English

## Features

### 🚀 Core Features
- **Smart Code Snippets**: Support for placeholders, variables, and multiple cursor positions
- **Multiple Trigger Modes**: Auto-trigger, manual trigger (Ctrl/Cmd+Space), or Tab key
- **Fuzzy Matching**: Support for non-continuous character matching of snippet prefixes
- **Scope Restriction**: Set dedicated snippets for different languages
- **Usage Statistics**: Smart sorting of suggestions based on usage frequency

### 📝 Snippet Syntax
- `${1:defaultValue}` - Placeholder with default value
- `${1}` - Simple placeholder
- `{{date}}` - Current date (YYYY-MM-DD)
- `{{time}}` - Current time (HH:MM:SS)
- `{{datetime}}` - Complete date and time
- `{{year}}` - Current year
- `{{month}}` - Current month
- `{{day}}` - Current day

### 🎯 Built-in Snippets
The plugin comes with commonly used code snippets:

**JavaScript/TypeScript**
- `func` - Function template
- `class` - Class template
- `arrow` - Arrow function

**Python**
- `class` - Class template
- `def` - Function template
- `if` - Conditional statement

**Markdown**
- `code` - Code block
- `table` - Table template
- `note` - Obsidian note template

## Installation

### Manual Installation
1. Download the latest plugin files
2. Extract to `{VaultFolder}/.obsidian/plugins/code-snippets/`
3. Enable the "Code Snippets" plugin in Obsidian settings

### From Community Plugins
1. Open Obsidian settings
2. Go to "Community plugins"
3. Search for "Code Snippets"
4. Install and enable

## Usage Guide

### Basic Usage

#### Triggering Code Snippets
Since Obsidian's Tab key has special purposes (creating references, indentation, etc.), we provide multiple trigger methods:

**Method 1: Auto-trigger (Recommended)**
1. Type snippet prefix in editor, e.g., `func`
2. Snippet suggestions appear automatically
3. Use arrow keys to select, press Enter to confirm

**Method 2: Manual Trigger**
1. Type snippet prefix, e.g., `func`
2. Press `Ctrl+Space` (Windows) or `Cmd+Space` (Mac) to trigger
3. Select the snippet to insert

**Method 3: Tab Key Trigger (Use with caution)**
1. Enable "Tab key trigger" mode in settings
2. Type snippet prefix, e.g., `func`
3. Press `Tab` key to trigger (Note: may conflict with Obsidian's Tab functionality)

#### Example: Creating a JavaScript Function

**Auto-trigger mode (Recommended):**
```
1. Type: func
2. Suggestions appear automatically
3. Press Enter or click to select
4. Expands to:
   function functionName(parameters) {
       // TODO: implement
       return undefined;
   }
5. Cursor positions at "functionName", type the function name
6. Press Tab to jump to next placeholder "parameters"
```

### Managing Snippets
1. Use command palette (`Ctrl/Cmd + P`)
2. Run "Open Code Snippets Manager" command
3. Add, edit, or delete snippets in the manager

### Custom Snippet Examples

**Basic Snippet**
```json
{
  "name": "HTML5 Template",
  "prefix": "html5",
  "body": [
    "<!DOCTYPE html>",
    "<html lang=\"en\">",
    "<head>",
    "    <meta charset=\"UTF-8\">",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "    <title>${1:Document}</title>",
    "</head>",
    "<body>",
    "    ${2:<!-- Content -->}",
    "</body>",
    "</html>"
  ],
  "description": "HTML5 document template"
}
```

**Snippet with Variables**
```json
{
  "name": "Daily Note Template",
  "prefix": "daily",
  "body": [
    "# ${1:Title} - {{date}}",
    "",
    "## Today's Plans",
    "- ${2:Plan items}",
    "",
    "## Daily Summary",
    "${3:Summary content}",
    "",
    "**Created**: {{datetime}}"
  ],
  "description": "Daily note template"
}
```

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Enable Code Snippets | Enable/disable plugin functionality | Enabled |
| Trigger Mode | Auto-trigger/Manual trigger/Tab key trigger | Auto-trigger |
| Show Snippet Preview | Show code preview in suggestions | Enabled |
| Enable Fuzzy Match | Allow non-continuous character matching | Enabled |
| Max Suggestions | Number of suggestions to show simultaneously | 10 |
| Enable Usage Stats | Record usage count for smart sorting | Enabled |

## Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl/Cmd + Space` | Manually trigger code snippets (Recommended) |
| `Ctrl/Cmd + Shift + Space` | Force show snippet suggestion list |
| `Tab` | Jump to next placeholder |
| `Shift + Tab` | Jump to previous placeholder |
| `Tab` | Trigger snippet expansion (Tab mode only, use with caution) |
| `Ctrl/Cmd + P` | Open command palette |

## Import/Export

### Export Snippets
1. Click "Export Snippets" in settings page
2. Snippets will be saved as JSON file to vault root
3. Filename format: `snippets-export-YYYY-MM-DD.json`

### Import Snippets
1. Click "Import Snippets" in settings page
2. Select previously exported JSON file
3. Snippets will be added to current snippet library

## Development

### Project Structure
```
obsidian-code-snippets/
├── main.ts                    # Main plugin file
├── manifest.json              # Plugin manifest
├── src/
│   ├── types.ts              # Type definitions
│   ├── snippet-manager.ts    # Snippet manager
│   ├── snippet-expander.ts   # Snippet expander
│   ├── settings-tab.ts       # Settings panel
│   └── snippet-manager-modal.ts # Management interface
├── package.json
├── tsconfig.json
└── esbuild.config.mjs
```

### Build Commands
```bash
# Development mode (watch file changes)
npm run dev

# Production build
npm run build

# Version update
npm run version
```

### Tech Stack
- **TypeScript** - Main development language
- **Obsidian API** - Plugin framework
- **ESBuild** - Build tool

## Contributing

Welcome to contribute code! Please follow these steps:

1. Fork the project repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

### Development Environment Setup
```bash
# Clone repository
git clone https://github.com/SilverStr1ng/Obsidian-Code-Snippet.git

# Install dependencies
npm install

# Start development mode
npm run dev

# Test in Obsidian
# Symlink project folder to test vault's .obsidian/plugins/ directory
```

## FAQ

**Q: Snippets not triggering?**
A: Check if plugin is enabled, verify trigger mode settings, confirm prefix spelling is correct.

**Q: How to backup my snippets?**
A: Use "Export Snippets" feature, or directly copy `.obsidian/snippets.json` file.

**Q: Can I import VSCode snippets?**
A: Currently requires manual format conversion, future versions will support direct import.

**Q: Placeholder jumping not working?**
A: Ensure using Tab key immediately after snippet expansion, avoid moving cursor to other positions.

**Q: Tab key conflicts with Obsidian features?**
A: Recommended solutions:
1. Switch to "Auto-trigger" mode (most recommended)
2. Use "Manual trigger" mode, press Ctrl/Cmd+Space
3. Plugin intelligently avoids Tab key conflicts in list and reference environments

## Changelog

### v1.0.1 (2025-08-06)
- 🔧 **Fixed data persistence issue**: User-defined code snippets are now properly saved in the plugin data directory
- 📁 **Improved data storage**: Uses Obsidian plugin standard data storage API to ensure data security
- 🐛 **Fixed close button obstruction**: Optimized management interface layout to ensure the close button is always visible
- 📝 **Enhanced logging**: Added detailed save/load status logging for easier problem diagnosis

### v1.0.0 (2025-06-29)
- 🎉 Initial release
- ✨ Basic code snippets functionality
- ✨ Snippet management interface
- ✨ Multiple trigger modes
- ✨ Variable and placeholder support
- ✨ Import/export functionality
- ✨ Keyboard shortcuts support
- ✨ Responsive design

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support & Feedback

- **Issue Reports**: [GitHub Issues](https://github.com/SilverStr1ng/Obsidian-Code-Snippet/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/SilverStr1ng/Obsidian-Code-Snippet/discussions)
- **Email Contact**: rakuyou63@gmail.com

---

If this plugin helps you, please consider giving the project a ⭐ star!

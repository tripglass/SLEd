# 📚 Lorebook Editor v3.3 - Complete Documentation

## 🎯 Overview

The Lorebook Editor is a powerful web-based tool for creating and managing SillyTavern lorebooks. This version includes advanced features like Search & Replace, comprehensive keyboard shortcuts, and a modern dark mode interface.

---

## 🚀 Quick Start

1. **Open `index.html`** in your browser
2. **Import** an existing lorebook with **Ctrl+I** or click "Import Lorebook"
3. **Create entries** with **Ctrl+N** or click "New Entry"
4. **Edit content** in the rich text editor
5. **Save changes** with **Ctrl+S**
6. **Export** your lorebook with **Ctrl+E**

---

## ✨ Features

### Core Functionality
- 📝 **Multi-tab Entry Management** - Work on multiple entries simultaneously
- 💾 **Auto-save Tracking** - Visual indicators for unsaved changes
- 🌓 **Dark Mode** - Toggle between light and dark themes (**Ctrl+D**)
- ♿ **Accessibility** - Dyslexia-friendly font option (**Ctrl+Shift+A**)
- 📱 **Responsive Design** - Works on desktop and mobile devices

### Advanced Features
- 🔍 **Search & Replace** - Find and replace text across entries (**Ctrl+H**)
- ⌨️ **Keyboard Shortcuts** - 16 shortcuts for complete keyboard workflow
- 🔄 **Merge Functionality** - Import and merge lorebooks (**Ctrl+M**)
- 📄 **Export as Text** - Export lorebook as readable .txt file with customizable options
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 🔍 **Sidebar Zoom** - Three view levels (Compact, Normal, Detailed) with **Ctrl+/-**
- 🎭 **Role Selector** - Choose role position (@D, @1, @2, etc.) for each entry
- ⚙️ **Per-Entry Overrides** - Advanced settings per entry (scan depth, priority, probability)
- 📌 **Sticky Headers** - Tab bar stays visible while scrolling through content

---

## ⌨️ Keyboard Shortcuts

### File Operations
| Shortcut | Function | Description |
|----------|----------|-------------|
| **Ctrl+I** | Import Lorebook | Load a JSON lorebook file |
| **Ctrl+E** | Export Lorebook | Save current lorebook as JSON |
| **Ctrl+M** | Import for Merge | Add entries from another lorebook |

### Entry Management
| Shortcut | Function | Description |
|----------|----------|-------------|
| **Ctrl+N** | New Entry | Create a new lorebook entry |
| **Ctrl+S** | Save Entry | Save the currently active entry |
| **Ctrl+W** | Close Tab | Close the current entry tab |

### Navigation
| Shortcut | Function | Description |
|----------|----------|-------------|
| **Ctrl+Tab** | Next Tab | Switch to the next open tab |
| **Ctrl+Shift+Tab** | Previous Tab | Switch to the previous tab |

### Search & Replace
| Shortcut | Function | Description |
|----------|----------|-------------|
| **Ctrl+H** | Open Search | Open the Find & Replace modal |
| **Enter** | Find All | Search for all occurrences |
| **Shift+Enter** | Replace Next | Replace current match |
| **Ctrl+Enter** | Replace All | Replace all matches |

### Display & Theme
| Shortcut | Function | Description |
|----------|----------|-------------|
| **Ctrl+D** | Toggle Dark Mode | Switch between light/dark themes |
| **Ctrl+Shift+A** | Toggle Dyslexia Font | Switch to dyslexia-friendly font |
| **Ctrl+-** | Zoom Out Sidebar | Switch to more compact view |
| **Ctrl++** | Zoom In Sidebar | Switch to more detailed view |

### Help
| Shortcut | Function | Description |
|----------|----------|-------------|
| **F1** or **Shift+?** | Show Help | Display the help modal |

---

## 📄 Export as Text Feature

### Overview
Export your lorebook as a human-readable .txt file with customizable formatting options. Perfect for backups, sharing, or version control with text diffs.

### How to Use
1. Click the **"Export"** dropdown button
2. Select **"Export as Text"**
3. Configure export options in the modal:
   - **Group by Keywords**: Organize entries by keyword tags
   - **Include Comments**: Add your personal notes to the export
   - **Include Stats**: Add word counts and entry statistics
   - **Custom Separator**: Choose divider style between entries
4. Click **"Export"** to download the .txt file

### Export Options Explained

**Group by Keywords**
- When enabled, entries are organized by their primary keywords
- Creates sections like "## Keyword: dragon" with all matching entries
- Entries with multiple keywords appear under their first keyword
- Entries without keywords appear in an "Uncategorized" section

**Include Comments**
- Adds the "Comment" field to each entry in the export
- Comments are your personal notes (not sent to AI)
- Useful for tracking entry purposes or ideas

**Include Stats**
- Adds statistics at the end of the export:
  - Total number of entries
  - Total word count
  - Average words per entry
  - Entries with comments
  - Keyword distribution

**Custom Separator**
- Choose between different visual dividers:
  - `---` (dashes)
  - `===` (equals)
  - `***` (asterisks)
  - Custom text

### Use Cases
- **Readable Backups**: Create text files you can read without the editor
- **Version Control**: Use git to track changes with text diffs
- **Printing**: Print your lorebook in a readable format
- **Sharing**: Share lorebooks in universal .txt format
- **Documentation**: Create formatted documentation from your lorebook

---

## 🎭 Role Selector & Advanced Settings

### Role Position Selector
Each entry can specify where it appears in the AI context:
- **@D** (Default) - Use global lorebook settings
- **@0** - After system prompt
- **@1** - After examples
- **@2** - After scenario
- **@3** - After persona
- **@4** - After chat history

**Note**: Position numbers may vary based on your AI frontend's configuration.

### Per-Entry Overrides
Each entry can override global lorebook settings:

**Scan Depth**
- How many recent chat messages to scan for keywords
- Higher = checks more history, but slower
- Default: Uses global setting

**Priority**
- Order of entry insertion when multiple entries trigger
- Higher numbers insert first
- Default: 100

**Case Sensitive**
- Whether keyword matching respects capitalization
- Enabled: "Dragon" ≠ "dragon"
- Disabled: "Dragon" = "dragon"

**Probability**
- Chance (0-100%) that entry will activate when keywords match
- 100 = always activates
- 50 = activates half the time
- Useful for randomized content

### Extensions Field
- Custom JSON for frontend-specific features
- Not standardized across all AI frontends
- Use with caution - may not be portable

---

## 🔍 Sidebar Zoom Levels

The sidebar can display entries in three different detail levels:

### Compact View (Ctrl+-)
- Minimal information per entry
- Shows only entry name/title
- Best for large lorebooks (50+ entries)
- Maximum entries visible at once

### Normal View (Default)
- Balanced information display
- Shows entry name and activation state
- Good for most lorebooks (10-50 entries)
- Comfortable scrolling experience

### Detailed View (Ctrl++)
- Maximum information per entry
- Shows name, activation, keywords preview
- Best for small lorebooks (<10 entries)
- Easiest to distinguish entries at a glance

**Tip**: Your zoom preference is saved to browser localStorage and persists across sessions.

---

## 📌 Sticky Headers Feature

### Desktop Version
The tab bar (entry title + buttons) remains visible while scrolling through entry fields:
- **Always accessible**: Save button always visible
- **Context awareness**: Always see which entry you're editing
- **Smooth scrolling**: Content scrolls naturally underneath the header

### How It Works
- Uses CSS `position: sticky` for performance
- Header "sticks" to the top of the viewport
- No JavaScript scroll listeners needed
- Works in all modern browsers

**Tip**: This feature ensures you can always save your work without scrolling back to the top.

---

## 🔍 Search & Replace Guide

### How to Use
1. Press **Ctrl+H** or click "🔍 Find & Replace"
2. Enter your search term
3. Choose search scope:
   - **Content** - Search entry content only
   - **Keywords** - Search keyword fields only
   - **Names** - Search entry names only
   - **All Fields** - Search everywhere
4. Set options:
   - **Case Sensitive** - Match exact case
   - **Whole Words** - Match complete words only
   - **Use Regex** - Use regular expressions
5. Click "Find All" to see results
6. Use "Replace Next" or "Replace All" to make changes

### Search Tips
- **Regular Expressions**: Use patterns like `\d+` for numbers or `[A-Z]+` for uppercase letters
- **Case Sensitivity**: Disable for broader searches
- **Whole Words**: Enable to avoid partial matches
- **Scope Selection**: Search specific fields for faster results

### Examples
- Find all numbers: Search for `\d+` with "Use Regex" enabled
- Replace common typos: Search for "teh" → Replace with "the"
- Update formatting: Search for `\*\*(.+?)\*\*` → Replace with `**$1**`

---

## 📝 Entry Management

### Creating Entries
1. Press **Ctrl+N** or click "New Entry"
2. Fill in entry details:
   - **Display Name** - How the entry appears in lists
   - **Keys** - Keywords that trigger this entry (comma-separated)
   - **Content** - The main text content
   - **Comment** - Internal notes (optional)
   - **Order** - Priority order (lower numbers = higher priority)
3. Configure advanced options:
   - **Constant** - Always include in context
   - **Selective** - Use character filters
   - **Extension** - Extend other entries
4. Save with **Ctrl+S**

### Managing Tabs
- **Multiple Entries**: Open multiple entries in tabs
- **Unsaved Changes**: Orange dot indicates unsaved changes
- **Tab Navigation**: Use **Ctrl+Tab** to switch between tabs
- **Close Tabs**: Use **Ctrl+W** to close current tab

### Entry Fields Explained
- **Display Name**: Human-readable name for the entry
- **Keys**: Comma-separated keywords that trigger this entry
- **Content**: The main text that gets inserted
- **Comment**: Internal notes (not included in output)
- **Order**: Numerical priority (0 = highest)
- **Constant**: Always include regardless of keyword matches
- **Selective**: Only include for specific characters
- **Extension**: Extends/merges with other entries

---

## 🎨 Interface Guide

### Header Controls
- **Import Lorebook** - Load JSON files (**Ctrl+I**)
- **Export Lorebook** - Save as JSON (**Ctrl+E**)
- **Import for Merge** - Add entries from another file (**Ctrl+M**)
- **New Entry** - Create entry (**Ctrl+N**)
- **Find & Replace** - Search tool (**Ctrl+H**)
- **Help** - Show help modal (**F1**)
- **Theme Toggle** - Dark/light mode (**Ctrl+D**)
- **Font Toggle** - Dyslexia font (**Ctrl+Shift+A**)

### Tab System
- **Active Tab**: Highlighted in blue
- **Unsaved Changes**: Orange dot indicator
- **Tab Navigation**: Click tabs or use **Ctrl+Tab**
- **Close Buttons**: X button on each tab

### Editor Panel
- **Entry Form**: All entry fields and options
- **Save Button**: Manual save (**Ctrl+S**)
- **Character Filters**: For selective entries
- **Advanced Options**: Constant, Selective, Extension settings

---

## 🔧 Technical Details

### File Format
The editor uses the SillyTavern lorebook JSON format:
```json
{
  "entries": [
    {
      "uid": "unique-id",
      "keys": ["keyword1", "keyword2"],
      "content": "Entry content here...",
      "name": "Display Name",
      "comment": "Internal notes",
      "order": 100,
      "constant": false,
      "selective": false,
      "extension": false
    }
  ]
}
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Local Storage
The editor saves preferences to browser localStorage:
- Theme preference (light/dark)
- Font preference (normal/dyslexia)
- Last opened entries

---

## 🎯 Workflow Examples

### Complete Workflow (Keyboard Only)
```
Ctrl+I           # Import existing lorebook
Ctrl+N           # Create new entry
[Type content]   # Write your entry
Ctrl+S           # Save the entry
Ctrl+H           # Search for something
[Search term]    # Enter search term
Enter            # Find all matches
[Replace term]   # Enter replacement
Ctrl+Enter       # Replace all
Escape           # Close search
Ctrl+E           # Export completed lorebook
```

### Quick Entry Creation
```
Ctrl+N           # New entry
[Display name]   # Tab to next field
[Keywords]       # Tab to content
[Content]        # Write entry
Ctrl+S           # Save
Ctrl+N           # Next entry
```

### Search and Refactor
```
Ctrl+H           # Open search
[Old term]       # What to find
Enter            # Find all occurrences
[New term]       # What to replace with
Ctrl+Enter       # Replace all
```

---

## 🛠️ Troubleshooting

### Common Issues

**Q: Keyboard shortcuts aren't working**
- Make sure you're not typing in a text field
- Some shortcuts are disabled during text entry to prevent conflicts
- Try clicking outside text fields and try again

**Q: Search isn't finding matches**
- Check if "Case Sensitive" is enabled
- Try disabling "Whole Words" for partial matches
- Verify you're searching in the correct scope (Content/Keywords/Names/All)

**Q: Entries aren't saving**
- Make sure you've filled in the required fields (Display Name, Keys, Content)
- Check for error messages in the browser console
- Try refreshing the page and re-importing your lorebook

**Q: Dark mode isn't persisting**
- Check if browser cookies/localStorage are enabled
- Some browsers block localStorage in private/incognito mode

### Performance Tips
- **Large Lorebooks**: Search works best with <1000 entries
- **Complex Regex**: Simple patterns are faster than complex ones
- **Browser Memory**: Close unused tabs to free up memory

---

## 📈 Feature History

### v3.3 Current Version
- ✅ Export as Text functionality with customizable options
- ✅ Role selector for context position (@D, @1, @2, etc.)
- ✅ Per-entry overrides (scan depth, priority, probability)
- ✅ Sidebar zoom levels (Compact, Normal, Detailed)
- ✅ Sticky headers for better navigation
- ✅ Activation dropdown moved above Name field
- ✅ Material Symbols icons throughout UI
- ✅ Enhanced mobile keyboard handling
- ✅ Multi-select drag and drop for entries

### v2.1 Previous Version
- ✅ Search & Replace functionality
- ✅ 16 keyboard shortcuts
- ✅ Smart input detection
- ✅ Comprehensive documentation
- ✅ Dark mode enhancements
- ✅ Accessibility improvements

### Earlier Versions
- v2.0: Basic multi-tab interface
- v1.0: Simple entry editor

---

## 🎉 Tips & Tricks

### Power User Features
1. **Keyboard-Only Workflow**: Use shortcuts to avoid mouse entirely
2. **Regex Power**: Master regular expressions for advanced searches
3. **Tab Management**: Keep related entries open in tabs
4. **Quick Navigation**: Use Ctrl+Tab to switch between entries rapidly

### Best Practices
1. **Save Often**: Use Ctrl+S frequently to avoid losing work
2. **Descriptive Names**: Use clear display names for easy identification
3. **Keyword Strategy**: Use consistent keyword patterns
4. **Regular Backups**: Export your lorebook regularly

### Hidden Features
- **Smart Shortcuts**: Shortcuts automatically disable during text entry
- **Context Search**: Search specific fields for faster results
- **Visual Feedback**: Orange dots show unsaved changes
- **Help System**: Press F1 anytime for help

---

## 🔮 Future Enhancements

Potential features for future versions:
- 📱 Mobile-responsive design improvements
- 🎨 Selection group indicators
- 📦 Keyword bundles and templates
- 🔄 Undo/redo functionality
- 📊 Entry statistics and analytics
- 🔗 Cross-entry linking
- 🖼️ Image support for entries

---

## 📞 Support

If you encounter issues or have suggestions:
1. Check this documentation first
2. Try refreshing the page
3. Ensure your browser is up to date
4. Check browser console for error messages

---

## 📄 License

This Lorebook Editor is provided as-is for personal and commercial use. No warranty is provided.

---

*Last Updated: November 2025
*Version: 3.3*
*Features: Export as Text, Role Selector, Per-Entry Overrides, Sidebar Zoom, Sticky Headers, Search & Replace, Keyboard Shortcuts, Dark Mode, Accessibility*
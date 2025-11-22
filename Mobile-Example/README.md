# 📱 Simple Lorebook Editor (SLEd) - Mobile Version

## 🎯 Quick Start

1. **Open the app**: Open `index.html` in your mobile browser
2. **Name your lorebook** (optional): Tap the header to enter a name - this becomes your export filename!
3. **Import**: Tap the **<span class="material-symbols-outlined">menu</span>** hamburger menu, then "<span class="material-symbols-outlined">download</span> Import" and select "Import Lorebook"
4. **Edit**: Tap any entry in the sidebar to open it
5. **Swipe navigation**: Swipe right to open the sidebar, swipe left to close it
6. **Save**: Tap "<span class="material-symbols-outlined">save</span>" in the editor header (orange ● shows unsaved changes)
7. **Export**: Open menu → "<span class="material-symbols-outlined">upload</span> Export" → choose "Export JSON" or "Export as Text"

## ✨ Mobile-Specific Features

- <span class="material-symbols-outlined">swipe</span> **Swipe Navigation** - Swipe right/left to open/close the sidebar
- <span class="material-symbols-outlined">menu</span> **Hamburger Menu** - Access all functions through the top-left menu
- <span class="material-symbols-outlined">touch_app</span> **Touch-Friendly UI** - Large tap targets optimized for fingers
- <span class="material-symbols-outlined">tab</span> **Tap-to-Open Tabs** - Tap entries to open them (no hover needed)
- <span class="material-symbols-outlined">keyboard</span> **Smart Keyboard Handling** - Content adjusts when keyboard opens, cursor position preserved
- <span class="material-symbols-outlined">push_pin</span> **Sticky Headers** - Tab bar and save button stay visible while scrolling
- <span class="material-symbols-outlined">fullscreen</span> **Fullscreen Mode** - Expand content for distraction-free editing
- <span class="material-symbols-outlined">zoom_in</span> **Sidebar Zoom** - Three view levels: Compact, Normal, Detailed

## 📱 Touch Gestures

- **Swipe Right** - Open sidebar (from anywhere in editor view)
- **Swipe Left** - Close sidebar (when sidebar is open)
- **Tap Entry** - Open entry in editor
- **Tap Tab** - Switch between open entries
- **Long Press** - Access entry actions (insert, copy, delete)
- **Pinch to Zoom** - Zoom text (native browser feature)

## ✨ Core Features

- <span class="material-symbols-outlined">tab</span> **Multi-tab Entry Management** - Work on multiple entries with tabs
- <span class="material-symbols-outlined">save</span> **Auto-save Tracking** - Visual indicators for unsaved changes (orange ●)
- <span class="material-symbols-outlined">dark_mode</span> **Dark Mode** - Toggle between light and dark themes
- <span class="material-symbols-outlined">accessibility</span> **Dyslexia Font** - Switch to OpenDyslexic font for better readability
- <span class="material-symbols-outlined">find_replace</span> **Search & Replace** - Find and replace text across all entries
- <span class="material-symbols-outlined">merge</span> **Merge Functionality** - Import and combine lorebooks
- <span class="material-symbols-outlined">description</span> **Export as Text** - Export as readable .txt file with customizable options
- <span class="material-symbols-outlined">drag_indicator</span> **Reorder Entries** - Long press and drag to reorder (single or multi-select)

## 🎨 Interface Layout

### Sidebar View
- **Header**: Zoom controls (<span class="material-symbols-outlined">zoom_out</span>/<span class="material-symbols-outlined">zoom_in</span>) and Search (<span class="material-symbols-outlined">search</span>)
- **Entry List**: Scrollable list of all entries with activation states
- **Tap Entry**: Opens entry in editor and automatically switches to editor view

### Editor View
- **Sticky Tab Bar**: Entry title, fullscreen (<span class="material-symbols-outlined">fullscreen</span>), and save (<span class="material-symbols-outlined">save</span>) buttons stay at top
- **Scrollable Content**: All entry fields scroll naturally
- **Keyboard Smart**: Content adjusts when mobile keyboard opens, preserving cursor position

### Menu (Hamburger <span class="material-symbols-outlined">menu</span>)
- **Import/Export**: Import Lorebook, Export JSON, Export as Text, Import for Merging
- **Settings**: Dark Mode, Dyslexia Font
- **Tools**: Search & Replace, Help/README

## 📝 Entry Fields (Mobile Layout)

Fields are organized in mobile-optimized order:

1. **Activation** (dropdown) - *Now above Name/Title field for better workflow*
2. **Name/Title** - Entry identifier
3. **Content** - Main text (auto-adjusts for keyboard)
4. **Keywords** - Comma-separated activation keywords
5. **Secondary Keywords** - Additional keywords (optional)
6. **Comment** - Personal notes (not exported to AI)
7. **Advanced Settings** - Expandable section with:
   - Position, Scan Depth, Priority
   - Case Sensitive toggle
   - Probability, Role selector
   - Extensions field

## <span class="material-symbols-outlined">keyboard</span> Mobile Keyboard Handling

When you tap in the **Content** text area:
- The viewport automatically adjusts to show the keyboard
- The cursor appears exactly where you tapped
- Text area resizes to fit available space
- Scroll position is maintained
- Works in both normal and fullscreen modes

**Note**: This feature uses Visual Viewport API for optimal keyboard handling on modern mobile browsers.

## <span class="material-symbols-outlined">push_pin</span> Sticky Headers Behavior

### In Editor View:
- **Tab Bar** (entry title + buttons) stays at the top while you scroll through content
- **Save Button** always visible for quick saving
- Smooth scrolling through all entry fields

### In Sidebar View:
- **Zoom/Search Controls** stay at top while scrolling through entries
- Entry list scrolls naturally underneath

This ensures important controls are always accessible without scrolling back to the top.

## <span class="material-symbols-outlined">find_replace</span> Search & Replace

Open from menu → **Search & Replace**:
- **Scope Options**: Content, Keywords, Names, or All Fields
- **Find All**: See all matches before replacing
- **Replace Next**: Replace one match at a time
- **Replace All**: Replace all matches instantly
- **Options**: Case Sensitive, Whole Words, Regular Expressions
- **Tap Results**: Tap any result to jump to that entry

### Tips:
- Always **Find All** first to preview matches
- Use **Case Sensitive** to match "Dragon" but not "dragon"
- Use **Whole Words** to prevent "dragon" from matching "dragonfly"
- **RegEx patterns**: `\d+` for numbers, `[A-Z]+` for uppercase letters

## <span class="material-symbols-outlined">description</span> Export as Text

Create readable backups with customization:
- **Group by Keywords**: Organizes entries by keyword tags
- **Include Comments**: Add your personal notes to export
- **Include Stats**: Add word counts and entry statistics
- **Custom Separator**: Choose divider style between entries

Perfect for:
- Creating readable backups
- Sharing lorebooks in plain text format
- Printing lorebook content
- Version control with text diffs

## <span class="material-symbols-outlined">merge</span> Merging Lorebooks

Menu → **Import for Merging**:
1. Import a second lorebook
2. New entries are added to the end
3. All existing entries are preserved
4. Save to commit the merge

Great for combining character lorebooks or integrating world-building sets.

## <span class="material-symbols-outlined">lightbulb</span> Mobile Tips & Tricks

- **Swipe is fastest**: Swipe right/left to toggle sidebar instead of using the menu button
- **Activation dropdown moved**: Now above Name/Title field for better mobile workflow
- **Fullscreen editing**: Tap <span class="material-symbols-outlined">fullscreen</span> to hide tabs and maximize content space
- **Keywords are comma-separated**: Type "sword, magic, fire" in keyword fields
- **Orange dot (●)**: Shows unsaved changes on tabs
- **Zoom levels**: Try different sidebar zoom levels to find what works best on your screen
- **Long press for actions**: Long press entries for insert, copy, delete options
- **Close tabs**: Tap the ✕ on tabs to close them
- **Multi-select drag**: Check multiple entries and drag together to reorder in bulk

## 🛠️ Troubleshooting

### Swipe navigation not working?
- Make sure you're swiping from the edge of the screen
- Try a more deliberate, longer swipe
- Check that you're not accidentally selecting text

### Keyboard not adjusting properly?
- This feature requires modern mobile browsers (iOS Safari 13+, Chrome 84+)
- Try closing and reopening the app
- Ensure JavaScript is enabled
- Some older browsers may not support Visual Viewport API

### Content not scrolling?
- Sticky headers should stay in place while content scrolls
- If content is stuck, try switching between tabs
- Refresh the page if scrolling remains unresponsive

### Touch targets too small?
- Use the zoom controls in the sidebar header
- Try "Detailed" view for larger text and buttons
- Enable browser zoom if needed (pinch to zoom)

### README not loading?
If you get an error viewing the README, try these solutions:
1. **Use a local server**: Run `start-server.bat` or `start-server.ps1`
2. **Try Chrome/Firefox**: Different browsers have different security policies
3. **Use a mobile server app**: Install a local server app from your app store
4. **GitHub Pages**: Host the files on GitHub Pages or similar service

## 📚 Full Documentation

For complete documentation with all features and technical details, see `DOCUMENTATION.md` in the Desktop version or click "Full Documentation" in the help menu.

---

## 🔄 Differences from Desktop Version

### Mobile Has:
- ✅ Swipe navigation (left/right gestures)
- ✅ Hamburger menu for all functions
- ✅ Touch-optimized interface with larger tap targets
- ✅ Smart keyboard handling with viewport adjustment
- ✅ Tap-to-open entries (no hover required)
- ✅ Fullscreen content mode
- ✅ Mobile-optimized field layout

### Mobile Doesn't Have:
- ❌ Keyboard shortcuts (touch-focused instead)
- ❌ Hover actions (uses tap/long-press instead)
- ❌ Side-by-side multi-tab view (vertical tabs only)
- ❌ Context menus (uses long-press menus instead)
- ❌ Drag-and-drop files (uses file picker)

Both versions support the same lorebook format and can edit the same files!

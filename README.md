# 📚 Simple Lorebook Editor (SLEd)

A lightweight, browser-based editor for SillyTavern lorebook files with an ADHD-friendly interface!

Perfect for creating detailed roleplay lorebooks with a clean, accessible design that keeps you focused on your creative work.

## Features

✨ **Clean Interface**
- Simple, uncluttered design with good spacing
- Main fields visible: Name, Primary Keywords, Secondary Keywords with Logic, Content
- Advanced settings collapsed away until you need them

📄 **Multi-Entry Editing**
- Open multiple entries in tabs
- Easily switch between entries
- **Side-by-side view**: Toggle to see all open entries at once!
- Compare and copy between entries
- **● Unsaved indicator**: Orange dot on tabs shows which entries have unsaved changes

🎯 **Quick Sidebar Actions**
- **Hover to reveal action buttons** on each entry
- **Insert Above/Below** (table_row_add_before / table_row_add_after): Add new entry right where you need it, UIDs auto-adjust
- **Copy** (📋): Duplicate an entry instantly
- **Delete** (🗑️): Remove entries without opening them
- All actions work directly from the sidebar!

🔀 **Import & Merge**
- **Import Lorebook**: Replace current lorebook with a new one
- **Import for Merging**: Bring entries from another lorebook into your current one
- Select which entries to merge with checkboxes
- UIDs automatically renumber to avoid conflicts
- Perfect for combining multiple lorebooks or cherry-picking entries

📊 **Smart Reordering**
- Each entry has a number (its UID)
- Change any entry's number to move it in the list
- Other entries automatically shift to make room
- Keeps everything organized and sequential

🎯 **Multi-Select & Drag-Drop**
- Select multiple entries with checkboxes
- Drag and drop to reorder
- Drag multiple selected entries at once!
- Visual feedback when dragging

📕 **Full Lorebook Support**
- Import/export SillyTavern JSON lorebooks
- **Main editing area**: Name, Primary Keywords, Secondary Keywords with Logic dropdown, Content
- **Advanced settings (collapsed)**: All SillyTavern fields including:
  - Character Filter (include/exclude by names or tags)
  - Generation Triggers (Normal, Continue, Impersonate, Swipe, Regenerate, Quiet)
  - Additional Matching Sources (match against persona, character data, scenario, etc.)
  - All recursion, probability, timing, and positioning options
- **Insertion Position** dropdown with human-readable options (↑Char, ↓Char, @D, Outlet, etc.)
- Conditional fields that show/hide based on position:
  - **@D position**: Insertion Depth + Role selector
  - **Outlet position**: Outlet Name text field
  - **All positions**: Optional Scan Depth override (leave empty for global)
- Create, edit, and delete entries

📖 **Easy Navigation**
- Searchable entry list
- See keywords and status at a glance
- Quick filtering

♿ **Accessibility Features**
- **Creamy light mode** with warm, gentle colors
- **Dark chocolate night mode** for comfortable evening editing
- **Dyslexia-friendly font** toggle (OpenDyslexic)
- Preferences saved automatically
- WCAG-compliant contrast ratios in both modes

## How to Use

1. **Open the app**: Just open `index.html` in your web browser
2. **Name your lorebook** (optional): Enter a name in the header - this becomes your export filename!
3. **Import**: Click "Import Lorebook" and select your SillyTavern JSON file
4. **Edit**: Click any entry in the sidebar to open it
4. **Multiple tabs**: Click more entries to open them side-by-side
5. **Quick actions**: Hover over entries in the sidebar to see action buttons (insert, copy, delete)
6. **Merge lorebooks**: Click "Import for Merging" to cherry-pick entries from another lorebook
7. **Save**: Click "Save Changes" after editing (orange ● shows unsaved changes)
8. **Export**: Click "Export Lorebook" to download your edited file

## Files

- `index.html` - Main app file
- `styles.css` - Styling
- `script.js` - All the functionality

## Tips

- **Keywords are comma-separated** - just type "sword, magic, fire" in the keyword fields
- **Secondary Keywords Logic** determines how primary and secondary keywords work together (AND ANY, NOT ANY, NOT ALL, AND ALL)
- **Selective mode is automatic** - it turns on automatically when you add secondary keywords, and off when they're empty
- **Hover over sidebar entries** to reveal quick action buttons for copying, deleting, and inserting entries
- **No more popups!** - The orange dot (●) on tabs tells you when changes are saved
- **Merging lorebooks** - Use "Import for Merging" to combine entries from multiple lorebooks without losing your current work
- Advanced settings are collapsed by default - click to expand
- **Character Filter** - Control which characters this entry activates for (Include or Exclude mode)
- **Generation Triggers** - Limit entry to specific generation types (Normal, Continue, Impersonate, Swipe, Regenerate, Quiet). Empty = all types
- **Additional Matching Sources** - Match keywords against character/persona data instead of just chat messages:
  - Persona Description, Character Description, Character Personality
  - Character Depth Prompt, Scenario, Creator's Notes
- **Understanding the two depth fields**:
  - **Depth**: For @D position, this is where to inject the entry (Insertion Depth). For other positions, used for position-specific behavior
  - **Scan Depth Override**: Optional field to override how many messages back to scan for keywords (leave empty to use global setting)
- **Toggle side-by-side view** (▥/▦ button) to see multiple entries at once
- **Check multiple entries** and drag them together to reorder in bulk
- Click "Clear" to deselect all entries
- You can drag entries onto each other to reorder
- Search works on both entry names and keywords

## Deploying to GitHub Pages

1. Create a new GitHub repository
2. Upload these three files
3. Go to Settings > Pages
4. Select "main" branch and save
5. Your app will be live at `https://yourusername.github.io/repository-name`

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge)

---

Built with vanilla HTML/CSS/JavaScript - no dependencies needed! 🎉

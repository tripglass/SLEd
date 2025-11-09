[README.md](https://github.com/user-attachments/files/23435238/README.md)
# 📚 Lorebook Manager

A lightweight, browser-based editor for SillyTavern lorebook files with an ADHD-friendly interface!

## Features

✨ **Clean Interface**
- Simple, uncluttered design with good spacing
- Main fields visible: Name, Primary Keywords, Secondary Keywords with Logic, Content
- Advanced settings collapsed away until you need them

ðŸ”„ **Multi-Entry Editing**
- Open multiple entries in tabs
- Easily switch between entries
- **Side-by-side view**: Toggle to see all open entries at once!
- Compare and copy between entries

ðŸ“Š **Smart Reordering**
- Each entry has a number (its UID)
- Change any entry's number to move it in the list
- Other entries automatically shift to make room
- Keeps everything organized and sequential

🎯 **Multi-Select & Drag-Drop**
- Select multiple entries with checkboxes
- Drag and drop to reorder
- Drag multiple selected entries at once!
- Visual feedback when dragging

ðŸ“ **Full Lorebook Support**
- Import/export SillyTavern JSON lorebooks
- **Main editing area**: Name, Primary Keywords, Secondary Keywords with Logic dropdown, Content
- **Advanced settings (collapsed)**: All other SillyTavern fields
- **Insertion Position** dropdown with human-readable options (â†‘Char, â†“Char, @D, Outlet, etc.)
- Conditional fields that show/hide based on position:
  - **@D position**: Insertion Depth + Role selector
  - **Outlet position**: Outlet Name text field
  - **All positions**: Optional Scan Depth override (leave empty for global)
- Create, edit, and delete entries

ðŸ” **Easy Navigation**
- Searchable entry list
- See keywords and status at a glance
- Quick filtering

## How to Use

1. **Open the app**: Just open `index.html` in your web browser
2. **Import**: Click "Import Lorebook" and select your SillyTavern JSON file
3. **Edit**: Click any entry in the sidebar to open it
4. **Multiple tabs**: Click more entries to open them side-by-side
5. **Save**: Click "Save Changes" after editing
6. **Export**: Click "Export Lorebook" to download your edited file

## Files

- `index.html` - Main app file
- `styles.css` - Styling
- `script.js` - All the functionality

## Tips

- **Keywords are comma-separated** - just type "sword, magic, fire" in the keyword fields
- **Secondary Keywords Logic** determines how primary and secondary keywords work together (AND ANY, NOT ANY, NOT ALL, AND ALL)
- **Selective mode is automatic** - it turns on automatically when you add secondary keywords, and off when they're empty
- Advanced settings are collapsed by default - click to expand
- **Understanding the two depth fields**:
  - **Depth**: For @D position, this is where to inject the entry (Insertion Depth). For other positions, used for position-specific behavior
  - **Scan Depth Override**: Optional field to override how many messages back to scan for keywords (leave empty to use global setting)
- **Toggle side-by-side view** (⊞/⊟ button) to see multiple entries at once
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

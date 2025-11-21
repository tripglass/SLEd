# PWA Icons Setup

To complete the PWA installation, you need to add the following icon files to the `Mobile/` directory:

## Required Icons

1. **icon-192.png** - 192x192 pixels
   - Used for mobile home screen icon
   - Should be a PNG file with transparent or solid background

2. **icon-512.png** - 512x512 pixels
   - Used for splash screen and high-resolution displays
   - Should be a PNG file with transparent or solid background

## Creating Icons

You can use the existing `Sledlogo.png` from the parent directory as a base, or create new icons:

### Option 1: Use existing logo
If the `Sledlogo.png` is already 192x192 or larger, you can:
1. Copy it to `Mobile/icon-192.png`
2. Resize it to 512x512 and save as `Mobile/icon-512.png`

### Option 2: Create new icons
Use any image editor to create square PNG images:
- 192x192 pixels (icon-192.png)
- 512x512 pixels (icon-512.png)

### Recommended Design
- Use the SLEd branding/logo
- Ensure good contrast for visibility
- Keep design simple and recognizable at small sizes
- Consider using a solid background color for better visibility on various launchers

## Testing PWA Installation

Once icons are in place:

1. **On Android Chrome/Edge:**
   - Open the mobile site
   - Look for "Add to Home Screen" in the menu
   - Or tap the install prompt when it appears

2. **On iOS Safari:**
   - Tap the Share button
   - Select "Add to Home Screen"
   - Name the app and tap "Add"

3. **Test offline:**
   - Install the app
   - Turn off network connection
   - App should still load and work with cached data

## PWA Features Enabled

✅ Offline functionality with service worker caching
✅ Install to home screen
✅ Standalone app experience (no browser UI)
✅ Automatic updates with user notification
✅ Cached resources for fast loading
✅ Responsive theme color in status bar

## Files Added

- `manifest.json` - PWA configuration
- `service-worker.js` - Offline caching and update handling
- Updated `index.html` - Added PWA meta tags and service worker registration
- This README for icon setup instructions

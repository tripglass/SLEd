# SLEd PWA Fork

This repository is a fork of the original SLEd (Simple Lorebook Editor) with Progressive Web App (PWA) functionality added to the mobile version.

## What's Different?

### Original SLEd
- Desktop and mobile web applications
- Requires online access
- Browser-based only

### This Fork (PWA-Enabled)
- Desktop version unchanged
- **Mobile version now supports PWA features:**
  - 📱 Install to home screen
  - ⚡ Offline functionality
  - 🔄 Automatic updates
  - 💾 Smart caching
  - 🎨 Native app experience

## Quick Start

### For End Users

1. **Visit the mobile site** (must be served over HTTPS or localhost)
2. **Install icons** - Ensure `Mobile/icon-192.png` and `Mobile/icon-512.png` exist (see `Mobile/PWA-SETUP.md`)
3. **Install the app:**
   - **Android**: Tap menu → "Install app" or "Add to Home Screen"
   - **iOS**: Tap Share → "Add to Home Screen"
4. **Use offline** - Works without internet after first load!

### For Developers

See detailed documentation in:
- `Mobile/README-PWA.md` - Complete PWA implementation guide
- `Mobile/PWA-SETUP.md` - Setup instructions
- `Mobile/manifest.json` - PWA configuration
- `Mobile/service-worker.js` - Offline caching logic

## Files Added

```
Mobile/
├── manifest.json          # PWA configuration
├── service-worker.js      # Offline functionality
├── README-PWA.md          # Detailed documentation
└── PWA-SETUP.md           # Setup instructions
```

## Files Modified

```
Mobile/
└── index.html            # Added PWA meta tags and service worker registration
```

## Requirements

- HTTPS (or localhost for testing)
- Modern mobile browser (Chrome, Safari, Edge, Firefox)
- Icons must be generated and placed in Mobile/ directory

## Installation Status

⚠️ **Action Required**: Provide icons in `Mobile/` (`icon-192.png`, `icon-512.png`)

Once icons are in place:
- ✅ PWA manifest configured
- ✅ Service worker ready
- ✅ Offline caching enabled
- ✅ Update notifications enabled
- ✅ Meta tags configured
- 📱 Ready to install!

## Testing Locally

### Option 1: Python Server
```bash
cd Mobile
python -m http.server 8000
# Visit http://localhost:8000 on your mobile device
```

### Option 2: Node.js
```bash
cd Mobile
npx http-server -p 8000
# Visit http://localhost:8000 on your mobile device
```

### Option 3: VS Code Live Server
1. Install Live Server extension
2. Right-click `Mobile/index.html`
3. Select "Open with Live Server"

## Features Preserved

All original SLEd mobile features remain intact:
- ✅ Swipe navigation
- ✅ Touch-optimized UI
- ✅ Theme switching
- ✅ Entry editing
- ✅ Import/Export
- ✅ All functionality

## Browser Support

| Browser | Install | Offline | Updates |
|---------|---------|---------|---------|
| Chrome Android | ✅ | ✅ | ✅ |
| Safari iOS | ✅ | ✅ | ✅ |
| Edge Android | ✅ | ✅ | ✅ |
| Firefox Android | ✅ | ✅ | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ |

## What Works Offline?

After installation and first load:
- ✅ View existing lorebooks
- ✅ Edit entries
- ✅ Create new entries
- ✅ All UI features
- ✅ Theme switching
- ⚠️ Import/Export (limited)
- ❌ External documentation links

## Customization

### Change App Name
Edit `Mobile/manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "Custom"
}
```

### Change Theme Color
Edit `Mobile/manifest.json`:
```json
{
  "theme_color": "#your-color-here"
}
```

### Modify Cached Files
Edit `Mobile/service-worker.js` - update the `urlsToCache` array.

## Updating the App

When you make changes:

1. Edit your files
2. Update `CACHE_NAME` in `service-worker.js`:
   ```javascript
   const CACHE_NAME = 'sled-mobile-v2'; // Increment version
   ```
3. Users will automatically get an update prompt on next visit

## Troubleshooting

### "Install app" option not showing
- Ensure you're using HTTPS (or localhost)
- Verify icons exist and are correctly named
- Check browser console for errors

### Not working offline
- Check service worker is registered (DevTools → Application → Service Workers)
- Verify resources are cached (DevTools → Application → Cache Storage)

### Updates not appearing
- Increment `CACHE_NAME` in `service-worker.js`
- Hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R)

## Contributing

Improvements welcome! Key areas:
- Cross-browser testing
- Caching strategy optimization
- Icon design improvements
- Documentation enhancements

## Credits

- **Original SLEd**: ActualBroeckchen/SLEd
- **PWA Implementation**: This fork adds PWA functionality to the mobile version

## License

Same as the original SLEd project - see LICENSE file.

---

**Ready to go!** Just generate the icons and deploy to start using SLEd as a PWA! 🎉

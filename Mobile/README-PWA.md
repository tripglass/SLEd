# SLEd Mobile - PWA Implementation

This fork adds Progressive Web App (PWA) functionality to the mobile version of SLEd (Simple Lorebook Editor).

## 🚀 What's New

### PWA Features Added
- **📱 Install to Home Screen**: Add SLEd as a standalone app on your mobile device
- **⚡ Offline Functionality**: Works without internet connection after first load
- **🔄 Automatic Updates**: Get notified when new versions are available
- **💾 Smart Caching**: Fast loading with intelligent resource caching
- **🎨 Native Feel**: Runs in standalone mode without browser UI
- **🌈 Theme Integration**: Status bar matches app theme

## 📦 Files Added/Modified

### New Files
1. **`manifest.json`** - PWA configuration defining app properties
2. **`service-worker.js`** - Handles offline caching and updates
3. **`PWA-SETUP.md`** - Detailed setup instructions
4. **`generate-icons.html`** - Tool to generate app icons
5. **`README-PWA.md`** - This file

### Modified Files
1. **`index.html`** - Added PWA meta tags and service worker registration

## 🛠️ Setup Instructions

### 1. Generate Icons
Open `generate-icons.html` in your browser and download both icons:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

Place them in the `Mobile/` directory.

**Or** use your own custom icons - just ensure they're 192x192 and 512x512 pixels respectively.

### 2. Deploy
Upload all files to your web server. PWA features require:
- HTTPS (or localhost for testing)
- A web server (won't work with `file://` protocol)

### 3. Install on Mobile

#### Android (Chrome/Edge/Samsung Internet)
1. Open the mobile site in your browser
2. Tap the menu (⋮) and select "Install app" or "Add to Home Screen"
3. Or wait for the automatic install prompt
4. Tap "Install" and the app will be added to your home screen

#### iOS (Safari)
1. Open the mobile site in Safari
2. Tap the Share button (📤)
3. Scroll and tap "Add to Home Screen"
4. Edit the name if desired and tap "Add"

## ✨ How It Works

### Service Worker Caching
The service worker automatically caches:
- HTML, CSS, and JavaScript files
- Logo images
- Google Fonts (if available)

When offline, the app serves cached versions and continues to function.

### Update Mechanism
When a new version is available:
1. Service worker detects the update
2. User receives a notification prompt
3. Accepting the prompt refreshes the app with new content
4. Old cached files are automatically cleaned up

### Offline Capabilities
- ✅ View and edit existing lorebooks
- ✅ Create new entries
- ✅ Full editor functionality
- ✅ UI and navigation work completely
- ⚠️ Import/export may be limited (depends on browser)
- ⚠️ External links won't work without connection

## 🧪 Testing

### Test Installation
1. Open `Mobile/index.html` on a local server (use Python, Node, or any web server)
2. Navigate to the site on your mobile device
3. Look for the install prompt or use browser menu

### Test Offline Mode
1. Install the app
2. Visit the app normally (while online)
3. Enable airplane mode or disconnect from network
4. Open the installed app
5. Verify it loads and functions properly

### Test Updates
1. Make a change to any cached file
2. Update the `CACHE_NAME` in `service-worker.js` (e.g., `sled-mobile-v2`)
3. Reload the app
4. You should see an update notification

## 🎯 Customization

### Change App Name
Edit `manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "Custom"
}
```

### Change Theme Color
Edit `manifest.json` and `index.html`:
```json
{
  "theme_color": "#your-color",
  "background_color": "#your-color"
}
```

### Modify Cached Resources
Edit `service-worker.js` `urlsToCache` array to add/remove cached files.

### Adjust Cache Strategy
The current strategy is "Cache First, Network Fallback". To change:
1. Edit the `fetch` event listener in `service-worker.js`
2. Implement "Network First" or "Stale While Revalidate" strategies

## 🔧 Troubleshooting

### Install Button Not Showing
- Ensure you're using HTTPS (or localhost)
- Check browser console for errors
- Verify `manifest.json` is accessible
- Make sure icons exist and are correctly sized

### Service Worker Not Registering
- Check browser console for errors
- Verify `service-worker.js` is in the same directory as `index.html`
- Ensure server has correct MIME types (application/javascript)

### App Not Working Offline
- Verify service worker is registered (check DevTools > Application > Service Workers)
- Check if resources are cached (DevTools > Application > Cache Storage)
- Clear cache and try again

### Updates Not Applying
- Update `CACHE_NAME` in `service-worker.js` when making changes
- Clear browser cache and service worker cache
- Try unregistering the service worker and reinstalling

## 📱 Browser Support

### Full Support
- ✅ Chrome/Edge (Android)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ✅ Firefox (Android)

### Limited Support
- ⚠️ iOS Safari (older versions) - limited offline features
- ⚠️ Desktop browsers - can install but less useful

## 🔐 Security Notes

- PWA requires HTTPS in production
- Service workers have access to network requests
- Always validate and sanitize user input
- Keep service worker updated for security patches

## 🎨 Design Considerations

The PWA implementation maintains:
- ✅ Full mobile responsiveness
- ✅ Existing swipe gestures
- ✅ Touch-optimized interface
- ✅ Theme switching (light/dark)
- ✅ All original functionality

## 📚 Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## 🤝 Contributing

To improve the PWA implementation:
1. Test on various devices and browsers
2. Report issues with browser/OS details
3. Suggest caching strategy improvements
4. Optimize performance

## 📄 License

Same as the original SLEd project (see parent LICENSE file).

## ✅ Checklist for Deployment

- [ ] Icons created and placed in Mobile/ directory
- [ ] manifest.json theme colors customized (optional)
- [ ] Files uploaded to HTTPS server
- [ ] Service worker registration tested
- [ ] Install to home screen tested on Android
- [ ] Install to home screen tested on iOS
- [ ] Offline functionality verified
- [ ] Update mechanism tested

## 🎉 Success!

Once everything is set up, users can:
1. Visit your mobile site
2. Install it as an app with one tap
3. Use it offline anywhere, anytime
4. Enjoy a native app-like experience

---

**Note**: This is a fork that adds PWA functionality. For the original SLEd documentation, see the main README files in the parent directories.

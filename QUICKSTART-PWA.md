# 🚀 Quick Start Guide - SLEd PWA

Get SLEd running as a Progressive Web App in 3 easy steps!

## Step 1: Add Icons (1 minute)

1. Create two PNG icons and place them in the `Mobile/` directory:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
2. You can resize `Sledlogo.png` (root) or use your own.
3. For tips, see `Mobile/PWA-SETUP.md`.

## Step 2: Serve the App (30 seconds)

You need a local web server. Choose one:

### Python (if installed)
```bash
cd Mobile
python -m http.server 8000
```

### Node.js (if installed)
```bash
cd Mobile
npx http-server -p 8000
```

### VS Code (easiest)
1. Install "Live Server" extension
2. Right-click `Mobile/index.html`
3. Select "Open with Live Server"

## Step 3: Install on Your Phone (1 minute)

### On Android:
1. Open Chrome/Edge and navigate to your local server
2. Tap the menu (⋮) → "Install app" or "Add to Home Screen"
3. Tap "Install"
4. Done! Find the SLEd icon on your home screen

### On iPhone:
1. Open Safari and navigate to your local server
2. Tap the Share button (📤)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"
5. Done! Find the SLEd icon on your home screen

## ✅ You're All Set!

The app now:
- ✅ Launches like a native app (no browser UI)
- ✅ Works offline after first load
- ✅ Automatically updates when changes are made
- ✅ Feels fast and responsive

## 🧪 Test Offline Mode

1. Open the installed app
2. Load a lorebook (if you haven't already)
3. Turn on Airplane Mode
4. Close and reopen the app
5. It should still work! 🎉

## 📱 Access From Other Devices

To access from other devices on your network:

1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`

2. On your phone, navigate to:
   ```
   http://YOUR-IP-ADDRESS:8000
   ```
   Example: `http://192.168.1.100:8000`

## 🌐 Deploy to Production

For real-world use:

1. Upload all files to a web hosting service
2. **Must use HTTPS** (most hosts provide this free)
3. Share the URL with users
4. They can install directly from the website!

### Recommended Hosting (Free):
- GitHub Pages (enable in repo settings)
- Netlify (drag & drop deploy)
- Vercel (git-based deployment)
- Cloudflare Pages

## 🔧 Need Help?

- **Icons not showing?** - Make sure they're named exactly `icon-192.png` and `icon-512.png`
- **Can't install?** - Use HTTPS or localhost, not file:// protocol
- **Not working offline?** - Check browser console for service worker errors

## 📚 More Info

- Full documentation: `Mobile/README-PWA.md`
- Setup details: `Mobile/PWA-SETUP.md`
- Fork overview: `README-PWA-FORK.md`

---

**That's it!** You now have a fully functional Progressive Web App version of SLEd! 🎉

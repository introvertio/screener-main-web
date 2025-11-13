# WebOS Build Guide for Sil Screener

This guide explains how to build and deploy your Next.js Sil Screener app for WebOS (LG Smart TVs).

## 🚀 Quick Start

### 1. Install WebOS SDK

First, install the WebOS SDK and CLI tools:

```bash
# Option 1: Use our installation helper script
npm run webos:install-sdk

# Option 2: Manual installation
# Download from: https://webostv.developer.lge.com/sdk/download/
```

### 2. Build for WebOS

```bash
# Build and package your app for WebOS
npm run build:webos
```

This will:

- Build your Next.js app as static files
- Copy WebOS manifest and icons
- Package everything into a `.ipk` file using `ares-package`

### 3. Deploy to WebOS Device

```bash
# Set up your WebOS device (only needed once)
npm run webos:setup

# Install the app on your WebOS device
npm run webos:install

# Launch the app
npm run webos:launch
```

## 📱 Available WebOS Scripts

| Script                      | Description                         |
| --------------------------- | ----------------------------------- |
| `npm run build:webos`       | Build and package the app for WebOS |
| `npm run webos:install-sdk` | Install WebOS SDK and CLI tools     |
| `npm run webos:package`     | Package the built app (manual step) |
| `npm run webos:setup`       | Set up WebOS device connection      |
| `npm run webos:device-list` | List connected WebOS devices        |
| `npm run webos:install`     | Install app on WebOS device         |
| `npm run webos:launch`      | Launch the app on WebOS device      |
| `npm run webos:uninstall`   | Remove app from WebOS device        |
| `npm run webos:debug`       | Open WebOS app debugger             |

## 🔧 Configuration

### WebOS App Manifest (`public/appinfo.json`)

The app configuration is defined in `public/appinfo.json`:

```json
{
  "id": "com.silwork.screener",
  "version": "0.0.1",
  "vendor": "SilWork",
  "type": "web",
  "main": "index.html",
  "title": "Sil Screener",
  "icon": "icon.png",
  "largeIcon": "largeIcon.png"
}
```

### Next.js Configuration

The Next.js configuration in `next.config.ts` is set up for static export:

- `output: 'export'` - Enables static export
- `trailingSlash: true` - Adds trailing slashes for better WebOS compatibility
- `images: { unoptimized: true }` - Disables image optimization for static export

### WebOS-Specific Styles

WebOS-specific styles are in `app/webos.css`:

- Remote control navigation support
- TV screen scaling
- Focus indicators
- Safe area handling

## 🎮 Remote Control Navigation

Your app supports WebOS remote control navigation through:

1. **Focus Management**: Elements with `.webos-focusable` class are navigable
2. **Spatial Navigation**: Automatic focus movement between elements
3. **Visual Feedback**: Focus outlines and scaling effects

### Example Usage

```tsx
// Make buttons focusable with remote control
<button className="webos-focusable">
  Click me with remote
</button>

// Container for spatial navigation
<div className="webos-container">
  <button className="webos-focusable">Button 1</button>
  <button className="webos-focusable">Button 2</button>
</div>
```

## 🔍 Debugging

### WebOS App Debugger

```bash
# Open debugger for your app
npm run webos:debug
```

This opens a Chrome DevTools-like interface for debugging your WebOS app.

### Common Issues

1. **Build fails**: Ensure all images are unoptimized and paths are correct
2. **App won't install**: Check that `appinfo.json` is valid and app ID is unique
3. **Remote navigation not working**: Ensure elements have proper focus styles and classes

## 📦 Build Output

After running `npm run build:webos`, you'll find:

- `out/` - Static export of your Next.js app
- `webos-builds/` - Packaged `.ipk` files ready for installation
- Build logs showing package size and installation instructions

## 🔄 Development Workflow

1. **Development**: Use `npm run dev` for normal Next.js development
2. **WebOS Testing**: Use `npm run build:webos` to test WebOS-specific features
3. **Deploy**: Install on actual WebOS device using `npm run webos:install`
4. **Debug**: Use `npm run webos:debug` for remote debugging

## 📋 Requirements

- Node.js 18+
- WebOS SDK installed
- WebOS device (LG Smart TV) or emulator
- Network connection between development machine and WebOS device

## 🆘 Troubleshooting

### SDK Installation Issues

If the automatic SDK installation fails:

1. Download manually from [LG Developer Site](https://webostv.developer.lge.com/sdk/download/)
2. Install the package for your OS
3. Add CLI tools to your PATH:

   ```bash
   # macOS/Linux
   export PATH=$PATH:/path/to/webOS_TV_SDK/CLI/bin

   # Add to ~/.zshrc or ~/.bashrc for persistence
   echo 'export PATH=$PATH:/path/to/webOS_TV_SDK/CLI/bin' >> ~/.zshrc
   ```

### Device Connection Issues

1. Ensure your WebOS device and development machine are on the same network
2. Enable Developer Mode on your WebOS device
3. Use `npm run webos:setup` to configure the connection

### App Not Loading

1. Check that `appinfo.json` is valid JSON
2. Ensure all required icons are present
3. Verify the app builds successfully with `npm run build`

For more help, visit the [WebOS Developer Documentation](https://webostv.developer.lge.com/develop/getting-started/).







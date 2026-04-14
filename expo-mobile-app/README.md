# Sai Green House Paper - Expo Mobile App

This is a React Native mobile application built with Expo for the Sai Green House Paper admin dashboard with QR code scanner functionality.

## Features

✅ **QR Code Scanner** - Scan customer QR codes to auto-fill customer details
✅ **Sales Management** - Add and track sales entries
✅ **Real-time Calculations** - Automatic total calculation based on quantity
✅ **Data Persistence** - All sales data stored locally on device
✅ **Mobile Responsive** - Works on iOS and Android
✅ **Secure Login** - Admin authentication required

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

## Installation

1. Navigate to the expo-mobile-app directory:
```bash
cd expo-mobile-app
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Option 1: Expo Go (Easiest for Development)

1. Install Expo Go app on your phone:
   - iOS: App Store
   - Android: Google Play Store

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go or your phone's camera

### Option 2: Android Emulator
```bash
npm run android
```

### Option 3: iOS Simulator
```bash
npm run ios
```

### Option 4: Web Browser
```bash
npm run web
```

## QR Code Scanner

To generate customer QR codes with the web app:

1. Go to the web dashboard: https://dhairyashilpatil8416.github.io/sai-green-house-admin-portal/
2. Create/export customers with QR codes
3. Print or display the QR codes

The mobile app will scan these codes and auto-fill:
- Customer Name
- Village
- Phone Number

## Login Credentials

- **Username:** Saigreenhouse
- **Password:** Saigreenhouse@2021

## Data Storage

All sales data is stored locally on your device using AsyncStorage. 

To backup data, use the web app's export feature to sync with Google Sheets.

## Building for Production

### Android Build
```bash
npm run build-android
```

### iOS Build
```bash
npm run build-ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
npm run eas-build
```

## File Structure

```
expo-mobile-app/
├── app/
│   ├── index.tsx              # Root navigation
│   ├── login.tsx              # Login screen
│   ├── dashboard.tsx          # Main dashboard with scanner
│   └── _layout.tsx            # Navigation layout
├── utils/
│   └── qrCodeUtils.ts         # QR code parsing utilities
├── package.json               # Dependencies
├── app.json                   # Expo configuration
└── README.md                  # This file
```

## Permissions Required

The app requires the following permissions:

- **Camera:** For QR code scanning (uses device camera)
- **Internet:** For syncing with Google Sheets (optional)
- **Storage:** For saving locally (automatic with AsyncStorage)

## Troubleshooting

### Camera not working
- Grant camera permission when prompted
- On Android: Go to Settings → Apps → Camera → Permissions
- On iOS: Go to Settings → Sai Green House → Camera

### QR code not scanning
- Ensure good lighting
- Hold phone steady for 1-2 seconds
- Make sure QR code is not too small (minimum 2x2 cm recommended)

### App crashes on startup
- Clear cache: `npm start -- --clear`
- Reinstall packages: `rm -rf node_modules && npm install`
- Restart Expo Go app

## Development Tips

- Hot reload enabled: Edit code and changes appear instantly
- Use console for debugging: `npm start` shows console output
- Check Device Logs: Press `i` (iOS) or `a` (Android) during `npm start`

## Future Enhancements

- [ ] Sync sales data to cloud
- [ ] Generate QR codes in app
- [ ] Receipt printing via Bluetooth printer
- [ ] Offline mode with auto-sync
- [ ] Multiple admin users
- [ ] Advanced analytics and reports
- [ ] Barcode scanning (in addition to QR)

## Support

For issues or questions, contact the development team.

## License

This project is proprietary to Sai Green House Paper.

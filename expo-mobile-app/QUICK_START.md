# Expo Mobile App - Quick Start Guide

## Setup (First Time Only)

1. **Install Node.js** if not already installed
   - Download from: https://nodejs.org/
   - Choose LTS version

2. **Open Terminal/PowerShell** and navigate to the mobile app folder:
```bash
cd "c:\Users\DhairyashilPatil\Documents\shope website\expo-mobile-app"
```

3. **Install dependencies:**
```bash
npm install
```

This will take 2-5 minutes. Be patient!

---

## Running the App (After Each Modification)

### Method 1: Expo Go (Recommended for Testing)

1. **On your computer**, start the development server:
```bash
npm start
```

2. **On your phone**, download **Expo Go** app:
   - iOS: Search "Expo Go" in App Store
   - Android: Search "Expo Go" in Google Play Store

3. **Scan the QR code** that appears in your terminal with your phone's camera or Expo Go app

4. Your app should open on your phone!

### Method 2: Android Emulator
```bash
npm run android
```
(Requires Android SDK installed)

### Method 3: Web Browser (Limited Features)
```bash
npm run web
```

---

## Features Available Now

✅ **Login** - Username: `Saigreenhouse`, Password: `Saigreenhouse@2021`
✅ **QR Code Scanner** - Scan customer QR codes
✅ **Manual Entry** - Type customer details manually
✅ **Sales Tracking** - Add and save sales
✅ **Auto Calculation** - Quantity × 230 = Total
✅ **Local Storage** - All data saved on phone

---

## Important Notes

### Camera Permission
- First time you open scanner, it asks for camera permission
- **Allow** camera access when prompted
- If denied, go to phone settings → App permissions

### QR Code Format
The scanner expects QR codes containing:
```json
{
  "type": "customer",
  "name": "Customer Name",
  "village": "Village Name",
  "phone": "Phone Number"
}
```

### Data Storage
All sales data stays on your phone. To backup/sync with web:
1. Export from mobile app (to be added)
2. Or manually enter in web version

---

## Project Structure

```
expo-mobile-app/
├── app/                 # All screens
│   ├── index.tsx       # Startup screen
│   ├── login.tsx       # Login page
│   └── dashboard.tsx   # Main app with scanner
├── utils/              # Helper functions
│   └── qrCodeUtils.ts  # QR code logic
└── package.json        # Dependencies list
```

---

## Common Issues & Solutions

### Issue: "npm command not found"
**Solution:** Node.js not installed or added to PATH
- Reinstall Node.js
- Restart Terminal after installation

### Issue: "Cannot find module"
**Solution:** Dependencies not installed
```bash
npm install
```

### Issue: "Camera not working"
**Solution:** Permission denied
- Check phone Settings → App Permissions
- Find Sai Green House app → Camera → Allow

### Issue: "QR code not scanning"
**Solution:**
- Ensure good lighting
- Make QR code bigger (not too close)
- Keep phone still for 2-3 seconds
- Test on different QR code

### Issue: "App keeps crashing"
**Solution:**
```bash
npm start -- --clear
```

---

## Next Steps

1. **Install Expo Go** on your phone
2. **Run `npm start`** on your computer
3. **Scan QR code** with your phone
4. **Test features** on your device
5. **Share feedback** on what to add next

---

## Build for App Stores (Later)

When ready to release to Apple App Store or Google Play:

```bash
# One-time setup
npm install -g eas-cli
eas login

# Building
npm run eas-build
```

---

## Support

If something doesn't work:
1. Check the error message
2. Google the error
3. Try the solutions above
4. Ask for help with the error message

Happy testing! 📱

# Sai Green House Paper Dashboard

A lightweight browser-based sales dashboard for Sai Green House Paper.

## Project Structure

- `index.html` - Main app entry pagemaka
- `styles.css` - UI styles
- `script.js` - App logic (sales, reports, sync)
- `sw.js` - Service worker
- `manifest.webmanifest` - PWA manifest
- `assets/images/` - All image assets used by UI
- `assets/icons/` - App icons
- `integrations/google-apps-script.gs` - Google Apps Script webhook code
- `docs/sales_sheet_template.csv` - Optional sheet template
- `tools/` - Utility scripts used during setup
- `sai-green-house/` - Redirect entry for alternate path

## Run Locally

Open `index.html` directly in browser, or serve the folder with any static server.

## Deploy Online With GitHub Pages

1. Push the repository to GitHub.
2. In GitHub repo settings, open `Pages`.
3. Set source to `Deploy from a branch`.
4. Choose branch `gh-pages` and folder `/ (root)`.
5. Push to `main` again or run the `Deploy to gh-pages` workflow manually.

The workflow in `.github/workflows/deploy.yml` publishes the static site to `gh-pages`.

## Google Sheet Sync

1. Open `integrations/google-apps-script.gs`
2. Deploy as Web App in Google Apps Script
3. Paste deployment URL in app Data Control section

## Notes

- `sw.js` is kept at root to preserve service worker scope.
- Image paths are centralized under `assets/images/`.

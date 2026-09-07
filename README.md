# PC Toolkit

**PC Toolkit** is a bilingual (English / Russian), privacy-first collection of PC tests and calculators that runs entirely in the browser.

## Live architecture

- Static HTML / CSS / JavaScript
- No backend
- No build step
- GitHub Pages deployment from `main`
- Language preference is stored locally in the browser

## Included tools

### Monitor
- Refresh rate test
- Dead pixel fullscreen test
- Ghosting / motion response test
- Gradient & banding test

### Input
- Keyboard tester
- Mouse button / double-click tester
- Browser pointer-event polling estimate
- Gamepad tester via Gamepad API

### Audio
- Left / center / right speaker test
- Local microphone level meter

### Hardware & utilities
- Quick browser/system snapshot
- RAM first-word latency calculator
- PPI / pixel pitch calculator
- PSU headroom calculator
- Download time calculator

## Privacy

All calculations and tests run locally. PC Toolkit has no analytics backend and does not upload microphone audio or hardware data.

## GitHub Pages

Deployment mirrors the setup used by the portfolio project:

- `.github/workflows/pages.yml` runs on pushes to `main`
- `actions/configure-pages` prepares Pages
- `actions/upload-pages-artifact` uploads the repository root
- `actions/deploy-pages` publishes the site
- `.nojekyll` keeps the static files untouched by Jekyll

Live URL:

`https://deenfoool.github.io/PC-Toolkit/`

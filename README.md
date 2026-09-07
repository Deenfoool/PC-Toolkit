# PC Toolkit

**PC Toolkit** is a bilingual (English / Russian), privacy-first collection of PC tests and calculators that runs in the browser.

## Live architecture

- Static HTML / CSS / JavaScript
- No backend
- No build step
- GitHub Pages from `main` / repository root
- `.nojekyll` for direct static publishing
- No GitHub Actions dependency
- English / Russian interface with locally stored language preference
- Lucide Icons for the interface

## Included tools

### Monitor
- Refresh rate test
- FPS stability / frame pacing test
- Dead pixel fullscreen test
- Ghosting / motion response test
- Gradient & banding test
- Contrast & shadow-detail test
- Color test

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
- Copyable PC / browser report
- RAM first-word latency calculator
- PPI / pixel pitch calculator
- PSU headroom calculator
- Download time calculator

## Privacy

Tests and calculations are performed in the browser. PC Toolkit has no analytics backend and does not upload microphone audio or detected hardware information.

Lucide Icons are loaded as the UI icon set from the Lucide web package.

## GitHub Pages

This repository intentionally does **not** depend on GitHub Actions for deployment.

Publish the repository root from the `main` branch with GitHub Pages (`main` → `/(root)`). The `.nojekyll` file keeps static assets untouched by Jekyll.

Live URL:

`https://deenfoool.github.io/PC-Toolkit/`

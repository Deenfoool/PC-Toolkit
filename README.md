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

PC Toolkit currently includes **25 tools** plus the quick system snapshot.

### Monitor
- Refresh rate test with cancelable frame sampling
- FPS stability / frame pacing test
- Dead pixel fullscreen test
- Motion / ghosting lab with adjustable speed, background and target style
- Gradient & banding test
- Contrast & shadow-detail test
- Color test
- Sharpness & geometry fullscreen patterns

### Input
- Visual full-keyboard tester with persistent tested-key highlighting and working Escape close behavior
- Advanced mouse tester with button counters, wheel events, double-clicks, movement distance and coordinates
- Browser pointer-event polling estimate using Pointer Event timestamps / coalesced-event timestamps
- Gamepad tester via Gamepad API

### Audio
- Left / center / right speaker test
- Local microphone level meter

### Files
- Local SHA-256 file checksum calculator via Web Crypto
- Exact duplicate-file finder using size prefiltering plus SHA-256 for candidates

### Windows
- Guided Windows reinstall / post-install checklist with locally saved progress
- Official Windows activation status and settings commands
- Local-account password command helper
- Pinned zapret Discord / YouTube link plus GitHub Releases
- Winget app-install command builder
- Official Windows 11 download link

### Hardware & utilities
- Guided Full PC Check: environment → display timing → input events → copyable summary
- Quick browser/system snapshot with CSS-pixel and DPR caveat
- Copyable PC / browser report
- RAM first-word latency calculator
- PPI / pixel pitch calculator
- PSU headroom calculator
- Download time calculator
- FPS ↔ frame-time converter
- Decimal GB/TB ↔ binary GiB/TiB storage converter

## Privacy

Tests, calculations and file hashing are performed in the browser. PC Toolkit has no analytics backend and does not upload microphone audio, selected files or detected hardware information.

Browser-based diagnostics are intentionally labeled with their limitations: the site cannot replace SMART checks, hardware temperature sensors, MemTest, raw USB analyzers or dedicated response-time measurement equipment.

Lucide Icons are loaded as the UI icon set from the Lucide web package.

## GitHub Pages

This repository intentionally does **not** depend on GitHub Actions for deployment.

Publish the repository root from the `main` branch with GitHub Pages (`main` → `/(root)`). The `.nojekyll` file keeps static assets untouched by Jekyll.

Live URL:

`https://deenfoool.github.io/PC-Toolkit/`

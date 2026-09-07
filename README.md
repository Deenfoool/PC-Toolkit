# PC Toolkit

A privacy-friendly, browser-based toolkit for everyday PC users.

**Test. Diagnose. Calculate.** No account, no install, no backend required.

## Included tools

- Quick browser/system snapshot
- Refresh rate measurement
- Dead pixel fullscreen test
- Keyboard tester
- Mouse tester
- Left / center / right speaker test
- Microphone level test
- RAM first-word latency calculator
- PPI / pixel pitch calculator
- PSU headroom calculator
- Download time calculator

## Why this project

PC Toolkit is intentionally static: most diagnostics and calculators run locally in the browser, which keeps hosting simple and avoids collecting user data.

## Run locally

Open `index.html` directly, or serve the directory with any static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

> Microphone access requires a secure context on deployed sites (`https://`) or localhost.

## Deploy

The repository is compatible with GitHub Pages. Publish the repository root from the `main` branch.

# PROJECT BRIEF: Perko - app promo for businesses (real app screenshots)
Date researched: 2026-10-27 · Motion DNA: STYLE_GUIDE incl. §15 (3 entries, 2026-10-25)

## 1. Subject and objective
- Subject: the Perko customer app as it stands today (Perko-app `main` @ dd5f280, 2026-10-27), a shared loyalty wallet for neighbourhood businesses, in early access with a pilot on Emek Refaim and Derech Beit Lehem, Jerusalem. [V] app onboarding copy, Perko-app README
- Objective: show business owners the real product and invite them to join the early access for free. Same audience as the first promo (`../video`).
- Format: 16:9, 1920×1080, 30 fps, 22.0 s, Hebrew (RTL), no English on screen except the logo. Original score, 120 BPM. No voiceover yet (script in README).

## 2. Verified identity (reused from `../video/PROJECT_BRIEF.md`, re-checked)
- Site live at www.getperko.com, title "Perko - כל ההטבות שלך במקום אחד" (checked 2026-10-27). [V]
- Business line: "הלקוחות חוזרים. העסק נשאר בתודעה." [V] `src/components/sections/Business.astro`
- Honesty: early access, free to join now, no claims of participating businesses or numbers. All five businesses in the app's demo mode are sample data labelled "לדוגמה" in the app. [V] Perko-app README

## 3. Palette and type (unchanged)
- Acid lime `#D7FF35` (dominant), ink `#11130F`, off-white `#F8F8F4`, secondary lime `#BCE82D`, muted `#303626`. [V] user brand sheet
- Impact Heebo 800/900 [V] · accent Noto Sans Hebrew wght 700 wdth 84.4 [user choice] · HUD mono JetBrains Mono for digits, Hebrew in Heebo 500 · product-shot labels Heebo 500.

## 4. Assets: real app screenshots
- Captured from the app's own web build in demo mode (no backend, sample data), 412×892 CSS px at 3x, light appearance: `public/shots/`, via `scripts/capture-shots.cjs` and `scripts/capture-redeem.cjs` (the two redeem codes are 31 s apart, so the code change in the film is real).
- Screens used: wallet (stack of physical cards), a focused card before and after a swipe, discover list, the scan result sheet ("הכרטיס מלא"), redeem with the rotating code.
- Deviation: the demo-mode banner is hidden in the captures for a clean frame; instead every product scene carries a "נתוני דוגמה" / "עסקים לדוגמה" label and the end card says the screens use sample data. The app's own "לדוגמה" tags stay visible.
- Not shown: the map (not available in the web build) and the camera view (no camera in capture).

## 5. Merge plan
- CORE kept: one scene per bar, expo snaps with motion blur, a contained-shape transition per cut, mirrored HUD on showcase scenes, three type roles, the dot motif (spark, title period, tap dot, checked stamp, phone collapsing to a dot, the lime period, the wordmark's "o"), field rotation, one signal per scene.
- Project: palette, fonts, logo (rendered as on the site), real app UI, copy.
- User overrides: 120 BPM pace (the user found 150 too fast), Noto Sans Hebrew accent instead of a serif, Hebrew-only text.

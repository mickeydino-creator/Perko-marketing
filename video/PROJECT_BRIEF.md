# PROJECT BRIEF: Perko - promo for businesses
Date researched: 2026-10-24 · Motion DNA version: STYLE_GUIDE §15 (no entries yet)

## 1. Subject and objective
- Subject: Perko, a shared digital loyalty platform for local businesses in Israel, in early validation / early access.
- Objective: get business owners (cafés, restaurants, local shops) to register interest and join for free during early access. Runs on the landing page and social.
- Format: 16:9, 1920×1080, ~15 s, 30 fps, Hebrew (RTL), user-supplied music track (BPM to be measured), Remotion + React.

## 2. Verified identity
- Online search found no external Perko identity, site or press (search 2026-10-24: only unrelated products such as Perka, Perkfull, PerQ). The identity of record is the one published in this repository's landing page. [V] `src/` of mickeydino-creator/Perko-marketing
- Positioning: "כל ההטבות שלך. מקום אחד." / for businesses: "הלקוחות חוזרים. העסק נשאר בתודעה." [V] `src/components/sections/Hero.astro`, `Business.astro`
- Stage and honesty constraints: early access, free to join now, no payment commitment, no claims of customers, partners, numbers or live features. [V] brief + `Join.astro`, `Faq.astro`
- Audience: owners of neighbourhood cafés, restaurants, bakeries and shops. [V] brief

## 3. Palette
- Cobalt `#435BFF` (primary, signal) [V] `src/styles/global.css --cobalt`
- Ink `#111522`, paper `#F8F9FC`, pale blue `#E9EDFF`, white `#FFFFFF`, slate `#586079` [V] same file
- Mapping: field.dark = ink #111522 · field.brand = cobalt #435BFF · field.light = paper #F8F9FC · field.cool = pale #E9EDFF · signal = cobalt #435BFF · ink = #111522 · white = #FFFFFF (fields never pure: paper/pale already tinted; white only on elements)
- Contrast: cobalt on ink 3.9:1, on paper 4.9:1, on pale 4.3:1 (all ≥ 3:1). On the cobalt field the signal object is rendered white [S adaptation, see §6].

## 4. Logo, typography, assets
- Logo: the Perko wordmark, lowercase "perk" in Heebo 800 + a solid cobalt disc as the "o" (the collected stamp). App icon: cobalt rounded square, white "p" whose bowl is a solid disc. [V] `src/components/Wordmark.astro`, `public/favicon.svg`. Rendered from the same component logic, not redrawn.
- Fonts: impact = Heebo Black/800 [V] (site font) · accent = Frank Ruhl Libre [S] (STYLE_GUIDE §4.6; the site has no serif) · mono = JetBrains Mono for Latin HUD labels [S] · ui = Heebo [V]. All OFL / Google Fonts.
- Product UI: the illustrative app screens of the site (home with stamp card, discover, QR collect, redeem) [V] `src/components/screens/`, `src/styles/app.css`. Labelled as illustration, as on the site.
- Brand graphic elements: the filled stamp dot, 5-column stamp grids, rounded cards (28px radius), the neighbourhood street map with cobalt route [V] `Network.astro`.

## 5. Visual direction
Bright, editorial, confident. The stamp dot is the whole film's thread: it is the spark at the boot, the period of the title, every collected stamp, the pins on the map, and finally the "o" that completes the wordmark. Fields rotate ink → cobalt → paper → pale. Copy stays honest: sample business names, "גישה מוקדמת", "הצטרפות חינם".

## 6. Merge plan: Motion DNA × identity
- Kept (CORE): bar-locked scenes, expo snaps with motion blur, contained-shape transitions, mirrored HUD (RTL), three type roles, the dot motif (= Perko's stamp disc), field rotation, single signal.
- Taken from identity: palette, Heebo, wordmark, app UI, copy.
- Adaptations: (1) Hebrew has no uppercase → impact uses Heebo Black at large scale. (2) Signal on the cobalt field → white disc instead of cobalt (signal-on-signal forbidden). (3) The site's no-serif / no-mono rules do not apply to this video medium; the accent and mono voices are added here only.

## 7. Open items
- Music track and BPM: waiting for the user's file.

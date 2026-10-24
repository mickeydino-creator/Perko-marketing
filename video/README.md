# Perko - business promo video (Motion DNA)

16:9, 1920×1080, 30 fps, 19.2 s (8 bars at 100 BPM). Hebrew, RTL. Remotion 4 + React.

```sh
npm install
npm run studio   # preview
npm run render   # out/perko-promo.mp4
```

Brand values, sources and the merge plan are in `PROJECT_BRIEF.md`. All timings and colours live in `src/tokens.ts`.

## Audio

- Music: the supplied "Upbeat Corporate Technology" track, excerpt 0:34.85-0:54.05, so its drop (0:39.65) lands on f144 (4.8 s).
  Measured tempo 100 BPM (beat = 18 f, bar = 72 f). Fade-out over the last 1.2 s. `public/music.wav`.
- Voiceover: the supplied ElevenLabs take (`assets/audio/voiceover-source.mp3`), cut at its natural pauses and each line
  placed on a downbeat. `public/vo.wav`.

- "כל עסק עם כרטיס אחר." - 0.60 s (f18)
- "Perko מכניסה את כולם למקום אחד." - 2.40 s (f72)
- "הלקוחות יסרקו קוד בקופה ויצברו חותמות." - 4.80 s (f144, on the drop)
- "יראו כמה חסר, ויחזרו לממש את ההטבה." - 8.40 s (f252)
- "וכל עסק שמצטרף מגדיל את הרשת השכונתית." - 11.40 s (f342)
- "Perko. הצטרפו בחינם לגישה המוקדמת." - 15.00 s (f450)

## Beat sheet

1. Boot, f0-72, ink. Cobalt spark falls and lands as the period of "כרטיס אחר"; four loyalty cards from four businesses snap in, one per 6 f.
   Exit: collapse to a glowing shape (cards sucked into the dot, the dot opens to the cobalt field).
2. Title, f72-144, cobalt. The Perko wordmark (white), whip on beat 3 to "מקום אחד." + accent "את כל הכרטיסים.".
   Exit: punctuation to mask (the white period grows into the paper field), landing on the drop.
3. Collect, f144-252, paper, HUD 01. The illustrative scan screen; "סורקים." then "צוברים."; the 9th stamp lands on f198 (the signal).
   Exit: radial burst from that stamp into the cobalt field.
4. Redeem, f252-342, cobalt, HUD 02. The card at 9/10, "כמה חסר?"; on f288 the last stamp and "חוזרים.", reward ready.
   Exit: diagonal slab wipe toward the reading end.
5. Network, f342-450, pale, HUD 03. The neighbourhood map: café to bakery, then the network grows pin by pin (vision, labelled illustrative).
   Exit: portal rings from the last pin into ink.
6. End, f450-576, ink. The dot writes the wordmark and becomes its "o"; accent "הצטרפו בחינם לגישה המוקדמת.", hairline, mono tagline. Final hold.

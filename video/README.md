# Perko - business promo video (Motion DNA)

16:9, 1920×1080, 30 fps, 25.5 s. 120 BPM: beat = 0.5 s, bar = 2.0 s, one scene per bar. Scenes are written in story
frames (12 per beat, 48 per bar) and stretched by `SLOW = 1.25` in `src/tokens.ts` (the film was 150 BPM / 20.4 s before).
Hebrew, RTL. Remotion 4 + React. Palette: acid lime #D7FF35 (dominant), ink #11130F, off-white #F8F8F4, secondary lime #BCE82D, muted #303626 - the same tokens as the website. Brand values, sources and the merge plan are in `PROJECT_BRIEF.md`;
timings and colours live in `src/tokens.ts`.

```sh
npm install
python3 music/compose.py   # regenerates public/music.wav (needs numpy + scipy)
python3 music/retime_vo.py # re-places the voiceover lines on the slowed grid -> public/vo.wav
npm run studio             # preview
npm run render             # out/perko-promo.mp4
```

## Audio

- **Music:** an original score, synthesised from scratch in `music/compose.py` (numpy/scipy; no samples, no loops,
  seeded so every build is identical). 150 BPM in F major: soft pad and bell in the intro, a light shaker and rim
  groove under the problem and title, a riser and a 150 ms dip, then the drop on f144 (4.8 s) with a soft kick,
  snaps, gentle hats (low-passed, no fizz above ~10 kHz), a round bass, e-piano stabs and a sparse mallet motif.
  The groove stops on f480 (16.0 s) for the end card; a bell marks the wordmark at 16.4 s.
- **Voiceover:** the supplied ElevenLabs take (`assets/audio/voiceover-source.mp3`), cut at its own pauses and placed
  so each line starts on a beat: 2.00 s, 4.50 s, 8.00 s, 12.00 s, 16.00 s, 20.46 s (`public/vo.wav`). The voice is not
  stretched; `music/retime_vo.py` only moves the lines from the 150 BPM placement (`assets/audio/vo-placed-150bpm.wav`).
- **Mix:** music 0.30, voice 1.8. Measured on the render: -18.5 LUFS integrated, -3.2 dBFS peak, voice ~7 dB above the bed.

## Beat sheet (one bar each)

1. f0-48 Boot, ink. Spark → dot, terminal line typed and rewritten, cobalt line → band → flash.
2. f48-96 Kinetic type (VO 1), one word per beat: "כל עסק," paper whip · "כרטיס" ink, hot fill + outline repeat rows ·
   "אחר." pale, glitch slices in a viewfinder · "ועוד אחד." accent + drawn underline. Exit: slab wipe.
3. f96-144 Title, cobalt (VO 2). Mono overline, "perk" letter reveal, the disc as the period, accent
   "כל ההטבות, במקום אחד". Exit: the disc grows into a soft ink mask on the drop.
4. f144-192 Wallet, ink. Iris open; four sample cards, rows stagger in. Exit: column dissolve.
5. f192-240 Scan, pale (VO 3). Centred phone, scan line, brackets lock. Exit: the QR plate becomes the next field.
6. f240-288 Stamps, paper. Counter 8 → 9/10, the ninth stamp lands on beat 2. Exit: radial burst.
7. f288-336 Progress, cobalt (VO 4). Card on a parallax stack, the tenth stamp, reward ready. Exit: collapse + bloom.
8. f336-384 Kinetic type, paper. "חוזרים." whip, then "ומממשים." accent + underline. Exit: slab wipe.
9. f384-432 Map, pale (VO 5). Neighbourhood map, pins join one per half beat (labelled as vision). Exit: the last pin opens.
10. f432-480 Orbit, cobalt. One dot splits into six businesses inside a ring, merges back. Exit: portal rings.
11. f480-612 End, ink (VO 6). The dot writes the wordmark, accent, hairline, tagline decode, credit line, hold.

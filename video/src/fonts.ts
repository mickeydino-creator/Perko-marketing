import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// impact + ui = Heebo [V] (site font).
// accent = Noto Serif Hebrew, light and condensed (wght 300, wdth 68) [S]: the closest Hebrew match to the reference's
//          light, narrow, high-contrast serif italic. Latin glyphs in the accent fall back to Instrument Serif Italic [S].
// mono = JetBrains Mono [S].
// All bundled locally from @fontsource (OFL) so renders never depend on the network.
export const impact = 'Heebo';
export const accent = 'Perko Accent';
export const mono = 'JetBrains Mono';
export const accentSettings = { fontWeight: 300, fontVariationSettings: "'wght' 300, 'wdth' 68" } as const;

const HE = 'U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F';
const faces: [string, string, string, string?, string?][] = [
  ...(['500', '700', '800', '900'] as const).flatMap((w) => [
    [impact, w, `heebo-hebrew-${w}-normal.woff2`, HE] as [string, string, string, string],
    [impact, w, `heebo-latin-${w}-normal.woff2`] as [string, string, string],
  ]),
  [accent, '100 900', 'noto-serif-hebrew-hebrew-standard-normal.woff2', HE],
  [accent, '100 900', 'instrument-serif-latin-400-italic.woff2', 'U+0000-00FF, U+2013-2014, U+2018-201D'],
  [mono, '500', 'jetbrains-mono-latin-500-normal.woff2'],
];
faces.forEach(([family, weight, file, unicodeRange]) => {
  loadFont({ family, weight, url: staticFile(`fonts/${file}`), format: 'woff2', ...(unicodeRange ? { unicodeRange } : {}) });
});

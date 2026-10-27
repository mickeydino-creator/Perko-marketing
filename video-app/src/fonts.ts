import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// impact + ui = Heebo [V] (site font).
// accent = Noto Sans Hebrew, bold and slightly condensed (wght 700, wdth 84.4) [user choice].
// mono = JetBrains Mono for digits [S]; Hebrew labels fall back to Heebo 500 inside the same family.
// All bundled locally from @fontsource (OFL) so renders never depend on the network.
export const impact = 'Heebo';
export const accent = 'Perko Accent';
export const mono = 'JetBrains Mono';
export const accentSettings = { fontWeight: 700, fontVariationSettings: "'wght' 700, 'wdth' 84.4" } as const;

const HE = 'U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F';
const faces: [string, string, string, string?, string?][] = [
  ...(['500', '700', '800', '900'] as const).flatMap((w) => [
    [impact, w, `heebo-hebrew-${w}-normal.woff2`, HE] as [string, string, string, string],
    [impact, w, `heebo-latin-${w}-normal.woff2`] as [string, string, string],
  ]),
  [accent, '100 900', 'noto-sans-hebrew-hebrew-standard-normal.woff2', HE],
  [mono, '500', 'jetbrains-mono-latin-500-normal.woff2'],
  [mono, '500', 'heebo-hebrew-500-normal.woff2', HE],
];
faces.forEach(([family, weight, file, unicodeRange]) => {
  loadFont({ family, weight, url: staticFile(`fonts/${file}`), format: 'woff2', ...(unicodeRange ? { unicodeRange } : {}) });
});

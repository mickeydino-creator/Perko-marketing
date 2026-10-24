import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// impact + ui = Heebo [V] (site font) · accent = Frank Ruhl Libre [S] · mono = JetBrains Mono [S]
// Bundled locally from @fontsource (OFL) so renders never depend on the network.
export const impact = 'Heebo';
export const accent = 'Frank Ruhl Libre';
export const mono = 'JetBrains Mono';

const HE = 'U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F';
const faces: [string, string, string, string?][] = [
  ...(['500', '700', '800', '900'] as const).flatMap((w) => [
    [impact, w, `heebo-hebrew-${w}-normal.woff2`, HE] as [string, string, string, string],
    [impact, w, `heebo-latin-${w}-normal.woff2`] as [string, string, string],
  ]),
  [accent, '400', 'frank-ruhl-libre-hebrew-400-normal.woff2', HE],
  [accent, '400', 'frank-ruhl-libre-latin-400-normal.woff2'],
  [mono, '500', 'jetbrains-mono-latin-500-normal.woff2'],
];
faces.forEach(([family, weight, file, unicodeRange]) => {
  loadFont({ family, weight, url: staticFile(`fonts/${file}`), format: 'woff2', ...(unicodeRange ? { unicodeRange } : {}) });
});

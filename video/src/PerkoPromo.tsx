import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { S } from './tokens';
import './fonts';
import { Boot } from './scenes/Boot';
import { Title } from './scenes/Title';
import { Collect } from './scenes/Collect';
import { Redeem } from './scenes/Redeem';
import { Network } from './scenes/Network';
import { End } from './scenes/End';
import { Hud } from './components/Hud';

const seq = (k: keyof typeof S) => ({ from: S[k].from, durationInFrames: S[k].to - S[k].from });

export const PerkoPromo: React.FC = () => (
  <AbsoluteFill style={{ background: '#111522' }}>
    <Sequence {...seq('boot')}><Boot /></Sequence>
    <Sequence {...seq('title')}><Title /></Sequence>
    <Sequence {...seq('collect')}><Collect /></Sequence>
    <Sequence {...seq('redeem')}><Redeem /></Sequence>
    <Sequence {...seq('network')}><Network /></Sequence>
    <Sequence {...seq('end')}><End /></Sequence>
    <Hud />
    {/* Music: track excerpt 0:34.85-0:54.05, drop on f144. Sits under the voice. */}
    <Audio src={staticFile('music.wav')} volume={(f) => interpolate(f, [0, 140, 150, 560, 576], [0.42, 0.42, 0.34, 0.34, 0.2], { extrapolateRight: 'clamp' })} />
    {/* Voiceover: six lines placed on the beat grid (see README). */}
    <Audio src={staticFile('vo.wav')} volume={1} />
  </AbsoluteFill>
);

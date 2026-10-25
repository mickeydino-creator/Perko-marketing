import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { S } from './tokens';
import './fonts';
import { Boot } from './scenes/Boot';
import { Problem } from './scenes/Problem';
import { Title } from './scenes/Title';
import { Wallet } from './scenes/Wallet';
import { Scan } from './scenes/Scan';
import { Stamp } from './scenes/Stamp';
import { Progress } from './scenes/Progress';
import { Back } from './scenes/Back';
import { MapScene } from './scenes/MapScene';
import { Orbit } from './scenes/Orbit';
import { End } from './scenes/End';
import { Hud } from './components/Hud';

const seq = (k: keyof typeof S) => ({ from: S[k].from, durationInFrames: S[k].to - S[k].from });

export const PerkoPromo: React.FC = () => (
  <AbsoluteFill style={{ background: '#111522' }}>
    <Sequence {...seq('boot')}><Boot /></Sequence>
    <Sequence {...seq('problem')}><Problem /></Sequence>
    <Sequence {...seq('title')}><Title /></Sequence>
    <Sequence {...seq('wallet')}><Wallet /></Sequence>
    <Sequence {...seq('scan')}><Scan /></Sequence>
    <Sequence {...seq('stamp')}><Stamp /></Sequence>
    <Sequence {...seq('progress')}><Progress /></Sequence>
    <Sequence {...seq('back')}><Back /></Sequence>
    <Sequence {...seq('map')}><MapScene /></Sequence>
    <Sequence {...seq('orbit')}><Orbit /></Sequence>
    <Sequence {...seq('end')}><End /></Sequence>
    <Hud />
    {/* Original score (music/compose.py), 150 BPM, drop on f144, groove stops on f480. Sits under the voice. */}
    <Audio src={staticFile('music.wav')} volume={0.3} />
    {/* Voiceover: six lines placed on beats (README). */}
    <Audio src={staticFile('vo.wav')} volume={1.8} />
  </AbsoluteFill>
);

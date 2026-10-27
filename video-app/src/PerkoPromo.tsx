import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { S, SLOW } from './tokens';
import './fonts';
import { Boot } from './scenes/Boot';
import { Title } from './scenes/Title';
import { WalletScene } from './scenes/WalletScene';
import { SwipeScene } from './scenes/SwipeScene';
import { DiscoverScene } from './scenes/DiscoverScene';
import { CollectScene } from './scenes/CollectScene';
import { ScanScene } from './scenes/ScanScene';
import { RedeemScene } from './scenes/RedeemScene';
import { BusinessScene } from './scenes/BusinessScene';
import { End } from './scenes/End';
import { Hud } from './components/Hud';

const seq = (k: keyof typeof S) => ({ from: S[k].from * SLOW, durationInFrames: (S[k].to - S[k].from) * SLOW });

export const PerkoPromo: React.FC = () => (
  <AbsoluteFill style={{ background: '#11130F' }}>
    <Sequence {...seq('boot')}><Boot /></Sequence>
    <Sequence {...seq('title')}><Title /></Sequence>
    <Sequence {...seq('wallet')}><WalletScene /></Sequence>
    <Sequence {...seq('swipe')}><SwipeScene /></Sequence>
    <Sequence {...seq('discover')}><DiscoverScene /></Sequence>
    <Sequence {...seq('collect')}><CollectScene /></Sequence>
    <Sequence {...seq('scan')}><ScanScene /></Sequence>
    <Sequence {...seq('redeem')}><RedeemScene /></Sequence>
    <Sequence {...seq('business')}><BusinessScene /></Sequence>
    <Sequence {...seq('end')}><End /></Sequence>
    <Hud />
    {/* Original score (music/compose.py), 120 BPM, drop at 4.0 s on the title exit, groove stops at 18.0 s. */}
    <Audio src={staticFile('music.wav')} volume={1} />
  </AbsoluteFill>
);

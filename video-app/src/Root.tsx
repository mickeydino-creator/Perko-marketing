import React from 'react';
import { Composition } from 'remotion';
import { PerkoPromo } from './PerkoPromo';
import { FPS, H, REAL_DURATION, W } from './tokens';

export const RemotionRoot: React.FC = () => (
  <Composition id="PerkoPromo" component={PerkoPromo} durationInFrames={REAL_DURATION} fps={FPS} width={W} height={H} />
);

import React from 'react';
import { Composition } from 'remotion';
import { PerkoPromo } from './PerkoPromo';
import { DURATION, FPS, H, W } from './tokens';

export const RemotionRoot: React.FC = () => (
  <Composition id="PerkoPromo" component={PerkoPromo} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);

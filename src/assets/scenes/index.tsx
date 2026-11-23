import type { ReactNode } from 'react';
import { BACKGROUND_LIST } from './backgrounds';
import { FRAME_LIST } from './frames';

export const BACKGROUNDS = BACKGROUND_LIST;
export const FRAMES = FRAME_LIST;
export const SCENE_W = 1600;
export const SCENE_H = 1200;

export function Background({ id }: { id: string }): ReactNode {
  const b = BACKGROUNDS.find((x) => x.id === id) ?? BACKGROUNDS[0];
  return <b.Component />;
}
export function Frame({ id }: { id: string | null }): ReactNode {
  const f = id ? FRAMES.find((x) => x.id === id) : undefined;
  return f ? <f.Component /> : null;
}

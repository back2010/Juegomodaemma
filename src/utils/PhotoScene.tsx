import { DollRenderer } from '@/art/DollRenderer';
import { Background, Frame, SCENE_H, SCENE_W } from '@/assets/scenes';
import type { DollLook, Scene } from '@/types';

export const DOLL_BOX = { x: 500, y: 100, width: 600, height: 1000 };

/** Escena completa (fondo + muñeca + marco) como <svg> 1600×1200. Misma para vista previa y exportación. */
export function PhotoScene({ look, scene, className, size }: {
  look: DollLook; scene: Scene; className?: string; size?: { width: number; height: number };
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className={className}
      width={size?.width} height={size?.height} data-testid="photo-scene">
      <g data-scene="background"><Background id={scene.backgroundId} /></g>
      <g data-scene="doll"><DollRenderer look={look} nested={DOLL_BOX} idPrefix="photo" /></g>
      <g data-scene="frame"><Frame id={scene.frameId} /></g>
    </svg>
  );
}

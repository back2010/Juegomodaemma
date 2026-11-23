import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { withLock } from '@/scheduler/locks';
import type { DollLook, Scene } from '@/types';
import { PhotoScene } from './PhotoScene';

export interface ComposeSize { width: number; height: number }

/** Markup SVG de la foto (testeable sin canvas). */
export function sceneMarkup(look: DollLook, scene: Scene, size?: ComposeSize): string {
  return renderToStaticMarkup(createElement(PhotoScene, { look, scene, size }));
}

async function rasterize(svg: string, { width, height }: ComposeSize): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.width = width; img.height = height;
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas no disponible');
    ctx.drawImage(img, 0, 0, width, height);
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob falló'))), 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Compone la foto como PNG. Corre dentro del lock 'photo' del scheduler. */
export function composeScene(look: DollLook, scene: Scene, size: ComposeSize): Promise<Blob> {
  return withLock('photo', () => rasterize(sceneMarkup(look, scene, size), size));
}

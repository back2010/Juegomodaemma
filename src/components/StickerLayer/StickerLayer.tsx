/**
 * Stickers: selector (StickerStudio) y capa de interacción sobre la muñeca (StickerLayer).
 * Tocar una casilla coloca el sticker; arrastrarla hasta el escenario también. Los stickers puestos se
 * mueven arrastrándolos con el dedo; soltarlos fuera del escenario los quita.
 */
import { useEffect, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import type { StickerZone } from '@/types';
import { catalog } from '@/catalog/registry';
import { useDolls, useCurrentLook } from '@/store/dollStore';
import { newId } from '@/store/galleryStore';
import { lock } from '@/scheduler/locks';
import { sfx } from '@/audio';
import { ItemGrid } from '@/components/DollEditor/ItemGrid';
import { StickerPreview } from '@/components/DollEditor/Preview';
import { IconTrash } from '@/components/Shell/icons';
import './StickerLayer.css';

/** Zona según la posición en la muñeca (viewBox 0 0 600 1000). */
export function zoneAt(x: number, y: number): StickerZone {
  if (y < 200 || (y < 520 && (x < 175 || x > 425))) return 'hair';
  if (y < 400 && x >= 175 && x <= 425) return 'face';
  if (y < 1000 && x > 140 && x < 460) return 'body';
  return 'free';
}

const VB = { w: 600, h: 1000 };
const HIT_RADIUS = 40; // tolerancia al tocar cerca de un sticker (unidades del viewBox)
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

const stageEl = () => document.querySelector<HTMLElement>('[data-testid="stage"]');
const stageSvg = () => stageEl()?.querySelector<SVGSVGElement>('svg') ?? null;

/** Pantalla -> coordenadas del viewBox de la muñeca. */
export function screenToSvg(svg: SVGSVGElement, cx: number, cy: number): { x: number; y: number } | null {
  const m = svg.getScreenCTM?.();
  if (!m) return null;
  const pt = svg.createSVGPoint();
  pt.x = cx; pt.y = cy;
  const r = pt.matrixTransform(m.inverse());
  return { x: r.x, y: r.y };
}

function insideStage(cx: number, cy: number) {
  const el = stageEl();
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
}

let abortActive: (() => void) | null = null;

interface DragInit {
  pointerId: number;
  uid: string | null;      // sticker existente (null = nuevo desde la casilla)
  stickerId?: string;      // para el nuevo
  ox: number; oy: number;  // desfase centro-dedo
  sx: number; sy: number;  // inicio en pantalla
  threshold: boolean;      // exige mover un poco antes de empezar
  onStart?: () => void;
}

/** Motor de arrastre: sigue el dedo con listeners en window y mantiene el lock hasta soltar. */
function startDrag(init: DragInit) {
  abortActive?.();
  const release = lock('sticker-drag');
  let { uid } = init;
  let started = !init.threshold;
  let didStart = false;
  const find = () => (uid ? document.querySelector<SVGGElement>(`[data-sticker="${uid}"]`) : null);

  const cleanup = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    abortActive = null;
    release();
  };
  const move = (e: PointerEvent) => {
    if (e.pointerId !== init.pointerId) return;
    if (!started) {
      const dx = e.clientX - init.sx, dy = e.clientY - init.sy;
      if (Math.hypot(dx, dy) < 14) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.6) return; // gesto vertical = desplazar la lista
      started = true;
    }
    const svg = stageSvg();
    const p = svg && screenToSvg(svg, e.clientX, e.clientY);
    if (!p) return;
    const inside = insideStage(e.clientX, e.clientY);
    const x = Math.round(clamp(p.x + init.ox, 0, VB.w)), y = Math.round(clamp(p.y + init.oy, 0, VB.h));
    const st = useDolls.getState();
    if (!uid) {
      if (!inside || !init.stickerId) return;
      uid = newId();
      st.addSticker({ uid, stickerId: init.stickerId, x, y, scale: 0.6, rot: 0, zone: zoneAt(x, y) });
    } else {
      st.updateSticker(uid, { x, y, zone: zoneAt(x, y) });
    }
    if (!didStart) { didStart = true; init.onStart?.(); }
    find()?.setAttribute('opacity', inside ? '1' : '0.4');
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId !== init.pointerId) return;
    if (uid && started && !insideStage(e.clientX, e.clientY)) {
      useDolls.getState().removeSticker(uid);
      sfx.play('whoosh');
    } else if (uid && started) {
      sfx.play('pop');
    }
    cleanup();
  };
  const cancel = (e: PointerEvent) => { if (e.pointerId === init.pointerId) { find()?.setAttribute('opacity', '1'); cleanup(); } };
  abortActive = () => { find()?.setAttribute('opacity', '1'); cleanup(); };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
}

export function StickerStudio() {
  const look = useCurrentLook();
  const { addSticker, removeSticker } = useDolls.getState();
  const n = look.stickers.length;

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('[data-testid^="tile-st-"]');
    if (!tile || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const stickerId = tile.dataset.testid!.slice('tile-'.length);
    startDrag({
      pointerId: e.pointerId, uid: null, stickerId, ox: 0, oy: -30, sx: e.clientX, sy: e.clientY, threshold: true,
      onStart: () => { // evita que el "click" posterior coloque otro sticker
        const stop = (ev: Event) => { ev.stopPropagation(); ev.preventDefault(); };
        window.addEventListener('click', stop, { capture: true, once: true });
        setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 600);
      },
    });
  };

  return (
    <div className="studio-body sticker-studio" onPointerDown={onPointerDown}>
      <ItemGrid testId="item-grid" tiles={[
        ...catalog.stickers.map((s) => ({
          key: s.id, label: s.shapeTag, preview: <StickerPreview def={s} />,
          onPick: () => {
            const x = 200 + ((n * 67) % 200), y = 110 + ((n * 41) % 90);
            addSticker({ uid: newId(), stickerId: s.id, x, y, scale: 0.6, rot: ((n * 23) % 40) - 20, zone: zoneAt(x, y) });
          },
        })),
        ...(n ? [{ key: 'trash', label: 'quitar', preview: <IconTrash />, onPick: () => removeSticker(look.stickers[n - 1].uid) }] : []),
      ]} />
    </div>
  );
}

/** Envoltorio de la muñeca en el escenario: arrastrar stickers puestos. */
export function StickerLayer({ children }: { children: ReactNode }) {
  useEffect(() => () => abortActive?.(), []);

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const svg = stageSvg();
    if (!svg) return;
    const p = screenToSvg(svg, e.clientX, e.clientY);
    if (!p) return;
    const look = useDolls.getState().looks[useDolls.getState().selectedDollId];
    const list = look?.stickers ?? [];
    // 1) sticker bajo el dedo; 2) el más cercano dentro de la tolerancia (de arriba hacia abajo)
    let hit = (e.target as Element).closest?.('[data-sticker]')?.getAttribute('data-sticker') ?? null;
    if (!hit) {
      let best = HIT_RADIUS * HIT_RADIUS;
      for (let i = list.length - 1; i >= 0; i--) {
        const d = (list[i].x - p.x) ** 2 + (list[i].y - p.y) ** 2;
        if (d < best) { best = d; hit = list[i].uid; }
      }
    }
    const s = hit ? list.find((q) => q.uid === hit) : undefined;
    if (!s) return;
    e.preventDefault();
    startDrag({ pointerId: e.pointerId, uid: s.uid, ox: s.x - p.x, oy: s.y - p.y, sx: e.clientX, sy: e.clientY, threshold: false });
  };

  return <div className="sticker-layer" style={{ display: 'contents' }} onPointerDown={onPointerDown}>{children}</div>;
}

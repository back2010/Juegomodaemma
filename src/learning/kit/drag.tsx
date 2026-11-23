/**
 * Arrastrar y soltar táctil con pointer events (iPad + ratón).
 *  - <DropZone id="..."> marca un destino (atributo data-drop-id).
 *  - useDraggable({ onDrop }) devuelve props para el elemento arrastrable; al soltar se llama
 *    onDrop(dropId | null). Si no hubo destino válido el elemento vuelve a su lugar.
 */
import { useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from 'react';

/** Busca el destino bajo el punto (x,y) en coordenadas de pantalla. */
export function dropTargetAt(x: number, y: number, ignore?: Element | null): string | null {
  const els = typeof document.elementsFromPoint === 'function' ? document.elementsFromPoint(x, y) : [];
  for (const el of els) {
    if (ignore && ignore.contains(el)) continue;
    const z = (el as HTMLElement).closest?.('[data-drop-id]');
    if (z) return z.getAttribute('data-drop-id');
  }
  return null;
}

export function useDraggable({ onDrop, disabled }: { onDrop(dropId: string | null): void; disabled?: boolean }) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const [delta, setDelta] = useState<{ dx: number; dy: number } | null>(null);
  const el = useRef<HTMLElement | null>(null);

  const onPointerDown = (e: RPointerEvent<HTMLElement>) => {
    if (disabled || start.current) return;
    el.current = e.currentTarget;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDelta({ dx: 0, dy: 0 });
  };
  const onPointerMove = (e: RPointerEvent<HTMLElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    setDelta({ dx: e.clientX - s.x, dy: e.clientY - s.y });
  };
  const end = (e: RPointerEvent<HTMLElement>, cancelled: boolean) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    start.current = null;
    setDelta(null);
    onDrop(cancelled ? null : dropTargetAt(e.clientX, e.clientY, el.current));
  };
  const style: CSSProperties = delta
    ? { transform: `translate(${delta.dx}px, ${delta.dy}px) scale(1.08)`, zIndex: 20, transition: 'none', touchAction: 'none' }
    : { touchAction: 'none' };
  return {
    dragging: delta !== null,
    props: {
      onPointerDown, onPointerMove,
      onPointerUp: (e: RPointerEvent<HTMLElement>) => end(e, false),
      onPointerCancel: (e: RPointerEvent<HTMLElement>) => end(e, true),
      style,
    },
  };
}

/** Destino de arrastre. `isAnswer` lo marca para la pista visual. */
export function DropZone({ id, children, className = '', style, hint }: {
  id: string; children?: ReactNode; className?: string; style?: CSSProperties; hint?: boolean;
}) {
  return (
    <div data-drop-id={id} data-hint={hint ? 'on' : 'off'} className={`lk-drop ${hint ? 'lk-hint' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Elemento arrastrable listo para usar. */
export function Draggable({ children, onDrop, label, disabled, testId, className = '' }: {
  children: ReactNode; onDrop(dropId: string | null): void; label: string; disabled?: boolean; testId?: string; className?: string;
}) {
  const { props, dragging } = useDraggable({ onDrop, disabled });
  return (
    <div role="button" aria-label={label} data-testid={testId} className={`lk-drag ${dragging ? 'dragging' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

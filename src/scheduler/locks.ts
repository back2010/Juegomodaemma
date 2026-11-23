/**
 * Locks de "operación importante" (foto, guardado, arrastre). Mientras haya locks, el scheduler
 * no muestra invitaciones. P8 es dueño y puede extender; la API `lock()` es estable.
 */
type Listener = (locks: string[]) => void;
const held = new Map<string, number>();
const listeners = new Set<Listener>();
let seq = 0;

export function lock(name: string): () => void {
  const id = `${name}#${++seq}`;
  held.set(id, Date.now());
  emit();
  let released = false;
  return () => { if (released) return; released = true; held.delete(id); emit(); };
}

/** Ejecuta fn con lock (se libera aunque falle). */
export async function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const release = lock(name);
  try { return await fn(); } finally { release(); }
}

export const activeLocks = () => [...held.keys()];
export const isLocked = () => held.size > 0;
export function onLocksChange(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; }
function emit() { const ls = activeLocks(); listeners.forEach((l) => l(ls)); }

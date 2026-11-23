/** Puerta parental. Stub de P0 (P7 la implementa): por ahora cierra de inmediato. */
import { useEffect } from 'react';
import { useGame } from '@/store/gameStore';
export function ParentGate() {
  const setOverlay = useGame((s) => s.setOverlay);
  useEffect(() => { setOverlay('none'); }, [setOverlay]);
  return null;
}

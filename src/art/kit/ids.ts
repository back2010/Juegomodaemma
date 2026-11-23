import { useId, useMemo } from 'react';

/** Devuelve idp(n) => id único por instancia de render (evita colisiones de gradientes). */
export function useIdp(prefix = 'p') {
  const raw = useId();
  return useMemo(() => {
    const base = `${prefix}${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
    return (n: string) => `${base}-${n}`;
  }, [raw, prefix]);
}

/** Variante no-hook (para composición estática/tests). */
export function makeIdp(base: string) {
  return (n: string) => `${base}-${n}`;
}

export const url = (id: string) => `url(#${id})`;

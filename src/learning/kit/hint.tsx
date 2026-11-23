/**
 * Pista visual. El runner incrementa `token` cada vez que la ronda llama reportMistake();
 * los elementos marcados como respuesta (`isAnswer`) laten/brillan durante HINT_MS.
 */
import { createContext, useContext, useEffect, useState } from 'react';

export const HINT_MS = 2600;
export const HintContext = createContext<{ token: number }>({ token: 0 });

/** true mientras debe mostrarse la pista (tras un error). */
export function useHint(): boolean {
  const { token } = useContext(HintContext);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (token === 0) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), HINT_MS);
    return () => clearTimeout(t);
  }, [token]);
  return on;
}

/** Props listas para un elemento que es (o no) la respuesta correcta. */
export function useHintProps(isAnswer: boolean) {
  const on = useHint() && isAnswer;
  return { 'data-hint': on ? 'on' : 'off', className: on ? 'lk-hint' : '' } as const;
}

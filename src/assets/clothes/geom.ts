/** Geometría de prendas sobre el cuerpo compartido (mitades izquierdas; la derecha se refleja). */
export type Sleeve = 'short' | 'long' | 'none' | 'cap';
export type Neck = 'round' | 'v' | 'scoop';

/** Mitad izquierda de un corpiño. Termina en (236,hem) cerrando por el centro, o continúa con `after`. */
export function bodiceL(o: { sleeve: Sleeve; hem: number; neck?: Neck; after?: string }): string {
  const { sleeve, hem } = o;
  const neck = o.neck ?? 'round';
  const hemEnd = o.after ?? `L300 ${hem} Z`;
  if (sleeve === 'none') {
    const ny = neck === 'v' ? 500 : 472;
    return `M300 ${ny} Q286 ${ny - 2} 276 438 L254 440 C252 462 244 482 230 496 C234 530 236 566 236 ${hem} ${hemEnd}`;
  }
  const start = neck === 'v' ? 'M300 494 L282 434' : neck === 'scoop' ? 'M300 470 Q288 468 282 434' : 'M300 456 Q290 454 282 434';
  const shoulder = 'C260 440 226 440 210 452';
  if (sleeve === 'short') return `${start} ${shoulder} C196 470 184 500 186 522 L214 528 C218 512 222 502 228 494 C232 530 236 566 236 ${hem} ${hemEnd}`;
  if (sleeve === 'cap') return `${start} C260 440 228 440 212 452 C208 468 216 484 230 494 C234 530 236 566 236 ${hem} ${hemEnd}`;
  return `${start} ${shoulder} C196 470 186 520 184 560 L182 632 L206 636 C208 600 214 560 222 530 C228 560 234 590 236 ${hem} ${hemEnd}`;
}

/** Pantalón largo (mitad izquierda). hem = y del dobladillo; flare = ensanche en el bajo. */
export function pantsL(hem = 906, flare = 0): string {
  return `M300 598 L242 598 C232 640 228 700 234 742 C244 800 250 850 ${252 - flare} ${hem} L${294 + flare * 0.3} ${hem} C294 830 298 760 300 706 Z`;
}
export function shortsL(hem = 754): string {
  return `M300 598 L242 598 C232 640 228 700 233 ${hem - 8} Q266 ${hem + 6} 298 ${hem} C299 740 300 725 300 706 Z`;
}
export function leggingsL(hem = 922): string {
  return `M300 598 L241 598 C232 640 230 700 238 742 C248 800 256 860 260 ${hem} L289 ${hem} C287 860 292 790 298 722 L300 700 Z`;
}
export function skirtL(hem: number, spread: number, top = 598): string {
  return `M300 ${top} L240 ${top} C226 ${top + 50} ${200 + spread * 0.4} ${hem - 60} ${198 - spread} ${hem - 14} Q${250} ${hem + 6} 300 ${hem} Z`;
}

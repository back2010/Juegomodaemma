/** Libro de frases con variación (evita las 2 últimas variantes usadas por clave). */
import type { PhraseBook } from '@/types';

export type PhraseParams = Record<string, string | number>;

export class PhraseStore {
  private book: PhraseBook = {};
  private history = new Map<string, number[]>();

  define(p: PhraseBook) { Object.assign(this.book, p); }
  has(key: string) { return !!this.book[key]?.length; }

  /** Índice de variante: aleatorio, evitando las 2 últimas de la clave (si hay suficientes). */
  pick(key: string, rnd: () => number = Math.random): number {
    const vs = this.book[key];
    if (!vs?.length) return -1;
    const hist = this.history.get(key) ?? [];
    const n = Math.min(2, vs.length - 1);
    const avoid = n > 0 ? hist.slice(-n) : [];
    const options: number[] = [];
    for (let i = 0; i < vs.length; i++) if (!avoid.includes(i)) options.push(i);
    const idx = options[Math.min(options.length - 1, Math.floor(rnd() * options.length))];
    this.history.set(key, [...hist, idx].slice(-2));
    return idx;
  }

  text(key: string, params: PhraseParams = {}, defaultName = '', rnd?: () => number): string {
    const i = this.pick(key, rnd);
    if (i < 0) return '';
    return fill(this.book[key][i], params, defaultName);
  }
}

export function fill(tpl: string, params: PhraseParams, defaultName = ''): string {
  return tpl
    .replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? (k === 'name' ? defaultName : '')))
    .replace(/\s{2,}/g, ' ')
    .trim();
}

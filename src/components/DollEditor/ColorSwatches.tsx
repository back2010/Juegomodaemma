import { sfx } from '@/audio';

export interface Swatch { key: string; paint: string; selected?: boolean; label: string; onPick(): void }

/** Fila de colores: círculos grandes con brillo. `paint` es un background CSS. */
export function ColorSwatches({ swatches, testId }: { swatches: Swatch[]; testId?: string }) {
  if (!swatches.length) return null;
  return (
    <div className="swatches" data-testid={testId}>
      {swatches.map((s) => (
        <button key={s.key} type="button" className={`swatch ${s.selected ? 'selected' : ''}`} aria-label={s.label}
          data-testid={`swatch-${s.key}`} aria-pressed={!!s.selected}
          style={{ background: s.paint }} onClick={() => { sfx.play('sparkle'); s.onPick(); }} />
      ))}
    </div>
  );
}

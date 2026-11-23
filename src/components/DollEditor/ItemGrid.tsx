import type { ReactNode } from 'react';
import { sfx } from '@/audio';
import { IconNone } from '@/components/Shell/icons';

export interface Tile { key: string; preview: ReactNode; selected?: boolean; label: string; onPick(): void }

/** Cuadrícula de opciones grandes. `onNone` añade al inicio una casilla "quitar". */
export function ItemGrid({ tiles, onNone, noneSelected, testId }: { tiles: Tile[]; onNone?(): void; noneSelected?: boolean; testId?: string }) {
  return (
    <div className="item-grid" data-testid={testId}>
      {onNone && (
        <button type="button" className={`tile ${noneSelected ? 'selected' : ''}`} aria-label="Quitar" data-testid="tile-none"
          onClick={() => { sfx.play('whoosh'); onNone(); }}>
          <IconNone />
        </button>
      )}
      {tiles.map((t) => (
        <button key={t.key} type="button" className={`tile ${t.selected ? 'selected' : ''}`} aria-label={t.label}
          data-testid={`tile-${t.key}`} aria-pressed={!!t.selected}
          onClick={() => { sfx.play('pop'); t.onPick(); }}>
          {t.preview}
        </button>
      ))}
    </div>
  );
}

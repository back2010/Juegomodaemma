import type { ReactNode } from 'react';
import { sfx } from '@/audio';

export interface SubTab { key: string; icon: ReactNode; label: string }
export function SubTabs({ tabs, value, onChange }: { tabs: SubTab[]; value: string; onChange(k: string): void }) {
  return (
    <div className="subtabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.key} type="button" role="tab" aria-selected={t.key === value} aria-label={t.label}
          data-testid={`subtab-${t.key}`} className={`subtab ${t.key === value ? 'selected' : ''}`}
          onClick={() => { sfx.play('tap'); onChange(t.key); }}>
          {t.icon}
        </button>
      ))}
    </div>
  );
}

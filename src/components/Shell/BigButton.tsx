import type { ReactNode } from 'react';
import { sfx } from '@/audio';

type Tone = 'default' | 'primary' | 'green' | 'purple' | 'turq' | 'yellow';
interface Props {
  icon: ReactNode; onPress(): void; tone?: Tone; size?: 'md' | 'lg'; selected?: boolean;
  /** Etiqueta accesible (no visible). */
  label: string; className?: string; testId?: string;
}
export function BigButton({ icon, onPress, tone = 'default', size = 'md', selected, label, className = '', testId }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      data-testid={testId}
      className={`btn ${tone !== 'default' ? tone : ''} ${size === 'lg' ? 'lg' : ''} ${selected ? 'selected' : ''} ${className}`}
      onClick={() => { sfx.play('tap'); onPress(); }}
    >
      {icon}
    </button>
  );
}

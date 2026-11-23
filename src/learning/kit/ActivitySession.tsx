/**
 * Sesión de actividad (ActivityRunner). STUB de P0 para que P8 pueda integrar: P5 lo reemplaza
 * manteniendo la firma `ActivitySession: FC<ActivitySessionProps>`.
 */
import type { ActivitySessionProps } from '@/types';
import { BigButton } from '@/components/Shell/BigButton';
import { IconCheck } from '@/components/Shell/icons';

export function ActivitySession({ onComplete }: ActivitySessionProps) {
  return (
    <div className="placeholder">
      <BigButton size="lg" tone="green" label="Terminar" testId="activity-complete" icon={<IconCheck />} onPress={onComplete} />
    </div>
  );
}

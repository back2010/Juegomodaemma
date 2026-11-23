/**
 * Burbuja de reto del salón (montada en DollEditor). No bloquea: se puede ignorar y caduca sola.
 * Al cumplirse: confeti + sonido + voz.
 */
import { BigButton } from '@/components/Shell/BigButton';
import { IconSpeaker } from '@/components/Shell/icons';
import { Confetti } from '@/learning/kit/Celebration';
import { useChallengeEngine, type EngineOptions } from './useChallengeEngine';
import { ChallengeIcon } from './ChallengeIcon';
import './challenges.css';

export function ChallengeBubble(props: EngineOptions = {}) {
  const { state, repeat } = useChallengeEngine(props);
  if (!state) return null;
  const { challenge, met } = state;
  return (
    <div className={`ch-bubble pop-in ${met ? 'met' : ''}`} data-testid="challenge-bubble" data-type={challenge.type}
      data-met={met ? 'yes' : 'no'}>
      <button type="button" className="ch-icon" aria-label="Reto" onClick={repeat}>
        <ChallengeIcon c={challenge} />
      </button>
      {!met && <BigButton tone="yellow" icon={<IconSpeaker />} label="Repetir reto" testId="challenge-repeat" onPress={repeat} />}
      {met && <Confetti count={20} seed={3} />}
    </div>
  );
}

/** Frases del scheduler (voz). Cortas, positivas, con variantes. */
import { definePhrases } from '@/audio';

export const PH = {
  options: 'sched.options',
  optionsMandatory: 'sched.options.mandatory',
  play: 'sched.play',
  keepPlaying: 'sched.keep',
  back: 'sched.back',
} as const;

let done = false;
export function registerSchedulerPhrases() {
  if (done) return;
  done = true;
  definePhrases({
    [PH.options]: [
      'Toca la estrella para jugar, o la muñeca para seguir vistiendo.',
      'La estrella es para jugar. La muñeca, para seguir con tu moda.',
      '¿Estrella para jugar, o muñeca para seguir?',
    ],
    [PH.optionsMandatory]: [
      'Toca la estrella para empezar.',
      '¡Toca la estrella y empezamos!',
    ],
    [PH.play]: ['¡Vamos a jugar!', '¡Allá vamos!', '¡Qué divertido!'],
    [PH.keepPlaying]: ['¡Muy bien, sigue jugando!', '¡Dale, sigue con tu moda!', 'Está bien, luego jugamos.'],
    [PH.back]: ['¡Listo! Tu muñeca te espera.', '¡De vuelta al estudio!', 'Volvemos con tu muñeca.'],
  });
}

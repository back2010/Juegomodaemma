import type { CSSProperties, ReactNode } from 'react';
import { useHint } from './hint';

interface Props {
  /** Dibujo de la opción (SVG). */
  children: ReactNode;
  /** Etiqueta accesible, no visible. */
  label: string;
  onPress(): void;
  /** Si es la respuesta correcta: recibe la pista visual tras un error. */
  isAnswer?: boolean;
  /** Ya resuelta/encontrada: se ve feliz y deja de responder. */
  done?: boolean;
  disabled?: boolean;
  size?: number;
  testId?: string;
  style?: CSSProperties;
}

/** Opción grande y táctil para actividades (mínimo 120 px). Sin texto visible. */
export function ChoiceButton({ children, label, onPress, isAnswer = false, done, disabled, size = 150, testId, style }: Props) {
  const hint = useHint() && isAnswer && !done;
  return (
    <button
      type="button"
      aria-label={label}
      data-testid={testId}
      data-answer={isAnswer ? 'yes' : undefined}
      data-hint={hint ? 'on' : 'off'}
      disabled={disabled}
      className={`lk-choice ${hint ? 'lk-hint' : ''} ${done ? 'lk-done' : ''}`}
      style={{ width: size, height: size, ...style }}
      onClick={() => { if (!done && !disabled) onPress(); }}
    >
      {children}
    </button>
  );
}

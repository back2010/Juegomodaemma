import { GemShape, makePalette, useIdp } from '@/art/kit';

/** Estrellita del rastro de rondas completadas. */
export function MiniStar() {
  const idp = useIdp('ms');
  return (
    <svg viewBox="0 0 40 40" className="lk-ministar pop-in">
      <GemShape shape="estrella" cx={20} cy={21} r={17} p={makePalette('#ffd23f')} gid={idp('g')} />
    </svg>
  );
}

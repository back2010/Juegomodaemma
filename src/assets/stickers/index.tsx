import type { PartProps, StickerDef } from '@/types';
import { GemShape } from '@/art/kit';

const Star = ({ palette, idp }: PartProps) => <GemShape shape="estrella" cx={0} cy={0} r={38} p={palette} gid={idp('g')} />;
const Heart = ({ palette, idp }: PartProps) => <GemShape shape="corazon" cx={0} cy={0} r={36} p={palette} gid={idp('g')} />;

/** Stickers de referencia (P0). P2 amplía: estrellas, corazones, brillos y las 7 figuras. */
const stickers: StickerDef[] = [
  { id: 'st-estrella-amarilla', shapeTag: 'estrella', colorTag: 'amarillo', Part: Star },
  { id: 'st-corazon-rosa', shapeTag: 'corazon', colorTag: 'rosa', Part: Heart },
];
export default stickers;

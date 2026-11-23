import type { ActivityDef } from '@/types';
import { ShapeToken } from '../../kit/art';
import { ShapeFindRound } from './ShapeFindRound';
import './phrases';
import './shape-find.css';
import '../activities.css';

function ShapeFindIcon() {
  return (
    <div className="act-icon act-icon-trio" aria-hidden="true">
      <ShapeToken shape="circulo" color="rojo" /><ShapeToken shape="estrella" color="amarillo" /><ShapeToken shape="corazon" color="rosa" />
    </div>
  );
}

export const shapeFind: ActivityDef = {
  id: 'shape-find',
  category: 'figuras',
  spokenTitleKey: 'sf.title',
  inviteKey: 'sf.invite',
  Icon: ShapeFindIcon,
  estRoundSec: 18,
  maxLevel: 4,
  Round: ShapeFindRound,
};

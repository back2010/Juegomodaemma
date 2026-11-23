import type { ActivityDef } from '@/types';
import { ShapeToken } from '../../kit/art';
import { Silhouette, ShapeShadowRound } from './ShapeShadowRound';
import './phrases';
import './shape-shadow.css';
import '../activities.css';

function ShapeShadowIcon() {
  return (
    <div className="act-icon act-icon-duo" aria-hidden="true">
      <div className="act-icon-card"><Silhouette shape="estrella" /></div>
      <div className="act-icon-card"><ShapeToken shape="estrella" color="morado" /></div>
    </div>
  );
}

export const shapeShadow: ActivityDef = {
  id: 'shape-shadow',
  category: 'figuras',
  spokenTitleKey: 'ss.title',
  inviteKey: 'ss.invite',
  Icon: ShapeShadowIcon,
  estRoundSec: 15,
  maxLevel: 3,
  Round: ShapeShadowRound,
};

import type { ActivityDef } from '@/types';
import { ShapeToken } from '../../kit/art';
import { CountObjectsRound } from './CountObjectsRound';
import './phrases';
import '../activities.css';
import './count-objects.css';

function CountObjectsIcon() {
  return (
    <div className="act-icon act-icon-trio" aria-hidden="true">
      <ShapeToken shape="estrella" color="amarillo" />
      <ShapeToken shape="estrella" color="amarillo" />
      <ShapeToken shape="estrella" color="amarillo" />
    </div>
  );
}

export const countObjects: ActivityDef = {
  id: 'count-objects',
  category: 'numeros',
  spokenTitleKey: 'co.title',
  inviteKey: 'co.invite',
  Icon: CountObjectsIcon,
  estRoundSec: 25,
  maxLevel: 3,
  Round: CountObjectsRound,
};

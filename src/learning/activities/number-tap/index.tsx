import type { ActivityDef } from '@/types';
import { Flower, ShapeToken } from '../../kit/art';
import { NumberTapRound } from './NumberTapRound';
import './phrases';
import '../activities.css';
import './number-tap.css';

function NumberTapIcon() {
  return (
    <div className="act-icon act-icon-duo" aria-hidden="true">
      <div className="act-icon-card"><ShapeToken shape="corazon" color="rojo" /></div>
      <div className="act-icon-card"><Flower color="rosa" /></div>
    </div>
  );
}

export const numberTap: ActivityDef = {
  id: 'number-tap',
  category: 'numeros',
  spokenTitleKey: 'nt.title',
  inviteKey: 'nt.invite',
  Icon: NumberTapIcon,
  estRoundSec: 20,
  maxLevel: 4,
  Round: NumberTapRound,
};

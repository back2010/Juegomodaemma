import type { ActivityDef } from '@/types';
import { ColorBlob } from '../../kit/art';
import { PatternNextRound } from './PatternNextRound';
import './phrases';
import '../activities.css';
import './pattern-next.css';

function PatternNextIcon() {
  return (
    <div className="act-icon act-icon-trio pn-icon" aria-hidden="true">
      <ColorBlob color="rojo" /><ColorBlob color="azul" /><ColorBlob color="rojo" />
    </div>
  );
}

export const patternNext: ActivityDef = {
  id: 'pattern-next',
  category: 'patrones',
  spokenTitleKey: 'pn.title',
  inviteKey: 'pn.invite',
  Icon: PatternNextIcon,
  estRoundSec: 20,
  maxLevel: 4,
  Round: PatternNextRound,
};

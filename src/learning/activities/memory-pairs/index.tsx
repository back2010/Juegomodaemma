import type { ActivityDef } from '@/types';
import { Animal, CardBack } from '../../kit/art';
import { MemoryRound } from './MemoryRound';
import './phrases';
import '../activities.css';

function MemoryIcon() {
  return (
    <div className="act-icon act-icon-duo" aria-hidden="true">
      <CardBack /><div className="act-icon-card"><Animal kind="gato" /></div>
    </div>
  );
}

export const memoryPairs: ActivityDef = {
  id: 'memory-pairs',
  category: 'memoria',
  spokenTitleKey: 'mp.title',
  inviteKey: 'mp.invite',
  Icon: MemoryIcon,
  estRoundSec: 35,
  maxLevel: 4,
  Round: MemoryRound,
};

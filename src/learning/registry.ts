/** Registro de actividades educativas. Stub de P0; P5 añade sus ActivityDef aquí. */
import type { ActivityDef, LearningCategory } from '@/types';

export const activities: ActivityDef[] = [];
export const getActivity = (id: string) => activities.find((a) => a.id === id);
export const activitiesOf = (c: LearningCategory) => activities.filter((a) => a.category === c);

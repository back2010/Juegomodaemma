import type { Creation } from '@/types';

export const DB_NAME = 'emma-db';
export const DB_VERSION = 1;
export const CURRENT_CREATION_SCHEMA = 1;

/** Migra un registro leído de IndexedDB al esquema actual. */
export function migrateCreation(rec: unknown): Creation | null {
  if (!rec || typeof rec !== 'object') return null;
  const r = rec as Partial<Creation>;
  if (!r.id || !r.look) return null;
  // schemaVersion 1 = actual. Futuras versiones: añadir pasos aquí.
  return { ...r, schemaVersion: 1 } as Creation;
}

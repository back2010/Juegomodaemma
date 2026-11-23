import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Creation } from '@/types';
import { DB_NAME, DB_VERSION, migrateCreation } from './migrations';

interface EmmaDB extends DBSchema {
  creations: { key: string; value: Creation; indexes: { updatedAt: number } };
  images: { key: string; value: Blob };
}

let dbp: Promise<IDBPDatabase<EmmaDB>> | null = null;
export function db() {
  dbp ??= openDB<EmmaDB>(DB_NAME, DB_VERSION, {
    upgrade(d, oldVersion) {
      if (oldVersion < 1) {
        const c = d.createObjectStore('creations', { keyPath: 'id' });
        c.createIndex('updatedAt', 'updatedAt');
        d.createObjectStore('images');
      }
    },
  });
  return dbp;
}

export async function putCreation(c: Creation) { await (await db()).put('creations', c); }
export async function getCreation(id: string) { return migrateCreation(await (await db()).get('creations', id)); }
export async function listCreations(): Promise<Creation[]> {
  const all = await (await db()).getAllFromIndex('creations', 'updatedAt');
  return all.map(migrateCreation).filter((x): x is Creation => !!x).reverse();
}
export async function deleteCreation(id: string) {
  const d = await db();
  const c = await d.get('creations', id);
  const tx = d.transaction(['creations', 'images'], 'readwrite');
  await tx.objectStore('creations').delete(id);
  if (c) { await tx.objectStore('images').delete(c.imageKey); await tx.objectStore('images').delete(c.thumbKey); }
  await tx.done;
}
export async function putImage(key: string, blob: Blob) { await (await db()).put('images', blob, key); }
export async function getImage(key: string) { return (await db()).get('images', key); }
export async function clearAll() {
  const d = await db();
  await Promise.all([d.clear('creations'), d.clear('images')]);
}

/** Solicita almacenamiento persistente (Safari puede borrar datos sin esto). */
export async function requestPersistentStorage() {
  try { return (await navigator.storage?.persist?.()) ?? false; } catch { return false; }
}

export interface QRCodeEntry {
  id: string;
  type: 'text' | 'url' | 'wifi' | 'password' | 'vcard';
  name: string;
  content: string;
  group?: string;
  groupName?: string;
  createdAt: number;
}

const DB_NAME = 'qr-tool-db';
const DB_VERSION = 2; // Bumped version for schema change
const STORE_NAME = 'qr-codes';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Delete old store if exists to change keyPath strategy
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      // Create new store with explicit string id (no autoIncrement)
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
  });
};

export const addQRCode = async (entry: Omit<QRCodeEntry, 'id'>): Promise<string> => {
  const db = await openDB();
  const id = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const newEntry: QRCodeEntry = { ...entry, id };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newEntry);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const getQRCodes = async (): Promise<QRCodeEntry[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as QRCodeEntry[]);
    request.onerror = () => reject(request.error);
  });
};

export const deleteQRCode = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateQRCode = async (entry: QRCodeEntry): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(entry);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateGroupName = async (groupId: string, newName: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // We need to find all entries with this groupId and update them
    const request = store.getAll();

    request.onsuccess = () => {
      const entries = request.result as QRCodeEntry[];
      const groupEntries = entries.filter(e => e.group === groupId);

      let updatedCount = 0;

      if (groupEntries.length === 0) {
        resolve();
        return;
      }

      groupEntries.forEach(entry => {
        entry.groupName = newName;
        const putRequest = store.put(entry);
        putRequest.onsuccess = () => {
          updatedCount++;
          if (updatedCount === groupEntries.length) {
            resolve();
          }
        };
        putRequest.onerror = () => reject(putRequest.error);
      });
    };

    request.onerror = () => reject(request.error);
  });
};

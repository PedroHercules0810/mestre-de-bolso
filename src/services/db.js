import { CR_TO_XP } from '../constants/gameData';

export const DB_NAME = 'QuickEncounterDB';
export const STORE_MONSTERS = 'monsters';
export const STORE_ITEMS = 'items';
export const STORE_TRANSLATIONS = 'translations';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 4);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_MONSTERS)) {
        db.createObjectStore(STORE_MONSTERS, { keyPath: 'slug' });
      }
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        db.createObjectStore(STORE_ITEMS, { keyPath: 'slug' });
      }
      if (!db.objectStoreNames.contains(STORE_TRANSLATIONS)) {
        db.createObjectStore(STORE_TRANSLATIONS, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDataToDB = async (storeName, dataList) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    let count = 0;
    dataList.forEach(item => {
        if (storeName !== STORE_TRANSLATIONS) {
            let uniqueSlug = item.slug;
            if (!uniqueSlug) {
                uniqueSlug = String(item.name || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, '-');
                item.slug = uniqueSlug;
            }
        }
        
        if (storeName === STORE_MONSTERS) {
            if (item.xp !== undefined && item.xp !== null) {
                const rawXp = typeof item.xp === 'string' ? item.xp.replace(/\D/g, '') : item.xp;
                item.xp = parseInt(rawXp) || 0;
            } 
            else if (item.challenge_rating !== undefined && item.challenge_rating !== null) {
                const cleanCR = String(item.challenge_rating).split(' ')[0];
                item.xp = CR_TO_XP[cleanCR] !== undefined ? CR_TO_XP[cleanCR] : 0;
            }
            else {
                item.xp = 0;
            }
        }

        store.put(item);
        count++;
    });

    transaction.oncomplete = () => resolve(count);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

export const getAllDataFromDB = async (storeName) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteDataFromDB = async (storeName, slug) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(slug);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

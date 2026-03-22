const DB_NAME = 'cptm-offline-db'
const DB_VERSION = 1

const STORES = {
  INSPECTIONS: 'inspections',
  SYNC_QUEUE: 'syncQueue',
  META: 'meta',
}

let dbPromise

function withRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Falha no IndexedDB.'))
  })
}

function withTransaction(storeNames, mode, handler) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(storeNames, mode)
    const stores = Object.fromEntries(
      storeNames.map((storeName) => [storeName, tx.objectStore(storeName)])
    )

    Promise.resolve(handler(stores, tx))
      .then((result) => {
        tx.oncomplete = () => resolve(result)
        tx.onerror = () => reject(tx.error ?? new Error('Falha na transacao do IndexedDB.'))
        tx.onabort = () => reject(tx.error ?? new Error('Transacao abortada no IndexedDB.'))
      })
      .catch((error) => {
        tx.abort()
        reject(error)
      })
  }))
}

export function openDb() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(STORES.INSPECTIONS)) {
        const inspections = db.createObjectStore(STORES.INSPECTIONS, { keyPath: 'localId' })
        inspections.createIndex('by_chave_primaria', 'chavePrimariaMa', { unique: false })
        inspections.createIndex('by_updated_at', 'updatedAt', { unique: false })
        inspections.createIndex('by_sync_status', 'syncStatus', { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const queue = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'localId' })
        queue.createIndex('by_queued_at', 'queuedAt', { unique: false })
        queue.createIndex('by_status', 'syncStatus', { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.META)) {
        db.createObjectStore(STORES.META, { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Nao foi possivel abrir o IndexedDB.'))
  })

  return dbPromise
}

export function listInspectionRecords() {
  return withTransaction([STORES.INSPECTIONS], 'readonly', async ({ inspections }) => {
    const items = await withRequest(inspections.getAll())
    return items.sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0))
  })
}

export function getInspectionRecord(localId) {
  return withTransaction([STORES.INSPECTIONS], 'readonly', ({ inspections }) => withRequest(inspections.get(localId)))
}

export function findInspectionByChave(chavePrimariaMa) {
  return withTransaction([STORES.INSPECTIONS], 'readonly', async ({ inspections }) => {
    const index = inspections.index('by_chave_primaria')
    const matches = await withRequest(index.getAll(chavePrimariaMa))
    return matches[0] ?? null
  })
}

export function putInspectionRecord(record) {
  return withTransaction([STORES.INSPECTIONS], 'readwrite', ({ inspections }) => withRequest(inspections.put(record)))
}

export function bulkPutInspectionRecords(records) {
  return withTransaction([STORES.INSPECTIONS], 'readwrite', async ({ inspections }) => {
    for (const record of records) {
      await withRequest(inspections.put(record))
    }
  })
}

export function deleteInspectionRecord(localId) {
  return withTransaction([STORES.INSPECTIONS, STORES.SYNC_QUEUE], 'readwrite', async ({ inspections, syncQueue }) => {
    await withRequest(inspections.delete(localId))
    await withRequest(syncQueue.delete(localId))
  })
}

export function listQueuedItems() {
  return withTransaction([STORES.SYNC_QUEUE], 'readonly', async ({ syncQueue }) => {
    const items = await withRequest(syncQueue.getAll())
    return items.sort((left, right) => (left.queuedAt ?? 0) - (right.queuedAt ?? 0))
  })
}

export function putQueuedItem(queueItem) {
  return withTransaction([STORES.SYNC_QUEUE], 'readwrite', ({ syncQueue }) => withRequest(syncQueue.put(queueItem)))
}

export function deleteQueuedItem(localId) {
  return withTransaction([STORES.SYNC_QUEUE], 'readwrite', ({ syncQueue }) => withRequest(syncQueue.delete(localId)))
}

export function getMetaValue(key) {
  return withTransaction([STORES.META], 'readonly', async ({ meta }) => {
    const entry = await withRequest(meta.get(key))
    return entry?.value
  })
}

export function setMetaValue(key, value) {
  return withTransaction([STORES.META], 'readwrite', ({ meta }) => withRequest(meta.put({ key, value })))
}

export function removeMetaValue(key) {
  return withTransaction([STORES.META], 'readwrite', ({ meta }) => withRequest(meta.delete(key)))
}

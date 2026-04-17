/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 3,
  })
)

registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'assets-cache',
  })
)

const BG_SYNC_TAG = 'cptm-sync'

async function notifyClientsToSync() {
  const openClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })

  for (const client of openClients) {
    client.postMessage({ type: 'CPTM_SYNC_REQUEST', source: 'service-worker' })
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag !== BG_SYNC_TAG) return
  event.waitUntil(notifyClientsToSync())
})

self.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return
  if (event.data.type === 'CPTM_SYNC_NOW') {
    event.waitUntil(notifyClientsToSync())
  }
})

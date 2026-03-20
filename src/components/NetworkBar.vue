<template>
  <div class="network-bar" :class="{ offline: !isOnline }" role="status" aria-live="polite">
    <svg v-if="!isOnline" viewBox="0 0 24 24" fill="white" width="14" height="14" aria-hidden="true">
      <path d="M1 1l22 22-1.41 1.41-2.38-2.38C17.48 23.61 14.86 24 12 24 5.93 24 .9 20.04.9 15.12c0-2.81 1.52-5.3 3.9-6.98L1.41 5.59 1 1zm12 4c2.21 0 4.23.76 5.83 2.03l-1.44 1.44A6 6 0 0 0 13 7.07V5zM12 8.73l2.05 2.05A2.5 2.5 0 0 0 12 13.73V8.73zM12 17a5 5 0 0 1-3.54-1.46l-1.41 1.41A7 7 0 0 0 12 19a7 7 0 0 0 6.93-6H16.9A5 5 0 0 1 12 17z"/>
    </svg>
    <span>{{ isOnline ? 'Online' : 'Offline — dados salvos localmente' }}</span>
  </div>
</template>

<script setup>
import { useNetwork } from '@/composables/useNetwork'
const { isOnline } = useNetwork()
</script>

<style scoped>
.network-bar {
  display: none; /* visible only when offline */
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px var(--s-md);
  background: var(--verde-principal);
  color: white;
  font-size: var(--txt-xs);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: center;
}
.network-bar.offline {
  display: flex;
  background: var(--status-rascunho);
}
</style>

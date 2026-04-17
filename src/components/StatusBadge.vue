<template>
  <span class="badge" :class="`badge--${status}`">
    <span class="badge__dot" aria-hidden="true"></span>
    {{ LABELS[status] || status }}
  </span>
</template>

<script setup>
const LABELS = {
  rascunho: 'Rascunho',
  pendente_sync: 'Aguardando sync',
  sincronizando: 'Sincronizando',
  sincronizado: 'Sincronizado',
  erro_sync: 'Erro de sync',
}

defineProps({
  status: { type: String, required: true }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.9;
}

.badge--rascunho {
  background: #fff3e0;
  color: #e65100;
}

.badge--pendente_sync {
  background: #fff8e1;
  color: #f57f17;
}

.badge--sincronizando {
  background: #e3f2fd;
  color: #1565c0;
}

.badge--sincronizado {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge--erro_sync {
  background: #ffebee;
  color: #c62828;
}
</style>
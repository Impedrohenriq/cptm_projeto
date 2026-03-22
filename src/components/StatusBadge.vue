<template>
  <span class="badge" :class="`badge--${status}`">
    {{ LABELS[status] || status }}
  </span>
</template>

<script setup>
const LABELS = {
  rascunho: 'Rascunho',
  pendente_sync: 'Pendente Sync',
  sincronizando: 'Sincronizando',
  sincronizado: 'Sincronizado',
  erro_sync: 'Erro de Sync',
}

defineProps({
  status: { type: String, required: true }
})
</script>

<style scoped>
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
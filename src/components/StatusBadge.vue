<template>
  <span class="badge" :class="`badge--${status}`">
    {{ LABELS[status] || status }}
  </span>
</template>

<script setup>
const LABELS = {
  rascunho: 'Rascunho',
  enviada:  'Enviada',
  analisada: 'Analisada'
}
defineProps({
  status: { type: String, required: true }
})
</script>

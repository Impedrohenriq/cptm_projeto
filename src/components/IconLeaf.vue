<template>
  <!-- Ícone de folha (ambiental) usado em múltiplas telas -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C12 3 10 2 8 2 5 2 2 5 2 8c0 2.5 1.5 4.5 3.5 5.5C6.5 15 7 16 7 17c0 .5-.1 1-.3 1.5L8 19c.5-1 .7-2 .7-3 0-1.5-.7-2.8-1.8-3.8C8 10 10 8 17 8z"/>
  </svg>
</template>

<script setup>
defineProps({
  size:  { type: [Number, String], default: 24 },
  color: { type: String, default: 'white' }
})
</script>

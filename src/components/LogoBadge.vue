<template>
  <div class="logo-badge" :style="{ width: size + 'px', height: size + 'px' }" aria-hidden="true">
    <IconLeaf :size="Math.round(size * 0.52)" color="white" />
  </div>
</template>

<script setup>
import IconLeaf from './IconLeaf.vue'
defineProps({
  size: { type: Number, default: 28 }
})
</script>

<style scoped>
.logo-badge {
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>

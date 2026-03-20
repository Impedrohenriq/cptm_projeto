<template>
  <NetworkBar />
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'page'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<script setup>
import NetworkBar from '@/components/NetworkBar.vue'
</script>

<style>
/* Page transition — default slide up */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.page-enter-from { opacity: 0; transform: translateY(20px); }
.page-leave-to   { opacity: 0; transform: translateY(-12px); }

/* Fade (splash → login) */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<template>
  <div class="app-shell" :class="{ 'app-shell--with-nav': shouldShowNav }">
    <NetworkBar />
    <RouterView v-slot="{ Component, route }">
      <Transition :name="route.meta.transition || 'page'">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    <BottomNav v-if="shouldShowNav" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NetworkBar from '@/components/NetworkBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import { useAuthStore } from '@/stores/auth'
import { useInspecoesStore } from '@/stores/inspecoes'

const store = useInspecoesStore()
const auth = useAuthStore()
const route = useRoute()

const shouldShowNav = computed(() => {
  return auth.isAuthenticated && route.name !== 'splash' && route.meta?.showBottomNav === true
})

onMounted(async () => {
  await store.initialize()
  if (store.browserOnline && store.apiDisponivel) {
    await store.carregarDoServidor()
  }
})
</script>

<style>
.app-shell {
  min-height: 100dvh;
  position: relative; /* anchor the absolutely-positioned leaving page */
}

.app-shell--with-nav {
  padding-bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 8px);
}

/*
  Both enter + leave animate simultaneously (no mode="out-in").
  The leaving page is absolutely positioned so the entering page
  mounts immediately — permanently fixes blank-screen navigation.
*/
.page-enter-active {
  animation: page-in 0.24s ease both;
  position: relative;
  z-index: 1;
}
.page-leave-active {
  animation: page-out 0.2s ease both;
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
@keyframes page-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes page-out {
  from { opacity: 1; transform: translateY(0);     }
  to   { opacity: 0; transform: translateY(-10px); }
}

.fade-enter-active { animation: fade-in  0.3s ease both; }
.fade-leave-active {
  animation: fade-out 0.25s ease both;
  position: absolute;
  inset: 0;
  pointer-events: none;
}
@keyframes fade-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
</style>
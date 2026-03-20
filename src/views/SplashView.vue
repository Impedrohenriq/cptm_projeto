<template>
  <main class="splash" role="main" aria-label="Tela de carregamento do CPTM Ambiental">

    <!-- Decorative background circles -->
    <div class="splash__circle splash__circle--top" aria-hidden="true"></div>
    <div class="splash__circle splash__circle--bottom" aria-hidden="true"></div>

    <!-- Center content -->
    <div class="splash__content">
      <div class="splash__logo-wrap">
        <!-- CPTM logotype -->
        <svg class="splash__logo" viewBox="0 0 280 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logotipo CPTM">
          <rect x="0" y="0" width="280" height="90" rx="8" fill="white" opacity="0.12"/>
          <text x="140" y="62" font-family="'Segoe UI', Arial, sans-serif" font-size="56" font-weight="900" fill="white" text-anchor="middle" letter-spacing="6">CPTM</text>
          <rect x="20" y="72" width="240" height="3" rx="1.5" fill="rgba(255,255,255,0.35)"/>
        </svg>

        <!-- Green environmental badge -->
        <div class="splash__badge" aria-hidden="true">
          <IconLeaf :size="22" color="white" />
        </div>
      </div>

      <p class="splash__title">Controle Ambiental</p>
      <p class="splash__subtitle">Companhia Paulista de Trens Metropolitanos</p>
      <div class="splash__divider" aria-hidden="true"></div>
    </div>

    <!-- Loading footer -->
    <footer class="splash__footer" aria-live="polite" aria-label="Carregando recursos">
      <p class="splash__loading-text">Carregando recursos offline...</p>
      <div
        class="splash__progress-wrap"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Progresso de carregamento"
      >
        <div class="splash__progress-bar"></div>
      </div>
      <p class="splash__version">v1.0.0 &bull; {{ year }}</p>
    </footer>

  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import IconLeaf from '@/components/IconLeaf.vue'

const router = useRouter()
const auth = useAuthStore()
const year = new Date().getFullYear()

onMounted(() => {
  if ('serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
      // Em modo de desenvolvimento, desregistra service workers antigos de builds
      // anteriores que podem estar servindo assets desatualizados em cache
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister())
      })
    }
    // Em produção, o vite-plugin-pwa injeta o registerSW.js automaticamente no HTML
    // não precisamos registrar manualmente aqui
  }

  setTimeout(() => {
    if (auth.isAuthenticated) {
      if (auth.isGestor) {
        router.replace('/gestor')
      } else {
        router.replace(auth.needsOnboarding ? '/onboarding' : '/dashboard')
      }
    } else {
      router.replace('/login')
    }
  }, 2800)
})
</script>

<style scoped>
.splash {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  background: linear-gradient(160deg, #C8102E 0%, #9B0B22 60%, #6B0718 100%);
  position: relative;
  overflow: hidden;
}

/* Decorative circles */
.splash__circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.04);
  pointer-events: none;
}
.splash__circle--top {
  width: 320px;
  height: 320px;
  top: -120px;
  right: -80px;
}
.splash__circle--bottom {
  width: 260px;
  height: 260px;
  bottom: -100px;
  left: -60px;
}

/* Content */
.splash__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  animation: splashFadeIn 0.8s ease-out both;
  z-index: 1;
}

@keyframes splashFadeIn {
  0%   { opacity: 0; transform: scale(0.88); }
  60%  { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

/* Logo */
.splash__logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.splash__logo {
  width: min(200px, 72vw);
  height: auto;
}

/* Badge */
.splash__badge {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2E7D32, #4CAF50);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,.30);
  border: 3px solid #C8102E;
  animation: splashBadgePop 0.5s 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes splashBadgePop {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}

.splash__title {
  font-size: clamp(1rem, 4vw, 1.1rem);
  font-weight: 700;
  color: rgba(255,255,255,.95);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-top: 28px;
  text-align: center;
}
.splash__subtitle {
  font-size: clamp(0.7rem, 3vw, 0.8rem);
  font-weight: 400;
  color: rgba(255,255,255,.65);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 6px;
  text-align: center;
  padding: 0 var(--s-lg);
}
.splash__divider {
  width: 48px;
  height: 3px;
  background: rgba(255,255,255,.30);
  border-radius: 2px;
  margin: 20px auto 0;
}

/* Footer */
.splash__footer {
  position: absolute;
  bottom: calc(48px + var(--safe-bottom));
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1;
  animation: fadeIn 0.5s 0.8s ease both;
}
.splash__loading-text {
  font-size: var(--txt-xs);
  color: rgba(255,255,255,.55);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.splash__progress-wrap {
  width: min(160px, 50vw);
  height: 4px;
  background: rgba(255,255,255,.18);
  border-radius: 2px;
  overflow: hidden;
}
.splash__progress-bar {
  height: 100%;
  background: rgba(255,255,255,.80);
  border-radius: 2px;
  animation: splashLoading 2.2s ease-in-out both;
}
@keyframes splashLoading {
  0%   { width: 0%; }
  30%  { width: 40%; }
  70%  { width: 75%; }
  100% { width: 100%; }
}
.splash__version {
  font-size: 0.7rem;
  color: rgba(255,255,255,.35);
}
</style>

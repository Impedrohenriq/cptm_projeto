<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-[120] flex justify-center px-3"
    role="navigation"
    aria-label="Navegação principal"
  >
    <!-- Wrapper pushes content above the home indicator on iOS -->
    <div class="w-full max-w-[480px]">

      <!-- Glass pill container -->
      <div
        class="
          flex h-[66px] items-center gap-0.5
          rounded-[28px]
          border border-white/50
          bg-white/88
          px-1.5
          shadow-[0_-4px_24px_rgba(0,0,0,0.07),0_8px_36px_rgba(0,0,0,0.14)]
          backdrop-blur-2xl
        "
      >
        <button
          v-for="item in navItems"
          :key="item.key"
          class="
            relative flex min-w-0 flex-1 flex-col items-center justify-center
            gap-[3px] rounded-[22px] py-2
            select-none transition-transform duration-100 active:scale-[0.93]
          "
          style="-webkit-tap-highlight-color: transparent"
          :aria-label="item.label"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click="goTo(item.to)"
        >
          <!-- Active pill (animated in/out) -->
          <Transition name="pill">
            <span
              v-if="isActive(item)"
              class="
                absolute inset-x-[3px] top-[3px] bottom-[3px]
                rounded-[19px]
                bg-[var(--cptm-vermelho)]
                shadow-[0_4px_16px_rgba(200,16,46,0.44)]
              "
              aria-hidden="true"
            />
          </Transition>

          <!-- Icon -->
          <span
            class="relative z-10 flex h-[22px] w-[22px] items-center justify-center transition-all duration-200"
            :class="isActive(item) ? 'scale-[1.14] text-white' : 'text-slate-400'"
            aria-hidden="true"
          >
            <!-- Guia / Onboarding — Book with sparkle -->
            <svg v-if="item.key === 'onboarding'" viewBox="0 0 24 24" fill="currentColor" class="h-full w-full">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
            </svg>

            <!-- Painel / Dashboard — Grid squares -->
            <svg v-else-if="item.key === 'dashboard'" viewBox="0 0 24 24" fill="currentColor" class="h-full w-full">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>

            <!-- Novo / Formulário — Plus in rounded square -->
            <svg v-else-if="item.key === 'formulario'" viewBox="0 0 24 24" fill="currentColor" class="h-full w-full">
              <path d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4v2zm2-9H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
            </svg>

            <!-- Gestor — Calendar with lines -->
            <svg v-else-if="item.key === 'gestor'" viewBox="0 0 24 24" fill="currentColor" class="h-full w-full">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>

            <!-- Conta / Perfil — Person silhouette -->
            <svg v-else viewBox="0 0 24 24" fill="currentColor" class="h-full w-full">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </span>

          <!-- Label -->
          <span
            class="relative z-10 select-none text-[9px] font-bold uppercase tracking-[0.08em] leading-none transition-colors duration-200"
            :class="isActive(item) ? 'text-white' : 'text-slate-400'"
          >
            {{ item.label }}
          </span>
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const navItems = computed(() => {
  // Gestor: Guia | Painel | Gestor | Novo | Conta
  if (auth.isGestor) {
    return [
      { key: 'onboarding', label: 'Guia',   to: '/onboarding' },
      { key: 'dashboard',  label: 'Painel',  to: '/dashboard'  },
      { key: 'gestor',     label: 'Gestor',  to: '/gestor'     },
      { key: 'formulario', label: 'Novo',    to: '/formulario' },
      { key: 'perfil',     label: 'Conta',   to: '/conta'      },
    ]
  }
  // Funcionario: Guia | Painel | Novo | Conta  (sem Gestor)
  return [
    { key: 'onboarding', label: 'Guia',   to: '/onboarding' },
    { key: 'dashboard',  label: 'Painel', to: '/dashboard'  },
    { key: 'formulario', label: 'Novo',   to: '/formulario' },
    { key: 'perfil',     label: 'Conta',  to: '/conta'      },
  ]
})

function isActive(item) {
  if (item.to === '/dashboard') return route.path === '/dashboard'
  if (item.to === '/gestor')    return route.path === '/gestor'
  if (item.to === '/conta')     return route.path === '/conta'
  return route.path.startsWith(item.to)
}

function goTo(path) {
  if (path === '/formulario') {
    // Already editing/filling a form — don't disturb
    if (route.path === '/formulario') return
    // Navigate to clean /formulario then force a full reload so the form
    // always renders fresh (no stale component state)
    router.push('/formulario').then(() => window.location.reload())
    return
  }
  if (route.path !== path) router.push(path)
}
</script>

<style scoped>
/* Push content above the home indicator on iOS */
nav {
  padding-bottom: env(safe-area-inset-bottom, 10px);
}

/* Pill enter / leave animation */
.pill-enter-active { animation: pill-pop-in  0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.pill-leave-active { animation: pill-pop-out 0.15s ease both; }

@keyframes pill-pop-in  {
  from { opacity: 0; transform: scale(0.82); }
  to   { opacity: 1; transform: scale(1);    }
}
@keyframes pill-pop-out {
  from { opacity: 1; transform: scale(1);    }
  to   { opacity: 0; transform: scale(0.88); }
}
</style>


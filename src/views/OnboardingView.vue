<template>
  <main class="onboarding" role="main">

    <!-- Top bar -->
    <div class="onboarding__topbar">
      <div class="onboarding__logo" aria-label="CPTM Ambiental">
        <span>CPTM</span>
        <LogoBadge :size="22" />
      </div>
      <button
        class="onboarding__skip"
        :class="{ hidden: current === total - 1 }"
        aria-label="Pular introdução e ir ao painel"
        @click="finish"
      >
        Pular
      </button>
    </div>

    <!-- Carousel -->
    <div
      ref="carouselEl"
      class="onboarding__carousel"
      role="region"
      aria-label="Introdução ao sistema"
      aria-roledescription="carrossel"
    >
      <div
        class="onboarding__track"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <!-- Slide 1 -->
        <article class="onboarding__slide slide--1" role="group" aria-roledescription="slide" :aria-label="`Passo 1 de ${total}: Como começar`">
          <div class="slide__illus illus--red" aria-hidden="true">
            <svg class="slide__icon-main" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="16" y="20" width="64" height="60" rx="6" fill="#C8102E" opacity="0.15"/>
              <rect x="16" y="20" width="64" height="60" rx="6" stroke="#C8102E" stroke-width="3" fill="none"/>
              <rect x="36" y="12" width="24" height="16" rx="4" fill="#C8102E"/>
              <rect x="40" y="8" width="16" height="10" rx="5" fill="#9B0B22"/>
              <line x1="28" y1="46" x2="68" y2="46" stroke="#C8102E" stroke-width="3" stroke-linecap="round"/>
              <line x1="28" y1="56" x2="60" y2="56" stroke="#C8102E" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
              <line x1="28" y1="65" x2="55" y2="65" stroke="#C8102E" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
            </svg>
            <div class="slide__badge slide__badge--red">
              <svg viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          </div>
          <p class="slide__step" aria-hidden="true">Passo 1 de {{ total }}</p>
          <h2 class="slide__title">Como iniciar uma inspeção</h2>
          <p class="slide__desc">No painel, toque em Nova Inspeção e preencha as etapas na ordem. A barra superior mostra seu progresso em tempo real.</p>
          <ul class="slide__checklist" aria-label="Checklist para iniciar">
            <li>Preencha os dados obrigatórios de cada etapa.</li>
            <li>Use os botões Próxima Etapa e Voltar para revisar.</li>
            <li>Você pode sair e continuar depois sem perder o rascunho.</li>
          </ul>
        </article>

        <!-- Slide 2 -->
        <article class="onboarding__slide slide--2" role="group" aria-roledescription="slide" :aria-label="`Passo 2 de ${total}: Evidências e offline`">
          <div class="slide__illus illus--green" aria-hidden="true">
            <svg class="slide__icon-main" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="30" width="76" height="52" rx="6" fill="#2E7D32" opacity="0.15"/>
              <rect x="10" y="30" width="76" height="52" rx="6" stroke="#2E7D32" stroke-width="3" fill="none"/>
              <path d="M30 30 L30 82" stroke="#2E7D32" stroke-width="1.5" opacity="0.3"/>
              <path d="M55 30 L55 82" stroke="#2E7D32" stroke-width="1.5" opacity="0.3"/>
              <path d="M10 52 L86 52" stroke="#2E7D32" stroke-width="1.5" opacity="0.3"/>
              <path d="M10 67 L86 67" stroke="#2E7D32" stroke-width="1.5" opacity="0.3"/>
              <path d="M48 12 C42 12 36 17 36 24 C36 33 48 44 48 44 C48 44 60 33 60 24 C60 17 54 12 48 12Z" fill="#2E7D32"/>
              <circle cx="48" cy="24" r="5" fill="white"/>
            </svg>
            <div class="slide__badge slide__badge--green">
              <svg viewBox="0 0 24 24" fill="white"><path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/></svg>
            </div>
          </div>
          <p class="slide__step" aria-hidden="true">Passo 2 de {{ total }}</p>
          <h2 class="slide__title">Registre evidências com segurança</h2>
          <p class="slide__desc">Anexe fotos e use GPS quando necessário. Mesmo sem internet, o app salva localmente e mantém os dados prontos para sincronizar.</p>
          <ul class="slide__checklist" aria-label="Checklist de evidências">
            <li>Tire fotos para comprovar a condição no local.</li>
            <li>Preencha latitude e longitude com GPS quando aplicável.</li>
            <li>Se ficar offline, continue normalmente: o rascunho permanece salvo.</li>
          </ul>
        </article>

        <!-- Slide 3 -->
        <article class="onboarding__slide slide--3" role="group" aria-roledescription="slide" :aria-label="`Passo 3 de ${total}: Enviar e acompanhar`">
          <div class="slide__illus illus--blue" aria-hidden="true">
            <svg class="slide__icon-main" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48 8 L80 22 L80 50 C80 68 64 80 48 86 C32 80 16 68 16 50 L16 22 Z" fill="#1565C0" opacity="0.15"/>
              <path d="M48 8 L80 22 L80 50 C80 68 64 80 48 86 C32 80 16 68 16 50 L16 22 Z" stroke="#1565C0" stroke-width="3" fill="none"/>
              <path d="M55 36 C44 38 41.9 44.17 39.82 49.34 L41.71 50 L42.71 47.7 A4.49 4.49 0 0 0 44 48 C55 48 58 31 58 31 C57 33 50 33 50 33 C48 31 46 30 44 30 C41 30 38 33 38 36 C38 38.5 39.5 40.5 41.5 41.5 C42.5 43 43 44 43 45 C43 45.5 42.9 46 42.7 46.5 L44 47 C44.5 46 44.7 45 44.7 44 C44.7 42.5 44 41.2 42.9 40.2 C44 38 46 36 55 36Z" fill="#1565C0"/>
            </svg>
            <div class="slide__badge slide__badge--blue">
              <svg viewBox="0 0 24 24" fill="white"><path d="M12 1L15.09 7.26L22 8.27L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.27L8.91 7.26L12 1Z"/></svg>
            </div>
          </div>
          <p class="slide__step" aria-hidden="true">Passo 3 de {{ total }}</p>
          <h2 class="slide__title">Envio e acompanhamento da inspeção</h2>
          <p class="slide__desc">Ao enviar, o sistema confirma no backend quando a API estiver disponível. No painel, acompanhe o status de cada item.</p>
          <ul class="slide__checklist" aria-label="Checklist de envio">
            <li>Finalize e toque em Enviar Inspeção.</li>
            <li>Se a API estiver indisponível, o item fica em fila local.</li>
            <li>No dashboard, use sincronização manual quando necessário.</li>
          </ul>
        </article>
      </div>
    </div>

    <!-- Footer: dots + navigation -->
    <footer class="onboarding__footer">

      <!-- Dots -->
      <div class="onboarding__dots" role="tablist" aria-label="Progresso do onboarding">
        <button
          v-for="(_, i) in total"
          :key="i"
          class="dot"
          :class="{ ativo: i === current }"
          role="tab"
          :aria-selected="i === current"
          :aria-label="`Passo ${i + 1}`"
          @click="goTo(i)"
        ></button>
      </div>

      <!-- Navigation buttons -->
      <div class="onboarding__nav">
        <!-- Previous -->
        <button
          class="onboarding__nav-prev"
          :class="{ invisible: current === 0 }"
          aria-label="Voltar ao passo anterior"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>

        <!-- Next (slides 1-2) -->
        <button
          v-if="current < total - 1"
          class="btn btn--primario onboarding__nav-next"
          @click="next"
        >
          Próximo
          <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </button>

        <!-- Go to Dashboard (last slide) -->
        <button
          v-else
          class="btn btn--verde onboarding__nav-next"
          @click="finish"
        >
          <svg viewBox="0 0 24 24" fill="white" width="22" height="22" aria-hidden="true"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
          Ir para o Painel
        </button>
      </div>

    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSwipe } from '@/composables/useSwipe'
import LogoBadge from '@/components/LogoBadge.vue'

const router  = useRouter()
const auth    = useAuthStore()
const total   = 3
const current = ref(0)
const carouselEl = ref(null)

function goTo(i) { current.value = Math.max(0, Math.min(i, total - 1)) }
function next()  { goTo(current.value + 1) }
function prev()  { goTo(current.value - 1) }
function finish() {
  auth.completeOnboarding()
  router.replace('/dashboard')
}

const { bind, unbind } = useSwipe(next, prev)

onMounted(() => bind(carouselEl.value))
onUnmounted(() => unbind())
</script>

<style scoped>
.onboarding {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--cptm-branco);
  overflow: hidden;
}

/* Top bar */
.onboarding__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(16px + var(--safe-top)) var(--s-lg) 16px;
  position: relative;
  z-index: 10;
}
.onboarding__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.onboarding__logo span {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--cptm-vermelho);
  letter-spacing: 0.1em;
}
.onboarding__skip {
  font-size: var(--txt-sm);
  color: var(--cptm-cinza-claro);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--s-sm) var(--s-md);
  border-radius: var(--r-sm);
  font-weight: 500;
  transition: color var(--t-fast), background-color var(--t-fast);
  min-height: auto;
  width: auto;
}
.onboarding__skip:hover { color: var(--cptm-cinza-medio); background: var(--cptm-cinza-fundo); }
.onboarding__skip.hidden { visibility: hidden; pointer-events: none; }

/* Carousel */
.onboarding__carousel {
  flex: 1;
  overflow: hidden;
  position: relative;
  touch-action: pan-y;
}
.onboarding__track {
  display: flex;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

/* Slide */
.onboarding__slide {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--s-xl);
  text-align: center;
  gap: var(--s-lg);
}

/* Illustration circle */
.slide__illus {
  width: min(200px, 56vw);
  height: min(200px, 56vw);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}
.illus--red  { background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%); }
.illus--green{ background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); }
.illus--blue { background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); }

.slide__icon-main { width: min(88px, 24vw); height: min(88px, 24vw); }

/* Badge overlay */
.slide__badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}
.slide__badge svg { width: 22px; height: 22px; }
.slide__badge--red   { background: var(--cptm-vermelho); }
.slide__badge--green { background: var(--verde-principal); }
.slide__badge--blue  { background: #1565C0; }

.slide__step {
  font-size: var(--txt-xs);
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--cptm-cinza-claro);
}
.slide__title {
  font-size: clamp(1.1rem, 5vw, var(--txt-xl));
  font-weight: 800;
  color: var(--cptm-cinza-escuro);
  line-height: 1.3;
  max-width: 320px;
}
.slide__desc {
  font-size: var(--txt-base);
  color: var(--cptm-cinza-medio);
  line-height: 1.65;
  max-width: 300px;
}

.slide__checklist {
  list-style: none;
  margin: 0;
  padding: 0;
  width: min(320px, 100%);
  display: grid;
  gap: 8px;
  text-align: left;
}

.slide__checklist li {
  position: relative;
  padding-left: 22px;
  font-size: var(--txt-sm);
  line-height: 1.45;
  color: var(--cptm-cinza-medio);
}

.slide__checklist li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.42em;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--cptm-vermelho);
  opacity: 0.85;
}

/* Footer */
.onboarding__footer {
  padding: var(--s-lg) var(--s-lg) calc(40px + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-lg);
  background: var(--cptm-branco);
}

/* Dots */
.onboarding__dots {
  display: flex;
  gap: 10px;
  align-items: center;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--r-full);
  background: var(--cptm-cinza-borda);
  border: none;
  cursor: pointer;
  transition: width 0.3s ease, background-color 0.3s ease;
  padding: 0;
  min-height: auto;
}
.dot.ativo {
  width: 28px;
  background: var(--cptm-vermelho);
}

/* Nav */
.onboarding__nav {
  display: flex;
  gap: var(--s-sm);
  width: 100%;
  max-width: 400px;
}
.onboarding__nav-prev {
  width: 56px;
  min-width: 56px;
  min-height: var(--h-btn);
  background: var(--cptm-cinza-fundo);
  border: 2px solid var(--cptm-cinza-borda);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--cptm-cinza-medio);
  transition: background-color var(--t-fast);
  flex-shrink: 0;
}
.onboarding__nav-prev:hover { background: var(--cptm-cinza-borda); }
.onboarding__nav-prev svg   { width: 24px; height: 24px; }
.onboarding__nav-prev.invisible { visibility: hidden; pointer-events: none; }

.onboarding__nav-next { flex: 1; }
</style>

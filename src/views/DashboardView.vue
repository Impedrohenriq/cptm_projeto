<template>
  <div class="dashboard" role="main">

    <!-- ---- Header ---- -->
    <header class="dashboard__header">
      <!-- Top row: logo + actions -->
      <div class="dashboard__top">
        <div class="dashboard__logo" aria-label="CPTM Ambiental">
          <span class="dashboard__logo-text">CPTM</span>
          <LogoBadge :size="26" />
        </div>
        <div class="dashboard__actions">
          <!-- Notifications -->
          <button class="btn-circle btn-circle--ghost" aria-label="Notificações (3 novas)" style="position:relative">
            <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span class="notif-dot" aria-hidden="true">3</span>
          </button>
          <!-- Profile avatar -->
          <button class="btn-circle btn-circle--ghost" aria-label="Perfil do usuário">
            <span class="avatar-initials" aria-hidden="true">{{ initials }}</span>
          </button>
        </div>
      </div>

      <!-- Greeting -->
      <div class="dashboard__greeting">
        <p class="dashboard__greeting-text">{{ saudacao }}</p>
        <h1 class="dashboard__user-name">{{ user?.name || 'Inspetor' }}</h1>
        <p class="dashboard__user-role">{{ user?.role }} &bull; {{ user?.line }}</p>
      </div>
    </header>

    <!-- ---- Content ---- -->
    <div class="dashboard__content">

      <!-- Summary cards -->
      <div class="dashboard__summary" role="region" aria-label="Resumo de inspeções">
        <div class="card-resumo card-resumo--total">
          <span class="card-resumo__num">{{ total }}</span>
          <span class="card-resumo__label">Total</span>
        </div>
        <div class="card-resumo card-resumo--enviadas">
          <span class="card-resumo__num">{{ enviadas }}</span>
          <span class="card-resumo__label">Enviadas</span>
        </div>
        <div class="card-resumo card-resumo--rascunhos">
          <span class="card-resumo__num">{{ rascunhos }}</span>
          <span class="card-resumo__label">Rascunhos</span>
        </div>
      </div>

      <!-- New inspection CTA -->
      <button
        class="dashboard__new-btn"
        aria-label="Iniciar nova inspeção ambiental"
        @click="$router.push('/formulario')"
      >
        <div class="new-btn__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </div>
        <div class="new-btn__text">
          <span class="new-btn__title">+ Nova Inspeção</span>
          <span class="new-btn__sub">Registrar ocorrência ambiental</span>
        </div>
      </button>

      <!-- Recent inspections list -->
      <section aria-labelledby="titulo-recentes">
        <div class="section-header">
          <h2 id="titulo-recentes" class="section-title">Inspeções Recentes</h2>
          <button class="section-link" aria-label="Ver todas as inspeções">Ver todas</button>
        </div>

        <div class="inspection-list" role="list">

          <div v-if="recentes.length === 0" class="lista-vazia">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.97 16.03 1 13.67 1c-1.28 0-2.43.53-3.27 1.39L9 3.8l-1.4-1.41C6.77 1.53 5.62 1 4.33 1 1.97 1 0 2.97 0 5.33c0 1.11.47 2.09 1.2 2.83L9 16l5.14-5.14-1.06-1.06L9 14.17 2.34 7.51c-.45-.45-.67-1.06-.67-1.67C1.67 3.83 2.84 2.67 4.33 2.67c.6 0 1.17.2 1.6.63L9 6.37l3.07-3.07c.43-.43 1-.63 1.6-.63C14.96 2.67 16 3.72 16 5c0 .61-.22 1.18-.6 1.6l-.67.67 5.28 5.27V6z"/></svg>
            <p>Nenhuma inspeção registrada ainda.</p>
          </div>

          <button
            v-for="ins in recentes"
            :key="ins.id"
            class="card-inspecao"
            :class="`card-inspecao--${ins.status}`"
            role="listitem"
            :aria-label="`FDC-EEA.EF – ${ins.nomeContratada || 'N/I'} em ${ins.estacao || ''}, ${ins.status}`"
            @click="$router.push('/formulario')"
          >
            <!-- Icon -->
            <div class="card-ins__icon icone-efluente" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"/></svg>
            </div>

            <!-- Body -->
            <div class="card-ins__body">
              <p class="card-ins__title">{{ ins.nomeContratada || 'FDC-EEA.EF' }}</p>
              <p class="card-ins__local">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {{ ins.estacao || ins.nomeLocal || '—' }} · {{ ins.linha || '—' }}
              </p>
              <div class="card-ins__footer">
                <StatusBadge :status="ins.status" />
                <span class="card-ins__date">{{ formatDate(ins.updatedAt) }}</span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="card-ins__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
            </div>
          </button>

        </div><!-- /list -->
      </section>
    </div><!-- /content -->

  </div><!-- /dashboard -->

  <!-- Bottom navigation -->
  <BottomNav active="dashboard" />
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useInspecoesStore } from '@/stores/inspecoes'
import { useSaudacao } from '@/composables/useSaudacao'
import LogoBadge from '@/components/LogoBadge.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import BottomNav from '@/components/BottomNav.vue'

const auth = useAuthStore()
const store = useInspecoesStore()
const { saudacao } = useSaudacao()

const user    = computed(() => auth.currentUser)
const initials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.split(' ').map(w => w[0]).slice(0, 2).join('')
})

const total    = computed(() => store.total)
const enviadas = computed(() => store.enviadas)
const rascunhos = computed(() => store.rascunhos)
const recentes = computed(() => store.recentes)

function formatDate(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000) {
    return 'Hoje, ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
  if (diff < 172800000) return 'Ontem, ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ', ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.dashboard {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--cptm-cinza-fundo);
  padding-bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 16px);
}

/* ---- Header ---- */
.dashboard__header {
  background: linear-gradient(150deg, #C8102E 0%, #9B0B22 100%);
  padding: calc(48px + var(--safe-top)) var(--s-lg) 64px;
  position: relative;
  overflow: hidden;
}
.dashboard__header::before {
  content: '';
  position: absolute;
  top: -60px; right: -40px;
  width: 220px; height: 220px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  pointer-events: none;
}
.dashboard__header::after {
  content: '';
  position: absolute;
  bottom: -40px; left: 0; right: 0;
  height: 80px;
  background: var(--cptm-cinza-fundo);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

.dashboard__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--s-lg);
  position: relative;
  z-index: 1;
}
.dashboard__logo { display: flex; align-items: center; gap: 8px; }
.dashboard__logo-text {
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.1em;
}
.dashboard__actions { display: flex; gap: var(--s-sm); align-items: center; }

/* Icon buttons in header */
.btn-circle {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background-color var(--t-fast);
  -webkit-tap-highlight-color: transparent;
}
.btn-circle--ghost {
  background: rgba(255,255,255,.18);
}
.btn-circle--ghost:hover { background: rgba(255,255,255,.28); }
.btn-circle svg { width: 22px; height: 22px; }

.notif-dot {
  position: absolute;
  top: 4px; right: 4px;
  width: 18px; height: 18px;
  background: #FF8F00;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  color: white;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}

.avatar-initials {
  font-size: 0.875rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
}

/* Greeting */
.dashboard__greeting { position: relative; z-index: 1; }
.dashboard__greeting-text {
  font-size: var(--txt-sm);
  color: rgba(255,255,255,.75);
  margin-bottom: 2px;
}
.dashboard__user-name {
  font-size: clamp(1.5rem, 6vw, var(--txt-2xl));
  font-weight: 800;
  color: white;
  line-height: 1.2;
}
.dashboard__user-role {
  font-size: var(--txt-sm);
  color: rgba(255,255,255,.65);
  margin-top: 4px;
}

/* ---- Content ---- */
.dashboard__content {
  flex: 1;
  padding: 0 var(--s-md);
  margin-top: -20px;
  position: relative;
  z-index: 1;
}

/* Summary cards */
.dashboard__summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s-sm);
  margin-bottom: var(--s-lg);
}
.card-resumo {
  background: var(--cptm-branco);
  border-radius: var(--r-lg);
  padding: var(--s-md) var(--s-sm);
  text-align: center;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.card-resumo__num {
  font-size: clamp(1.5rem, 6vw, var(--txt-2xl));
  font-weight: 900; line-height: 1;
}
.card-resumo__label {
  font-size: clamp(0.6rem, 2vw, 0.68rem);
  color: var(--cptm-cinza-claro);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
}
.card-resumo--total    .card-resumo__num { color: var(--cptm-cinza-escuro); }
.card-resumo--enviadas .card-resumo__num { color: var(--status-enviada); }
.card-resumo--rascunhos .card-resumo__num { color: var(--status-rascunho); }

/* New inspection button */
.dashboard__new-btn {
  background: linear-gradient(135deg, var(--cptm-vermelho) 0%, var(--cptm-vermelho-escuro) 100%);
  border: none;
  border-radius: var(--r-xl);
  padding: var(--s-lg) var(--s-xl);
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: var(--s-md);
  cursor: pointer;
  box-shadow: var(--shadow-fab);
  transition: transform var(--t-fast), box-shadow var(--t-fast);
  margin-bottom: var(--s-lg);
  -webkit-tap-highlight-color: transparent;
  animation: pulse 2.5s ease-in-out infinite;
}
.dashboard__new-btn:active { transform: scale(0.97); animation: none; }
.dashboard__new-btn:hover  { box-shadow: 0 8px 28px rgba(200,16,46,.50); }

.new-btn__icon {
  width: 52px; height: 52px;
  background: rgba(255,255,255,.20);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.new-btn__icon svg { width: 28px; height: 28px; }
.new-btn__text { display: flex; flex-direction: column; align-items: flex-start; }
.new-btn__title {
  font-size: clamp(1rem, 4vw, var(--txt-lg));
  font-weight: 800; color: white; line-height: 1.2;
}
.new-btn__sub { font-size: var(--txt-xs); color: rgba(255,255,255,.75); }

/* Section header */
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--s-md);
}
.section-title { font-size: var(--txt-base); font-weight: 700; color: var(--cptm-cinza-escuro); }
.section-link {
  font-size: var(--txt-sm); color: var(--cptm-vermelho); font-weight: 600;
  background: none; border: none; cursor: pointer; min-height: auto; width: auto; padding: 0;
}

/* Inspection list */
.inspection-list { display: flex; flex-direction: column; gap: var(--s-sm); }

.card-inspecao {
  background: var(--cptm-branco);
  border-radius: var(--r-lg);
  padding: var(--s-md);
  box-shadow: var(--shadow-sm);
  display: flex; align-items: flex-start; gap: var(--s-md);
  cursor: pointer;
  transition: transform var(--t-fast), box-shadow var(--t-fast);
  border-left: 4px solid transparent;
  border: none;
  width: 100%;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}
.card-inspecao:active  { transform: scale(0.98); }
.card-inspecao:hover   { box-shadow: var(--shadow-md); }
.card-inspecao--rascunho { border-left: 4px solid var(--status-rascunho); }
.card-inspecao--enviada  { border-left: 4px solid var(--status-enviada); }
.card-inspecao--analisada{ border-left: 4px solid var(--status-analisada); }

.card-ins__icon {
  width: 44px; height: 44px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.card-ins__icon svg { width: 24px; height: 24px; }

.icone-oleo     { background: #FFF3E0; }
.icone-oleo svg { fill: #E65100; }
.icone-descarte      { background: #F3E5F5; }
.icone-descarte svg  { fill: #6A1B9A; }
.icone-fauna     { background: #E8F5E9; }
.icone-fauna svg { fill: #2E7D32; }
.icone-erosao     { background: #FFF8E1; }
.icone-erosao svg { fill: #F57F17; }

.card-ins__body { flex: 1; min-width: 0; }
.card-ins__title {
  font-size: var(--txt-base);
  font-weight: 700;
  color: var(--cptm-cinza-escuro);
  margin-bottom: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.card-ins__local {
  font-size: var(--txt-sm);
  color: var(--cptm-cinza-claro);
  margin-bottom: 6px;
  display: flex; align-items: center; gap: 4px;
}
.card-ins__local svg { fill: var(--cptm-cinza-claro); flex-shrink: 0; }
.card-ins__footer {
  display: flex; align-items: center; justify-content: space-between; gap: var(--s-sm);
}
.card-ins__date { font-size: var(--txt-xs); color: var(--cptm-cinza-claro); }

.card-ins__arrow {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--cptm-cinza-fundo);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: var(--cptm-cinza-claro);
}

/* Empty state */
.lista-vazia {
  text-align: center;
  padding: var(--s-2xl) var(--s-lg);
  color: var(--cptm-cinza-claro);
}
.lista-vazia svg { width: 64px; height: 64px; fill: var(--cptm-cinza-borda); margin: 0 auto var(--s-md); }
.lista-vazia p   { font-size: var(--txt-sm); }
</style>

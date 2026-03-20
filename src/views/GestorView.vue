<template>
  <div class="gestor" role="main">

    <!-- ---- Header ---- -->
    <header class="gestor__header">
      <div class="gestor__top">
        <div class="gestor__logo" aria-label="CPTM Ambiental">
          <span class="gestor__logo-text">CPTM</span>
          <LogoBadge :size="26" />
        </div>
        <div class="gestor__actions">
          <button class="btn-circle btn-circle--ghost" aria-label="Sair" @click="handleLogout">
            <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="gestor__greeting">
        <p class="gestor__greeting-text">{{ saudacao }}</p>
        <h1 class="gestor__user-name">{{ user?.name || 'Gestor' }}</h1>
        <p class="gestor__user-role">{{ user?.role }} &bull; {{ user?.line }}</p>
      </div>

      <!-- Stats bar -->
      <div class="gestor__stats">
        <div class="stat-item">
          <span class="stat-item__num">{{ store.todas.length }}</span>
          <span class="stat-item__label">Total</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-item__num">{{ store.enviadas }}</span>
          <span class="stat-item__label">Enviadas</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-item__num">{{ store.rascunhos }}</span>
          <span class="stat-item__label">Rascunhos</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-item__num">{{ funcionarios.length }}</span>
          <span class="stat-item__label">Inspetores</span>
        </div>
      </div>
    </header>

    <!-- ---- Content ---- -->
    <div class="gestor__content">

      <div class="section-header">
        <h2 class="section-title">Últimas Inspeções por Funcionário</h2>
        <span class="section-sub">Toque para ver o resumo completo</span>
      </div>

      <!-- Employee cards -->
      <div class="func-lista" role="list">
        <button
          v-for="ins in ultimasPorFuncionario"
          :key="ins.funcionarioId"
          class="func-card"
          role="listitem"
          :aria-label="`${ins.funcionarioNome}, última inspeção: ${ins.nomeContratada || 'FDC-EEA.EF'}`"
          @click="abrirResumo(ins)"
        >
          <!-- Avatar -->
          <div class="func-avatar" :class="avatarClass(ins.funcionarioId)">
            {{ ins.funcionarioInitials || '??' }}
          </div>

          <!-- Info -->
          <div class="func-info">
            <div class="func-info__top">
              <span class="func-nome">{{ ins.funcionarioNome }}</span>
              <StatusBadge :status="ins.status" />
            </div>
            <p class="func-inspecao">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
                <path d="M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.97 16.03 1 13.67 1c-1.28 0-2.43.53-3.27 1.39L9 3.8l-1.4-1.41C6.77 1.53 5.62 1 4.33 1 1.97 1 0 2.97 0 5.33c0 1.11.47 2.09 1.2 2.83L9 16l2.5-2.5-1.06-1.06L9 14.17l-6.38-6.38C2.23 7.4 2 6.9 2 6.33 2 4.5 3.67 3 5.67 3c.9 0 1.73.35 2.35.93L9.5 5.4l1.48-1.47C11.62 3.34 12.62 3 13.67 3 15.5 3 17 4.5 17 6.33c0 .41-.08.81-.22 1.18L15.5 9h3v2h-1.5l-5 5H9.83l-2-2H5v6h14V9h-3l.22-.56C16.08 8.08 16 7.71 16 7.33"/>
              </svg>
              {{ ins.nomeContratada || 'FDC-EEA.EF' }} · {{ ins.linha }}
            </p>
            <p class="func-data">
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              {{ formatDate(ins.updatedAt) }}
            </p>
          </div>

          <!-- Arrow -->
          <div class="func-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </div>
        </button>
      </div>

    </div>

    <!-- ---- Inspection Summary Modal ---- -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div
          v-if="inspecaoSelecionada"
          class="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-titulo"
          @click.self="fecharResumo"
        >
          <div class="modal-sheet">

            <!-- Drag handle -->
            <div class="modal-handle" aria-hidden="true"></div>

            <!-- Modal header -->
            <div class="modal-head">
              <div>
                <h2 id="modal-titulo" class="modal-head__title">Resumo da Inspeção</h2>
                <p class="modal-head__sub">
                  <span class="func-pill" :class="avatarClass(inspecaoSelecionada.funcionarioId)">
                    {{ inspecaoSelecionada.funcionarioInitials }}
                  </span>
                  {{ inspecaoSelecionada.funcionarioNome }}
                </p>
              </div>
              <button class="btn-fechar" @click="fecharResumo" aria-label="Fechar resumo">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            </div>

            <!-- Summary card (mirrors EtapaFinalizacao) -->
            <div class="modal-body">
              <div class="resumo-card">

                <!-- Type -->
                <div class="resumo-linha resumo-linha--destaque">
                  <div class="resumo-icone" style="background: #2E7D32">
                    <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="resumo-item__label">Origem do Efluente</div>
                    <div class="resumo-item__valor">{{ inspecaoSelecionada.origemEfluente || '—' }}</div>
                  </div>
                  <div class="resumo-status-pill">
                    <StatusBadge :status="inspecaoSelecionada.status" />
                  </div>
                </div>

                <div class="resumo-divisor"></div>

                <!-- Location -->
                <div class="resumo-grupo">
                  <div class="resumo-item">
                    <span class="resumo-item__label">Linha</span>
                    <span class="resumo-item__valor" :class="{ 'sem-dado': !inspecaoSelecionada.linha }">
                      {{ inspecaoSelecionada.linha || 'Não informado' }}
                    </span>
                  </div>
                  <div class="resumo-item">
                    <span class="resumo-item__label">Estação / Local</span>
                    <span class="resumo-item__valor" :class="{ 'sem-dado': !inspecaoSelecionada.estacao }">
                      {{ inspecaoSelecionada.estacao || 'Não informado' }}
                    </span>
                  </div>
                  <div class="resumo-item" v-if="inspecaoSelecionada.kmPoste">
                    <span class="resumo-item__label">Referência KM/Poste</span>
                    <span class="resumo-item__valor">{{ inspecaoSelecionada.kmPoste }}</span>
                  </div>
                  <div class="resumo-item" v-if="inspecaoSelecionada.latitude">
                    <span class="resumo-item__label">GPS</span>
                    <span class="resumo-item__valor resumo-item__valor--mono">
                      {{ Number(inspecaoSelecionada.latitude).toFixed(5) }},
                      {{ Number(inspecaoSelecionada.longitude).toFixed(5) }}
                    </span>
                  </div>
                </div>

                <div class="resumo-divisor"></div>

                <!-- Details -->
                <div class="resumo-grupo">
                  <div class="resumo-item" v-if="inspecaoSelecionada.fonteGeradora">
                    <span class="resumo-item__label">Fonte Geradora</span>
                    <span class="resumo-item__valor">{{ inspecaoSelecionada.fonteGeradora }}</span>
                  </div>
                  <div class="resumo-item" v-if="inspecaoSelecionada.quantidadeLitros">
                    <span class="resumo-item__label">Volume (L)</span>
                    <span class="resumo-item__valor">{{ inspecaoSelecionada.quantidadeLitros }}</span>
                  </div>
                  <div class="resumo-item" v-if="inspecaoSelecionada.fotos?.length">
                    <span class="resumo-item__label">Fotos</span>
                    <span class="resumo-item__valor">
                      {{ inspecaoSelecionada.fotos.length }} {{ inspecaoSelecionada.fotos.length === 1 ? 'foto' : 'fotos' }}
                    </span>
                  </div>
                  <div class="resumo-item">
                    <span class="resumo-item__label">Registrado em</span>
                    <span class="resumo-item__valor">{{ formatDate(inspecaoSelecionada.updatedAt) }}</span>
                  </div>
                </div>

                <!-- Observation -->
                <template v-if="inspecaoSelecionada.observacoesGerais">
                  <div class="resumo-divisor"></div>
                  <div class="resumo-obs">
                    <div class="resumo-item__label">Observações</div>
                    <p>{{ inspecaoSelecionada.observacoesGerais }}</p>
                  </div>
                </template>
              </div>

              <!-- Inspector info card -->
              <div class="inspetor-card">
                <div class="inspetor-avatar" :class="avatarClass(inspecaoSelecionada.funcionarioId)">
                  {{ inspecaoSelecionada.funcionarioInitials }}
                </div>
                <div class="inspetor-info">
                  <span class="inspetor-nome">{{ inspecaoSelecionada.funcionarioNome }}</span>
                  <span class="inspetor-label">Responsável pela inspeção</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInspecoesStore } from '@/stores/inspecoes'
import { useSaudacao } from '@/composables/useSaudacao'
import LogoBadge from '@/components/LogoBadge.vue'
import StatusBadge from '@/components/StatusBadge.vue'

const router = useRouter()
const auth   = useAuthStore()
const store  = useInspecoesStore()

const user      = computed(() => auth.currentUser)
const { saudacao } = useSaudacao()

const ultimasPorFuncionario = computed(() => store.ultimasPorFuncionario)

const funcionarios = computed(() => {
  const ids = new Set(ultimasPorFuncionario.value.map(i => i.funcionarioId))
  return [...ids]
})

const inspecaoSelecionada = ref(null)

const AVATAR_CLASSES = ['av-red', 'av-blue', 'av-green', 'av-purple']
const avatarMap = new Map()
function avatarClass(id) {
  if (!avatarMap.has(id)) {
    avatarMap.set(id, AVATAR_CLASSES[avatarMap.size % AVATAR_CLASSES.length])
  }
  return avatarMap.get(id)
}


function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Agora há pouco'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`
  if (diff < 172800000) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function abrirResumo(ins) { inspecaoSelecionada.value = ins }
function fecharResumo()   { inspecaoSelecionada.value = null }

function handleLogout() {
  auth.logout()
  router.replace('/login')
}
</script>

<style scoped>
/* ---- Page layout ---- */
.gestor {
  min-height: 100dvh;
  background: var(--cptm-cinza-fundo);
  display: flex;
  flex-direction: column;
}

/* ---- Header ---- */
.gestor__header {
  background: linear-gradient(160deg, #C8102E 0%, #9B0B22 100%);
  padding: calc(var(--s-lg) + var(--safe-top)) var(--s-lg) 0;
  color: white;
  position: relative;
  overflow: hidden;
}
.gestor__header::after {
  content: '';
  position: absolute;
  bottom: -40px; left: 50%;
  transform: translateX(-50%);
  width: 200%; height: 80px;
  background: var(--cptm-cinza-fundo);
  border-radius: 50%;
}

.gestor__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--s-md);
}
.gestor__logo { display: flex; align-items: center; gap: 8px; }
.gestor__logo-text {
  font-size: 1.5rem; font-weight: 900;
  color: white; letter-spacing: 0.1em;
}
.gestor__actions { display: flex; gap: var(--s-sm); }

.btn-circle {
  width: 40px; height: 40px;
  border-radius: 50%; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.btn-circle--ghost {
  background: rgba(255,255,255,.18);
  -webkit-tap-highlight-color: transparent;
}
.btn-circle--ghost:active { background: rgba(255,255,255,.3); }

.gestor__greeting { margin-bottom: var(--s-md); }
.gestor__greeting-text { font-size: var(--txt-xs); opacity: .75; margin-bottom: 2px; }
.gestor__user-name { font-size: var(--txt-xl); font-weight: 800; margin-bottom: 2px; }
.gestor__user-role { font-size: var(--txt-xs); opacity: .8; }

/* Stats bar */
.gestor__stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(0,0,0,.18);
  border-radius: var(--r-md) var(--r-md) 0 0;
  padding: var(--s-md) var(--s-sm);
  margin: 0 calc(var(--s-lg) * -1);
  position: relative; z-index: 1;
}
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-item__num { font-size: var(--txt-lg); font-weight: 800; }
.stat-item__label { font-size: 0.65rem; opacity: .8; text-transform: uppercase; letter-spacing: .05em; }
.stat-sep { width: 1px; height: 28px; background: rgba(255,255,255,.25); }

/* ---- Content ---- */
.gestor__content {
  flex: 1;
  padding: calc(var(--s-xl) + var(--s-sm)) var(--s-md) calc(var(--s-xl) + var(--safe-bottom));
}

.section-header { margin-bottom: var(--s-md); }
.section-title { font-size: var(--txt-base); font-weight: 700; color: var(--cptm-cinza-escuro); margin-bottom: 2px; }
.section-sub { font-size: var(--txt-xs); color: var(--cptm-cinza-claro); }

/* ---- Employee list ---- */
.func-lista { display: flex; flex-direction: column; gap: var(--s-sm); }

.func-card {
  display: flex;
  align-items: center;
  gap: var(--s-md);
  background: var(--cptm-branco);
  border: 1.5px solid var(--cptm-cinza-borda);
  border-radius: var(--r-lg);
  padding: var(--s-md);
  cursor: pointer;
  text-align: left;
  box-shadow: var(--shadow-sm);
  width: 100%;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--t-fast), box-shadow var(--t-fast);
}
.func-card:active {
  transform: scale(0.98);
  box-shadow: none;
}

/* Avatar colours */
.func-avatar, .inspetor-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--txt-sm); font-weight: 800;
  color: white; flex-shrink: 0;
}
.av-red    { background: linear-gradient(135deg, #C8102E, #E8394F); }
.av-blue   { background: linear-gradient(135deg, #1565C0, #1976D2); }
.av-green  { background: linear-gradient(135deg, #2E7D32, #43A047); }
.av-purple { background: linear-gradient(135deg, #4527A0, #673AB7); }

.func-info { flex: 1; min-width: 0; }
.func-info__top {
  display: flex; align-items: center; justify-content: space-between; gap: var(--s-sm);
  margin-bottom: 4px;
}
.func-nome {
  font-size: var(--txt-sm); font-weight: 700;
  color: var(--cptm-cinza-escuro);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.func-inspecao {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--txt-xs); color: var(--cptm-cinza-medio);
  margin-bottom: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.func-inspecao svg { fill: var(--cptm-cinza-claro); flex-shrink: 0; }
.func-data {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--txt-xs); color: var(--cptm-cinza-claro);
}
.func-data svg { fill: var(--cptm-cinza-claro); flex-shrink: 0; }
.func-arrow { color: var(--cptm-cinza-claro); flex-shrink: 0; }

/* ---- Modal overlay ---- */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.55);
  z-index: 200;
  display: flex; align-items: flex-end;
  backdrop-filter: blur(2px);
}

.modal-sheet {
  background: var(--cptm-branco);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  width: 100%;
  max-height: 90dvh;
  overflow-y: auto;
  padding-bottom: var(--safe-bottom);
}

.modal-handle {
  width: 40px; height: 4px;
  background: var(--cptm-cinza-borda);
  border-radius: 99px;
  margin: 12px auto 0;
}

.modal-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: var(--s-md) var(--s-md) var(--s-sm);
  border-bottom: 1px solid var(--cptm-cinza-borda);
}
.modal-head__title { font-size: var(--txt-base); font-weight: 800; color: var(--cptm-cinza-escuro); margin-bottom: 4px; }
.modal-head__sub { display: flex; align-items: center; gap: var(--s-sm); font-size: var(--txt-xs); color: var(--cptm-cinza-claro); }

.func-pill {
  width: 24px; height: 24px;
  border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.6rem; font-weight: 800; color: white;
}

.btn-fechar {
  background: var(--cptm-cinza-fundo);
  border: none; border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--cptm-cinza-medio);
  flex-shrink: 0;
}

.modal-body { padding: var(--s-md); display: flex; flex-direction: column; gap: var(--s-md); }

/* ---- Summary card (mirrors EtapaFinalizacao styles) ---- */
.resumo-card {
  background: var(--cptm-branco);
  border: 1.5px solid var(--cptm-cinza-borda);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.resumo-linha--destaque {
  display: flex; align-items: center; gap: var(--s-md);
  padding: var(--s-md);
  background: var(--cptm-cinza-fundo);
}
.resumo-icone {
  width: 44px; height: 44px;
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.resumo-status-pill { margin-left: auto; }
.resumo-divisor { height: 1px; background: var(--cptm-cinza-borda); }
.resumo-grupo { padding: var(--s-md); display: flex; flex-direction: column; gap: var(--s-sm); }
.resumo-item {
  display: flex; justify-content: space-between; align-items: baseline; gap: var(--s-sm);
}
.resumo-item__label {
  font-size: var(--txt-xs); color: var(--cptm-cinza-claro);
  font-weight: 600; text-transform: uppercase; letter-spacing: .04em;
  flex-shrink: 0;
}
.resumo-item__valor {
  font-size: var(--txt-sm); font-weight: 600;
  color: var(--cptm-cinza-escuro); text-align: right;
}
.resumo-item__valor.sem-dado { color: var(--cptm-cinza-claro); font-style: italic; font-weight: 400; }
.resumo-item__valor--mono { font-family: monospace; font-size: .72rem; }
.resumo-item__valor--badge { padding: 3px 8px; border-radius: 99px; font-size: .7rem; }
.badge-pequeno { background: #E8F5E9; color: #2E7D32; }
.badge-medio   { background: #FFF3E0; color: #E65100; }
.badge-grande  { background: #FFEBEE; color: #C62828; }
.badge-urgente { background: #FFEBEE; color: #C62828; }
.badge-normal  { background: #E8F5E9; color: #2E7D32; }
.resumo-obs { padding: var(--s-md); }
.resumo-obs p { font-size: var(--txt-sm); color: var(--cptm-cinza-escuro); margin: 4px 0 0; line-height: 1.5; }

/* ---- Inspector info card ---- */
.inspetor-card {
  display: flex; align-items: center; gap: var(--s-md);
  background: var(--cptm-cinza-fundo);
  border: 1.5px solid var(--cptm-cinza-borda);
  border-radius: var(--r-lg);
  padding: var(--s-md);
}
.inspetor-avatar { width: 40px; height: 40px; font-size: .8rem; }
.inspetor-info { display: flex; flex-direction: column; gap: 2px; }
.inspetor-nome { font-size: var(--txt-sm); font-weight: 700; color: var(--cptm-cinza-escuro); }
.inspetor-label { font-size: var(--txt-xs); color: var(--cptm-cinza-claro); }

/* ---- Transitions ---- */
.slide-up-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.15, 0.64, 1); }
.slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from  { opacity: 0; }
.slide-up-leave-to    { opacity: 0; }
.slide-up-enter-from .modal-sheet { transform: translateY(100%); }
.slide-up-leave-to   .modal-sheet { transform: translateY(100%); }
.modal-sheet { transition: transform 0.35s cubic-bezier(0.34, 1.15, 0.64, 1); }
</style>

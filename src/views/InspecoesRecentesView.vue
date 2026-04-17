<template>
  <div class="historico" role="main">
    <header class="historico__header">
      <button class="historico__back" aria-label="Voltar" @click="voltar">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <div>
        <h1 class="historico__title">Historico de inspecoes</h1>
        <p class="historico__sub">Ultimas 10 do seu usuario</p>
      </div>
    </header>

    <section class="historico__content" aria-labelledby="historico-titulo">
      <h2 id="historico-titulo" class="sr-only">Ultimas inspecoes</h2>

      <div v-if="historico.length === 0" class="lista-vazia">
        <p>Nenhuma inspecao encontrada para este usuario.</p>
      </div>

      <div v-else class="inspection-list" role="list">
        <div
          v-for="ins in historico"
          :key="ins.localId"
          class="card-inspecao-wrap"
          role="listitem"
        >
          <button
            class="card-inspecao"
            :class="`card-inspecao--${ins.status}`"
            :aria-label="`Inspecao ${ins.nomeContratada || 'FDC-EEA.EF'} com status ${ins.status}`"
            @click="abrirInspecao(ins)"
          >
            <div class="card-ins__body">
              <p class="card-ins__title">{{ ins.nomeContratada || 'FDC-EEA.EF' }}</p>
              <p class="card-ins__local">{{ ins.estacao || ins.nomeLocal || '—' }} · {{ ins.linha || '—' }}</p>
              <div class="card-ins__footer">
                <StatusBadge :status="ins.status" />
                <span class="card-ins__date">{{ formatDate(ins.updatedAt) }}</span>
              </div>
            </div>
          </button>

          <button
            v-if="ins.syncStatus === 'erro_sync' || ins.syncStatus === 'pendente_sync'"
            class="card-ins__retry"
            @click="retryInspecao(ins.localId)"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="inspecaoSelecionada"
          class="modal-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="fecharResumo"
        >
          <div class="modal-card">
            <div class="modal-head">
              <h3>Detalhes da Inspecao</h3>
              <button class="modal-close" @click="fecharResumo" aria-label="Fechar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p><strong>Contratada:</strong> {{ inspecaoSelecionada.nomeContratada || 'FDC-EEA.EF' }}</p>
              <p><strong>Linha:</strong> {{ inspecaoSelecionada.linha || '—' }}</p>
              <p><strong>Local:</strong> {{ inspecaoSelecionada.estacao || inspecaoSelecionada.nomeLocal || '—' }}</p>
              <p><strong>Status:</strong> {{ inspecaoSelecionada.status || '—' }}</p>
              <p><strong>Atualizado:</strong> {{ formatDate(inspecaoSelecionada.updatedAt) }}</p>
              <p v-if="inspecaoSelecionada.observacoesGerais"><strong>Observacoes:</strong> {{ inspecaoSelecionada.observacoesGerais }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInspecoesStore } from '@/stores/inspecoes'
import { useNotificacoesStore } from '@/stores/notificacoes'
import StatusBadge from '@/components/StatusBadge.vue'

const router = useRouter()
const auth = useAuthStore()
const store = useInspecoesStore()
const notificacoes = useNotificacoesStore()

const user = computed(() => auth.currentUser?.value ?? auth.currentUser)
const isGestor = computed(() => auth.isGestor?.value ?? auth.isGestor)
const inspecaoSelecionada = ref(null)

const historico = computed(() => {
  const funcionarioId = user.value?.id
  const funcionarioNome = user.value?.name
  if (!funcionarioId) return []
  return store.porFuncionario(funcionarioId, funcionarioNome).slice(0, 10)
})

onMounted(async () => {
  await store.initialize()
  if (store.browserOnline) {
    await store.carregarDoServidor().catch(() => {})
  }
})

function voltar() {
  router.back()
}

function abrirInspecao(inspecao) {
  if (isGestor.value) {
    router.push({ path: '/formulario', query: { localId: inspecao.localId } })
    return
  }

  inspecaoSelecionada.value = inspecao
}

function fecharResumo() {
  inspecaoSelecionada.value = null
}

async function retryInspecao(localId) {
  await store.retryItem(localId)
  if (store.apiDisponivel) {
    await store.carregarDoServidor()
  }
}

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
.historico {
  min-height: 100dvh;
  background: var(--cptm-cinza-fundo);
  padding-bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 20px);
}

.historico__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: calc(16px + var(--safe-top)) var(--s-lg) 14px;
  background: linear-gradient(150deg, #C8102E 0%, #9B0B22 100%);
  color: #fff;
}

.historico__back {
  border: 0;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.historico__back svg {
  width: 20px;
  height: 20px;
}

.historico__title {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 800;
}

.historico__sub {
  margin: 2px 0 0;
  font-size: 0.82rem;
  opacity: 0.9;
}

.historico__content {
  padding: var(--s-lg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.lista-vazia {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  color: #6b7280;
}

.inspection-list {
  display: grid;
  gap: 12px;
}

.card-inspecao-wrap {
  display: grid;
  gap: 6px;
}

.card-inspecao {
  border: 0;
  border-radius: 14px;
  background: #fff;
  text-align: left;
  width: 100%;
  padding: 14px;
}

.card-ins__title {
  margin: 0;
  font-size: 0.96rem;
  font-weight: 700;
  color: #263238;
}

.card-ins__local {
  margin: 4px 0 0;
  font-size: 0.84rem;
  color: #546e7a;
}

.card-ins__footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-ins__date {
  font-size: 0.77rem;
  color: #6b7280;
}

.card-ins__retry {
  border: 0;
  border-radius: 10px;
  background: #fef3c7;
  color: #92400e;
  padding: 8px 10px;
  font-size: 0.8rem;
  font-weight: 700;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #eceff1;
}

.modal-head h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
  color: #1f2937;
}

.modal-close {
  border: 0;
  background: #f3f4f6;
  color: #374151;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.modal-body {
  padding: 14px;
  display: grid;
  gap: 8px;
  color: #374151;
  font-size: 0.9rem;
}

.modal-body p {
  margin: 0;
}
</style>

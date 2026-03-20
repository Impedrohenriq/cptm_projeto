<template>
  <div class="fdc-etapa">

    <!-- SEÇÃO 7.3 -->
    <div class="fdc-sec">
      <div class="fdc-sec__badge">7.3</div>
      <div>
        <h2 class="fdc-sec__title">Registro Fotográfico</h2>
        <p class="fdc-sec__desc">Adicione até 4 fotografias do elemento de monitoramento (paisagem/horizontal).</p>
      </div>
    </div>

    <div class="fotos-grade">
      <div v-for="n in 4" :key="n" class="foto-slot" :class="{ 'foto-slot--preenchida': fotos[n-1] }">
        <template v-if="fotos[n-1]">
          <img :src="fotos[n-1].src" :alt="`Foto ${n}`" class="foto-img" />
          <div class="foto-overlay">
            <span class="foto-num">Foto {{ n }}</span>
            <button class="foto-del" @click="removerFoto(n-1)" :aria-label="`Remover foto ${n}`">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </template>
        <template v-else>
          <button class="foto-add" @click="triggerInput(n-1)" :disabled="!podeAdicionar(n-1)">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 2L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3.17L15 2H9zm3 15a5 5 0 110-10 5 5 0 010 10z"/></svg>
            <span>Foto {{ n }}</span>
            <span class="foto-add__sub">Câmera ou galeria</span>
          </button>
        </template>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="visually-hidden"
      @change="onFileChange" aria-hidden="true" tabindex="-1" />

    <div class="foto-dica">
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      Orientação paisagem/horizontal · Tamanho 4x3 · Boa iluminação
    </div>

    <!-- REVISÃO FINAL -->
    <div class="fdc-sec">
      <div class="fdc-sec__badge fdc-sec__badge--verde">
        <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <div>
        <h2 class="fdc-sec__title">Revisão Final</h2>
        <p class="fdc-sec__desc">Confira os dados antes de salvar ou enviar.</p>
      </div>
    </div>

    <div class="resumo-card">
      <div class="resumo-linha"><span class="resumo-k">Contratada</span><span class="resumo-v">{{ v.nomeContratada || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Local do Escopo</span><span class="resumo-v">{{ v.localEscopo || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Autor do Cadastro</span><span class="resumo-v">{{ v.autorCadastro || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Natureza PGA</span><span class="resumo-v">{{ v.naturezaPGA || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Nº Formulário</span><span class="resumo-v">{{ v.numFormulario ? 'Nº ' + String(v.numFormulario).padStart(6,'0') : '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Data Emissão</span><span class="resumo-v">{{ v.dataEmissao || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">E.M. Nome</span><span class="resumo-v">{{ v.emNome || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Linha CPTM</span><span class="resumo-v">{{ v.linha || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Estação</span><span class="resumo-v">{{ v.estacao || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Origem Efluente</span><span class="resumo-v">{{ v.origemEfluente || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Fonte Geradora</span><span class="resumo-v">{{ v.fonteGeradora || '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Quantidade</span><span class="resumo-v">{{ v.quantidadeLitros ? v.quantidadeLitros + ' L' : '—' }}</span></div>
      <div class="resumo-linha"><span class="resumo-k">Fotos</span><span class="resumo-v">{{ fotos.length }} de 4</span></div>
    </div>

    <Transition name="fade">
      <div v-if="!isOnline" class="alerta-offline">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
        <span>Sem conexão — será salvo localmente e sincronizado depois.</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNetwork } from '@/composables/useNetwork'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit  = defineEmits(['update:modelValue'])

const v = props.modelValue
const { isOnline } = useNetwork()
const fileInput   = ref(null)
let currentSlot   = 0

const fotos = computed(() => v.fotos || [])

function podeAdicionar(idx) {
  return idx === 0 || fotos.value[idx - 1] != null
}

function triggerInput(idx) {
  currentSlot = idx
  fileInput.value.value = ''
  fileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    const novasFotos = [...fotos.value]
    novasFotos[currentSlot] = { src: ev.target.result, nome: file.name }
    emit('update:modelValue', { ...props.modelValue, fotos: novasFotos })
  }
  reader.readAsDataURL(file)
}

function removerFoto(idx) {
  const novasFotos = [...fotos.value]
  novasFotos.splice(idx, 1)
  emit('update:modelValue', { ...props.modelValue, fotos: novasFotos })
}
</script>

<style scoped>
.fdc-etapa { padding: var(--s-lg) var(--s-md); animation: fadeInUp 0.3s ease both; }

.fdc-sec__badge--verde { background: var(--verde-principal); }

.fotos-grade {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-md);
  margin-bottom: var(--s-md);
}
.foto-slot {
  position: relative; aspect-ratio: 4/3;
  border: 2px dashed var(--cptm-cinza-borda);
  border-radius: var(--r-lg); overflow: hidden;
  background: var(--cptm-cinza-fundo);
}
.foto-slot--preenchida { border-style: solid; border-color: var(--verde-claro); }
.foto-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.foto-add {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; background: none; border: none; cursor: pointer;
  color: var(--cptm-cinza-claro);
}
.foto-add:disabled { opacity: 0.4; cursor: not-allowed; }
.foto-add span { font-size: var(--txt-sm); font-weight: 600; color: var(--cptm-cinza-escuro); }
.foto-add__sub { font-size: var(--txt-xs); color: var(--cptm-cinza-claro); }
.foto-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--s-xs) var(--s-sm);
}
.foto-num { color: #fff; font-size: var(--txt-xs); font-weight: 700; }
.foto-del {
  background: rgba(200,16,46,0.85); border: none; border-radius: 50%;
  width: 28px; height: 28px; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
}
.foto-dica {
  display: flex; align-items: center; gap: var(--s-sm);
  font-size: var(--txt-xs); color: var(--cptm-cinza-claro); margin-bottom: var(--s-md);
}
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
.resumo-card {
  background: var(--cptm-branco); border: 1.5px solid var(--cptm-cinza-borda);
  border-radius: var(--r-lg); overflow: hidden; margin-bottom: var(--s-md);
}
.resumo-linha {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 10px var(--s-md); gap: var(--s-md);
  border-bottom: 1px solid var(--cptm-cinza-borda);
}
.resumo-linha:last-child { border-bottom: none; }
.resumo-k { font-size: var(--txt-xs); color: var(--cptm-cinza-claro); font-weight: 600; flex-shrink: 0; }
.resumo-v { font-size: var(--txt-sm); color: var(--cptm-cinza-escuro); font-weight: 500; text-align: right; }
.alerta-offline {
  display: flex; align-items: center; gap: var(--s-sm);
  padding: var(--s-sm) var(--s-md); background: #FFF3E0;
  border-radius: var(--r-md); border: 1.5px solid #FF8F00;
  font-size: var(--txt-xs); color: #E65100; font-weight: 600;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

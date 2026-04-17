<template>
  <div class="fdc-etapa">

    <div class="fdc-sec">
      <div class="fdc-sec__badge">3</div>
      <div>
        <h2 class="fdc-sec__title">Identificação do Formulário</h2>
        <p class="fdc-sec__desc">Dados de identificação do documento FDC-EEA.EF.</p>
      </div>
    </div>

    <div class="fdc-auto">
      <div class="fdc-auto__lbl">Tipo de Formulário</div>
      <div class="fdc-auto__val">Formulário de Cadastramento – FDC (FDC-EEA.EF)</div>
    </div>

    <div class="fdc-field">
      <label class="fdc-lbl req" for="naturezaPGA">Natureza do PGA</label>
      <div class="fdc-wrap fdc-wrap--sel">
        <select id="naturezaPGA" class="fdc-input"
          :value="v.naturezaPGA" @change="u('naturezaPGA', $event.target.value)">
          <option value="">Selecione a natureza...</option>
          <option v-for="n in NATUREZAS" :key="n" :value="n">{{ n }}</option>
        </select>
        <svg class="fdc-chevron" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
    </div>

    <div class="fdc-field">
      <label class="fdc-lbl req" for="dataEmissao">Data de Emissão do Formulário</label>
      <div class="fdc-wrap">
        <input id="dataEmissao" class="fdc-input" type="date"
          :value="v.dataEmissao"
          @input="u('dataEmissao', $event.target.value)" />
      </div>
    </div>

    <div class="fdc-field">
      <label class="fdc-lbl req" for="numFormulario">Número do Formulário</label>
      <div class="fdc-hint">Sequencial de 1 a 999.999</div>
      <div class="fdc-wrap">
        <input id="numFormulario" class="fdc-input" type="number"
          min="1" max="999999"
          :value="v.numFormulario"
          placeholder="Ex: 1"
          @input="u('numFormulario', $event.target.value)" />
        <button v-if="v.numFormulario" class="fdc-clear" type="button"
          @click="u('numFormulario', '')" aria-label="Limpar">×</button>
      </div>
    </div>

    <div v-if="v.numFormulario" class="fdc-auto">
      <div class="fdc-auto__lbl">Exibição do número</div>
      <div class="fdc-auto__val">Nº {{ String(v.numFormulario).padStart(6,'0') }}</div>
    </div>

    <div class="fdc-field">
      <label class="fdc-lbl req" for="autorFormulario">Autor(a) do Formulário</label>
      <div class="fdc-wrap" :class="{ 'fdc-wrap--locked': isLocked(v.autorFormulario) }">
        <input id="autorFormulario" class="fdc-input" :class="{ 'fdc-input--locked': isLocked(v.autorFormulario) }" type="text"
          :value="v.autorFormulario"
          placeholder="Nome completo do autor do formulário"
          :readonly="isLocked(v.autorFormulario)"
          @input="u('autorFormulario', $event.target.value)" />
      </div>
      <div class="fdc-hint">Preenchido automaticamente com o nome da conta logada.</div>
    </div>

    <div class="fdc-field">
      <label class="fdc-lbl" for="nomeArquivoFdc">Nome do Arquivo FDC</label>
      <div class="fdc-hint">Pode manter em branco quando não houver nomenclatura oficial.</div>
      <div class="fdc-wrap">
        <input id="nomeArquivoFdc" class="fdc-input" type="text"
          :value="v.nomeArquivoFdc"
          placeholder="Ex: DeaoCtAr01823-02FdcEeaEfL10ProgaiaN000001 (ou deixe em branco)"
          @input="u('nomeArquivoFdc', $event.target.value)" />
        <button v-if="v.nomeArquivoFdc" class="fdc-clear" type="button"
          @click="u('nomeArquivoFdc', '')" aria-label="Limpar">×</button>
      </div>
    </div>

    <div class="fdc-field">
      <label class="fdc-lbl" for="codigoArquivoFdc">Código do Arquivo FDC</label>
      <div class="fdc-hint">Pode deixar em branco quando não aplicável.</div>
      <div class="fdc-wrap">
        <input id="codigoArquivoFdc" class="fdc-input" type="text"
          :value="v.codigoArquivoFdc"
          placeholder="Ex: FDC-EEA.EF-A.2026-L.07-CPTM-N.000001 (ou deixe em branco)"
          @input="u('codigoArquivoFdc', $event.target.value)" />
        <button v-if="v.codigoArquivoFdc" class="fdc-clear" type="button"
          @click="u('codigoArquivoFdc', '')" aria-label="Limpar">×</button>
      </div>
    </div>

    <div class="fdc-auto">
      <div class="fdc-auto__lbl">Código FDC (gerado automaticamente)</div>
      <div class="fdc-auto__val">{{ codigoFDC }}</div>
    </div>

    <!-- SEÇÃO 4 -->
    <div class="fdc-sec">
      <div class="fdc-sec__badge">4</div>
      <div>
        <h2 class="fdc-sec__title">Data e Hora do Cadastramento</h2>
        <p class="fdc-sec__desc">Informe quando o elemento de monitoramento foi cadastrado.</p>
      </div>
    </div>

    <div class="fdc-row">
      <div class="fdc-field">
        <label class="fdc-lbl req" for="dataCadastramento">Data</label>
        <div class="fdc-wrap">
          <input id="dataCadastramento" class="fdc-input" type="date"
            :value="v.dataCadastramento"
            @input="u('dataCadastramento', $event.target.value)" />
        </div>
      </div>
      <div class="fdc-field">
        <label class="fdc-lbl req" for="horaCadastramento">Hora</label>
        <div class="fdc-wrap">
          <input id="horaCadastramento" class="fdc-input" type="time"
            :value="v.horaCadastramento"
            @input="u('horaCadastramento', $event.target.value)" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit  = defineEmits(['update:modelValue'])

const v = props.modelValue

const NATUREZAS = ['Efluentes', 'Emissões Atmosféricas', 'Resíduos Sólidos', 'Fauna', 'Flora', 'Recursos Hídricos']

const codigoFDC = computed(() => {
  const ano = v.dataEmissao ? v.dataEmissao.substring(0, 4) : new Date().getFullYear()
  const num = v.numFormulario ? String(v.numFormulario).padStart(6, '0') : '000001'
  return `FDC-EEA.EF-A.${ano}-L.00-CPTM-N.${num}`
})

function u(field, val) {
  emit('update:modelValue', { ...props.modelValue, [field]: val })
}

function isLocked(value) {
  return String(value ?? '').trim().length > 0
}
</script>

<style scoped>
.fdc-etapa { padding: var(--s-lg) var(--s-md); animation: fadeInUp 0.3s ease both; }

.fdc-wrap--locked {
  opacity: 0.72;
}

.fdc-input--locked {
  cursor: not-allowed;
}
</style>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const INSPECOES_KEY = 'cptm_inspecoes'
const SEED_VERSION  = 'v4'
const SEED_KEY      = 'cptm_inspecoes_seed'

let nextId = Date.now()

function loadInspecoes() {
  try {
    return JSON.parse(localStorage.getItem(INSPECOES_KEY) || '[]')
  } catch {
    return []
  }
}

export const useInspecoesStore = defineStore('inspecoes', () => {
  const inspecoes = ref(loadInspecoes())

  const total = computed(() => inspecoes.value.length)
  const enviadas = computed(() => inspecoes.value.filter(i => i.status === 'enviada').length)
  const rascunhos = computed(() => inspecoes.value.filter(i => i.status === 'rascunho').length)
  const recentes = computed(() => [...inspecoes.value].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 10))

  // For gestor: all inspections sorted by date
  const todas = computed(() => [...inspecoes.value].sort((a, b) => b.updatedAt - a.updatedAt))

  // For gestor: last inspection per employee
  const ultimasPorFuncionario = computed(() => {
    const mapa = new Map()
    for (const ins of todas.value) {
      const chave = ins.funcionarioId || 'desconhecido'
      if (!mapa.has(chave)) mapa.set(chave, ins)
    }
    return [...mapa.values()]
  })

  function persist() {
    localStorage.setItem(INSPECOES_KEY, JSON.stringify(inspecoes.value))
  }

  function salvarRascunho(dados) {
    const existente = inspecoes.value.find(i => i.id === dados.id)
    if (existente) {
      Object.assign(existente, { ...dados, status: 'rascunho', updatedAt: Date.now() })
    } else {
      inspecoes.value.unshift({ ...dados, id: nextId++, status: 'rascunho', createdAt: Date.now(), updatedAt: Date.now() })
    }
    persist()
  }

  function enviar(dados) {
    const existente = inspecoes.value.find(i => i.id === dados.id)
    if (existente) {
      Object.assign(existente, { ...dados, status: 'enviada', updatedAt: Date.now() })
    } else {
      inspecoes.value.unshift({ ...dados, id: nextId++, status: 'enviada', createdAt: Date.now(), updatedAt: Date.now() })
    }
    persist()
  }

  function porFuncionario(funcionarioId) {
    return [...inspecoes.value]
      .filter(i => i.funcionarioId === funcionarioId)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }

  // Seed with demo data if empty OR seed version changed
  if (inspecoes.value.length === 0 || localStorage.getItem(SEED_KEY) !== SEED_VERSION) {
    const now = Date.now()
    inspecoes.value = [
      // Carlos Silva – L7-Rubi
      {
        id: 1, funcionarioId: 'u1', funcionarioNome: 'Carlos Silva', funcionarioInitials: 'CS',
        nomeContratada: 'Construtora Alpha Ltda', numContrato: '001/2025',
        localEscopo: 'Linha 7-Rubi – Trecho Várzea Paulista',
        autorCadastro: 'Carlos Silva', responsavelTecnico: 'Eng. Marcos Lima',
        naturezaPGA: 'Efluentes', dataEmissao: '2025-02-10', numFormulario: 1,
        autorFormulario: 'Carlos Silva',
        dataCadastramento: '2025-02-10', horaCadastramento: '08:30',
        emNumero: 7, emNome: 'E.M. Várzea Paulista',
        municipio: 'Várzea Paulista', linha: 'Linha 7-Rubi', estacao: 'Várzea Paulista',
        origemEfluente: 'Doméstico', fonteGeradora: 'Banheiro químico',
        quantidadeLitros: 500, tipoDestinacao: 'Interligação em rede coletora',
        observacoesGerais: 'Mancha visível próxima à via permanente.',
        fotos: [], status: 'rascunho', createdAt: now - 3600000, updatedAt: now - 3600000,
      },
      {
        id: 2, funcionarioId: 'u1', funcionarioNome: 'Carlos Silva', funcionarioInitials: 'CS',
        nomeContratada: 'Construtora Alpha Ltda', numContrato: '001/2025',
        localEscopo: 'Linha 7-Rubi – Trecho Jundiaí',
        autorCadastro: 'Carlos Silva', responsavelTecnico: 'Eng. Marcos Lima',
        naturezaPGA: 'Resíduos Sólidos', dataEmissao: '2025-02-09', numFormulario: 2,
        autorFormulario: 'Carlos Silva',
        dataCadastramento: '2025-02-09', horaCadastramento: '14:10',
        emNumero: 7, emNome: 'E.M. Jundiaí',
        municipio: 'Jundiaí', linha: 'Linha 7-Rubi', estacao: 'Jundiaí',
        origemEfluente: 'Outro(a)(s)', fonteGeradora: 'Drenagem de obra',
        quantidadeLitros: 0, observacoesGerais: 'Resíduos sólidos descartados no canteiro.',
        fotos: [], status: 'enviada', createdAt: now - 86400000, updatedAt: now - 86400000,
      },
      // Ana Paula Rodrigues – L8-Diamante
      {
        id: 3, funcionarioId: 'u2', funcionarioNome: 'Ana Paula Rodrigues', funcionarioInitials: 'AR',
        nomeContratada: 'Beta Engenharia S.A.', numContrato: '002/2025',
        localEscopo: 'Linha 8-Diamante – Km 42+300',
        autorCadastro: 'Ana Paula Rodrigues', responsavelTecnico: 'Eng. Carla Matos',
        naturezaPGA: 'Efluentes', dataEmissao: '2025-02-07', numFormulario: 3,
        autorFormulario: 'Ana Paula Rodrigues',
        dataCadastramento: '2025-02-07', horaCadastramento: '09:00',
        emNumero: 8, emNome: 'E.M. Km 42+300',
        municipio: 'Osasco', linha: 'Linha 8-Diamante', estacao: 'Km 42+300',
        kmPoste: '42+300', latitude: -23.5317, longitude: -46.7521,
        origemEfluente: 'Pluvial', fonteGeradora: 'Escoamento superficial',
        quantidadeLitros: 200, observacoesGerais: 'Efluente com coloração suspeita no córrego adjacente.',
        fotos: [], status: 'analisada', createdAt: now - 259200000, updatedAt: now - 259200000,
      },
      {
        id: 4, funcionarioId: 'u2', funcionarioNome: 'Ana Paula Rodrigues', funcionarioInitials: 'AR',
        nomeContratada: 'Beta Engenharia S.A.', numContrato: '002/2025',
        localEscopo: 'Linha 8-Diamante – Estação Itapevi',
        autorCadastro: 'Ana Paula Rodrigues', responsavelTecnico: 'Eng. Carla Matos',
        naturezaPGA: 'Efluentes', dataEmissao: '2025-02-08', numFormulario: 4,
        autorFormulario: 'Ana Paula Rodrigues',
        dataCadastramento: '2025-02-08', horaCadastramento: '11:45',
        emNumero: 8, emNome: 'E.M. Itapevi',
        municipio: 'Itapevi', linha: 'Linha 8-Diamante', estacao: 'Itapevi',
        origemEfluente: 'Industrial', fonteGeradora: 'Efluente de lavagem',
        quantidadeLitros: 1500, tipoDestinacao: 'Coleta e transporte por caminhão',
        observacoesGerais: 'Efluente oleoso em poço de inspeção.',
        fotos: [], status: 'enviada', createdAt: now - 172800000, updatedAt: now - 172800000,
      },
      // Bruno Ferreira – L9-Esmeralda
      {
        id: 5, funcionarioId: 'u3', funcionarioNome: 'Bruno Ferreira', funcionarioInitials: 'BF',
        nomeContratada: 'Gama Serviços Ambientais', numContrato: '003/2025',
        localEscopo: 'Linha 9-Esmeralda – Campo Limpo Paulista',
        autorCadastro: 'Bruno Ferreira', responsavelTecnico: 'Eng. Renato Souza',
        naturezaPGA: 'Recursos Hídricos', dataEmissao: '2025-02-05', numFormulario: 5,
        autorFormulario: 'Bruno Ferreira',
        dataCadastramento: '2025-02-05', horaCadastramento: '07:50',
        emNumero: 9, emNome: 'E.M. Campo Limpo Paulista',
        municipio: 'Campo Limpo Paulista', linha: 'Linha 9-Esmeralda', estacao: 'Campo Limpo Paulista',
        origemEfluente: 'Pluvial', fonteGeradora: 'Escoamento superficial',
        quantidadeLitros: 3000, observacoesGerais: 'Incremento de vazão após chuvas – possível infiltração.',
        fotos: [], status: 'enviada', createdAt: now - 432000000, updatedAt: now - 432000000,
      },
      {
        id: 6, funcionarioId: 'u3', funcionarioNome: 'Bruno Ferreira', funcionarioInitials: 'BF',
        nomeContratada: 'Gama Serviços Ambientais', numContrato: '003/2025',
        localEscopo: 'Linha 9-Esmeralda – Km 18+500',
        autorCadastro: 'Bruno Ferreira', responsavelTecnico: 'Eng. Renato Souza',
        naturezaPGA: 'Efluentes', dataEmissao: '2025-02-04', numFormulario: 6,
        autorFormulario: 'Bruno Ferreira',
        dataCadastramento: '2025-02-04', horaCadastramento: '16:20',
        emNumero: 9, emNome: 'E.M. Km 18+500',
        municipio: 'Várzea Paulista', linha: 'Linha 9-Esmeralda', estacao: 'Km 18+500',
        kmPoste: '18+500',
        origemEfluente: 'Doméstico', fonteGeradora: 'Fossa séptica',
        quantidadeLitros: 800, observacoesGerais: 'Efluente com coloração suspeita no córrego adjacente.',
        fotos: [], status: 'rascunho', createdAt: now - 518400000, updatedAt: now - 518400000,
      },
      // Fernanda Lima – L10-Turquesa
      {
        id: 7, funcionarioId: 'u4', funcionarioNome: 'Fernanda Lima', funcionarioInitials: 'FL',
        nomeContratada: 'Delta Ambiental Ltda', numContrato: '004/2025',
        localEscopo: 'Linha 10-Turquesa – Calmon Viana',
        autorCadastro: 'Fernanda Lima', responsavelTecnico: 'Eng. Paulo Neves',
        naturezaPGA: 'Resíduos Sólidos', dataEmissao: '2025-02-03', numFormulario: 7,
        autorFormulario: 'Fernanda Lima',
        dataCadastramento: '2025-02-03', horaCadastramento: '10:00',
        emNumero: 10, emNome: 'E.M. Calmon Viana',
        municipio: 'Poá', linha: 'Linha 10-Turquesa', estacao: 'Calmon Viana',
        origemEfluente: 'Outro(a)(s)', fonteGeradora: 'Drenagem de obra',
        quantidadeLitros: 0, observacoesGerais: 'Material de construção descartado irregularmente.',
        fotos: [], status: 'enviada', createdAt: now - 604800000, updatedAt: now - 604800000,
      },
      {
        id: 8, funcionarioId: 'u4', funcionarioNome: 'Fernanda Lima', funcionarioInitials: 'FL',
        nomeContratada: 'Delta Ambiental Ltda', numContrato: '004/2025',
        localEscopo: 'Linha 10-Turquesa – Pátio Guaianases',
        autorCadastro: 'Fernanda Lima', responsavelTecnico: 'Eng. Paulo Neves',
        naturezaPGA: 'Efluentes', dataEmissao: '2025-02-02', numFormulario: 8,
        autorFormulario: 'Fernanda Lima',
        dataCadastramento: '2025-02-02', horaCadastramento: '13:30',
        emNumero: 10, emNome: 'E.M. Pátio Guaianases',
        municipio: 'Guaianases', linha: 'Linha 10-Turquesa', estacao: 'Guaianases',
        origemEfluente: 'Industrial', fonteGeradora: 'Efluente de lavagem',
        quantidadeLitros: 2500, tipoDestinacao: 'Coleta e transporte por caminhão',
        observacoesGerais: 'Vazamento de óleo hidráulico em área de manutenção.',
        fotos: [], status: 'analisada', createdAt: now - 691200000, updatedAt: now - 691200000,
      },
    ]
    persist()
    localStorage.setItem(SEED_KEY, SEED_VERSION)
  }

  return { inspecoes, total, enviadas, rascunhos, recentes, todas, ultimasPorFuncionario, salvarRascunho, enviar, porFuncionario }
})

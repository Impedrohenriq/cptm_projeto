/**
 * api.js — Serviço de comunicação com a API .NET (CPTM Backend)
 *
 * Estratégia:
 *  - Rascunhos ficam só no localStorage (suporte offline/mobile)
 *  - enviar() → POST para a API (salva no Oracle)
 *  - carregarDoServidor() → GET da API (lê do Oracle)
 *  - excluir(chave) → DELETE na API
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
const ENDPOINT = `${BASE}/api/formularios-efluente`

// ─── helpers ─────────────────────────────────────────────────────────────────

function headers() {
  return { 'Content-Type': 'application/json' }
}

async function checarResposta(res) {
  if (res.ok) return res.status === 204 ? null : res.json()
  const texto = await res.text().catch(() => res.statusText)
  throw new Error(`[${res.status}] ${texto}`)
}

// ─── Mapeamento frontend → DTO ───────────────────────────────────────────────

export function paraDto(inspecao) {
  const ano = inspecao.dataEmissao
    ? new Date(inspecao.dataEmissao).getFullYear()
    : new Date().getFullYear()

  const linhaNum = (inspecao.linha ?? '').match(/\d+/)?.[0]?.padStart(2, '0') ?? '00'
  const sigla    = (inspecao.nomeContratada ?? '').split(' - ').pop()
                     ?.replace(/\s/g, '').substring(0, 10) ?? 'CPTM'
  const nr       = String(inspecao.numFormulario ?? 1).padStart(6, '0')

  const chavePrimariaMa =
    inspecao.chavePrimariaMa ?? `EEA.EF-A.${ano}-L.${linhaNum}-${sigla}-N.${nr}`

  const isoData = (ds) => ds ? new Date(ds).toISOString() : new Date().toISOString()

  return {
    chavePrimariaMa,

    // Seção 5 – Identificação do E.M.
    nrElementoMonit: String(inspecao.emNumero ?? 1).padStart(6, '0'),
    nmElementoMonit: inspecao.emNome ?? null,

    // Seção 1 – Premissas Institucionais
    nmContratada:           inspecao.nomeContratada    ?? '',
    nrContrato:             inspecao.numContrato       ?? null,
    nmLocalEscopo:          inspecao.localEscopo       ?? null,
    nmRepresentante:        inspecao.representante     ?? null,
    sgAreaMeioAmbiente:     inspecao.siglaAreaMA       ?? null,
    nmAreaGestoraCptm:      inspecao.nomeAreaGestora   ?? null,
    cdIdentAreaGestora:     inspecao.idAreaGestora     ?? null,
    sgAreaGestoraCptm:      inspecao.siglaAreaGestora  ?? null,
    nmSupervisoraAmbiental: inspecao.nomeSupervisora   ?? null,

    // Seção 2 – Cadastrador / RT
    nmAutorCadastramento:   inspecao.autorCadastro        ?? '',
    nmResponsavelTecnico:   inspecao.responsavelTecnico   ?? '',
    nrRegistroProfissional: inspecao.registroProfissional ?? null,
    dsDocRespTecnica:       inspecao.docRespTecnica        ?? null,

    // Seção 3 – Identificação do Formulário
    dsNaturezaPga:       inspecao.naturezaPGA      ?? null,
    dsTipoFormulario:    'Formulário de Cadastramento - FDC (FDC-EEA.EF)',
    dtEmissaoFormulario: isoData(inspecao.dataEmissao),
    nrFormulario:        String(inspecao.numFormulario ?? 1).padStart(6, '0'),
    nmAutorFormulario:   inspecao.autorFormulario  ?? null,
    nmArquivoFdc:        inspecao.nomeArquivoFdc   ?? null,
    cdArquivoFdc:        inspecao.codigoArquivoFdc ?? null,

    // Seção 4 – Data e Hora do Cadastro
    dtCadastramento:  isoData(inspecao.dataCadastramento),
    hrCadastramento:  inspecao.horaCadastramento ?? null,

    // Seção 6 – Localização
    nmMunicipio:         inspecao.municipio      ?? null,
    nmLinhaCptm:         inspecao.linha          ?? null,
    nmEstacaoCptm:       inspecao.estacao        ?? null,
    nrViaLinhaCptm:      inspecao.viaLinha       ?? null,
    dsTrechoSentidoCptm: inspecao.trechoSentido  ?? null,
    nrKmPoste:           inspecao.kmPoste        ?? null,
    nrLatitude:          inspecao.latitude       ?? null,
    nrLongitude:         inspecao.longitude      ?? null,

    // Seção 7.1 – Regulamentação Ambiental
    dsTipoAtividadeList:  inspecao.tipoAtividadeListada   ?? null,
    dsTipoAtividadeNlist: inspecao.tipoAtividadeNaoListada ?? null,
    dsTipoDraList:        inspecao.tipoDraListado          ?? null,
    dsTipoDraNlist:       inspecao.tipoDraNaoListado       ?? null,
    cdIdentificadorDra:   inspecao.codigoDra               ?? null,
    dtValidadeDra:        inspecao.dataValidadeDra
                            ? new Date(inspecao.dataValidadeDra).toISOString()
                            : null,

    // Seção 7.2 – Detalhamento
    dsTipoAtividadeCptm: inspecao.tipoAtividadeCptm ?? null,
    nmLocalEdificacao:   inspecao.nomeEdificacao    ?? null,
    dsLocalComplemento:  inspecao.complementoLocal  ?? null,
    dsOrigemEfluente:    inspecao.origemEfluente    ?? null,
    dsFonteGeradora:     inspecao.fonteGeradora     ?? null,
    nrQuantidadeLitros:  inspecao.quantidadeLitros  ?? null,
    dsTipoDestinacao:    inspecao.tipoDestinacao    ?? null,
    dsTipoVeiculo:       inspecao.tipoVeiculo       ?? null,
    cdPlacaVeiculo:      inspecao.placaVeiculo      ?? null,
    cdGuiaRemessa:       inspecao.guiaRemessa        ?? null,
    nrDistanciaViaM:     inspecao.distanciaViaM     ?? null,
    dsObservacoesCadastro: inspecao.observacoesGerais ?? null,

    // Seção 7.3 – Fotografias
    fotos: (inspecao.fotos ?? []).map((f, i) => ({
      idFoto:       f.idFoto       ?? null,
      nrFoto:       f.nrFoto       ?? (i + 1),
      fotoBase64:   f.base64       ?? f.fotoBase64 ?? null,
      dsOrientacao: f.orientacao   ?? 'Paisagem/Horizontal',
    })),
  }
}

// ─── Mapeamento DTO → frontend ───────────────────────────────────────────────

export function doDto(dto) {
  return {
    chavePrimariaMa: dto.chavePrimariaMa,
    id:              dto.chavePrimariaMa,

    nomeContratada:    dto.nmContratada,
    numContrato:       dto.nrContrato,
    localEscopo:       dto.nmLocalEscopo,
    representante:     dto.nmRepresentante,
    siglaAreaMA:       dto.sgAreaMeioAmbiente,
    nomeAreaGestora:   dto.nmAreaGestoraCptm,
    idAreaGestora:     dto.cdIdentAreaGestora,
    siglaAreaGestora:  dto.sgAreaGestoraCptm,
    nomeSupervisora:   dto.nmSupervisoraAmbiental,

    autorCadastro:        dto.nmAutorCadastramento,
    responsavelTecnico:   dto.nmResponsavelTecnico,
    registroProfissional: dto.nrRegistroProfissional,
    docRespTecnica:       dto.dsDocRespTecnica,

    naturezaPGA:      dto.dsNaturezaPga,
    dataEmissao:      dto.dtEmissaoFormulario?.split('T')[0],
    numFormulario:    parseInt(dto.nrFormulario, 10),
    autorFormulario:  dto.nmAutorFormulario,
    nomeArquivoFdc:   dto.nmArquivoFdc,
    codigoArquivoFdc: dto.cdArquivoFdc,

    dataCadastramento: dto.dtCadastramento?.split('T')[0],
    horaCadastramento: dto.hrCadastramento,

    emNumero:     parseInt(dto.nrElementoMonit, 10),
    emNome:       dto.nmElementoMonit,
    municipio:    dto.nmMunicipio,
    linha:        dto.nmLinhaCptm,
    estacao:      dto.nmEstacaoCptm,
    viaLinha:     dto.nrViaLinhaCptm,
    trechoSentido: dto.dsTrechoSentidoCptm,
    kmPoste:      dto.nrKmPoste,
    latitude:     dto.nrLatitude,
    longitude:    dto.nrLongitude,

    tipoAtividadeListada:    dto.dsTipoAtividadeList,
    tipoAtividadeNaoListada: dto.dsTipoAtividadeNlist,
    tipoDraListado:          dto.dsTipoDraList,
    tipoDraNaoListado:       dto.dsTipoDraNlist,
    codigoDra:               dto.cdIdentificadorDra,
    dataValidadeDra:         dto.dtValidadeDra?.split('T')[0],

    tipoAtividadeCptm: dto.dsTipoAtividadeCptm,
    nomeEdificacao:    dto.nmLocalEdificacao,
    complementoLocal:  dto.dsLocalComplemento,
    origemEfluente:    dto.dsOrigemEfluente,
    fonteGeradora:     dto.dsFonteGeradora,
    quantidadeLitros:  dto.nrQuantidadeLitros,
    tipoDestinacao:    dto.dsTipoDestinacao,
    tipoVeiculo:       dto.dsTipoVeiculo,
    placaVeiculo:      dto.cdPlacaVeiculo,
    guiaRemessa:       dto.cdGuiaRemessa,
    distanciaViaM:     dto.nrDistanciaViaM,
    observacoesGerais: dto.dsObservacoesCadastro,

    fotos: (dto.fotos ?? []).map(f => ({
      idFoto:      f.idFoto,
      nrFoto:      f.nrFoto,
      base64:      f.fotoBase64,
      orientacao:  f.dsOrientacao,
    })),

    status:     'enviada',
    updatedAt:  dto.dtCadastramento ? new Date(dto.dtCadastramento).getTime() : Date.now(),
    createdAt:  dto.dtCadastramento ? new Date(dto.dtCadastramento).getTime() : Date.now(),
    _fromApi:   true,
  }
}

// ─── Chamadas HTTP ────────────────────────────────────────────────────────────

/** Lista formulários do servidor (paginado) */
export async function listar(pagina = 1, tamanho = 50) {
  const res = await fetch(`${ENDPOINT}?pagina=${pagina}&tamanho=${tamanho}`, {
    headers: headers(),
  })
  const data = await checarResposta(res)
  return (data.itens ?? []).map(doDto)
}

/** Busca um formulário por chave primária */
export async function buscarPorChave(chavePrimariaMa) {
  const res = await fetch(`${ENDPOINT}/${encodeURIComponent(chavePrimariaMa)}`, {
    headers: headers(),
  })
  const data = await checarResposta(res)
  return doDto(data)
}

/** Cria um novo formulário no Oracle */
export async function criar(inspecao) {
  const dto = paraDto(inspecao)
  const res = await fetch(ENDPOINT, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify(dto),
  })
  const data = await checarResposta(res)
  return doDto(data)
}

/** Atualiza um formulário existente no Oracle */
export async function atualizar(inspecao) {
  const dto = paraDto(inspecao)
  const res = await fetch(`${ENDPOINT}/${encodeURIComponent(dto.chavePrimariaMa)}`, {
    method:  'PUT',
    headers: headers(),
    body:    JSON.stringify(dto),
  })
  await checarResposta(res) // 204 No Content
}

/** Remove um formulário do Oracle */
export async function excluir(chavePrimariaMa) {
  const res = await fetch(`${ENDPOINT}/${encodeURIComponent(chavePrimariaMa)}`, {
    method:  'DELETE',
    headers: headers(),
  })
  await checarResposta(res) // 204 No Content
}
